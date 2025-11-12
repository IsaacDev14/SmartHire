# app/__init__.py
from flask import Flask, request, session, send_from_directory
from .models import db
from flask_migrate import Migrate
from .config import DevelopmentConfig, ProductionConfig
import os
from flask_cors import CORS
import logging
import json
import uuid
from datetime import datetime, timedelta
from flask.sessions import SessionInterface, SessionMixin
from werkzeug.datastructures import CallbackDict

def create_app(config=None):
    app = Flask(__name__)
    app.secret_key = 'dev-secret-key'  # Ensure static secret key
    
    # Configure session for development
    if os.environ.get('FLASK_ENV') == 'development':
        app.config['SESSION_COOKIE_SECURE'] = False  # Allow HTTP in development
        app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'  # More permissive in development
    else:
        app.config['SESSION_COOKIE_SECURE'] = True
        app.config['SESSION_COOKIE_SAMESITE'] = 'None'
    
    app.config['SESSION_COOKIE_HTTPONLY'] = True
    app.config['SESSION_COOKIE_DOMAIN'] = None

class DatabaseSession(CallbackDict, SessionMixin):
    def __init__(self, initial=None, sid=None, permanent=False):
        def on_update(self):
            self.modified = True
        CallbackDict.__init__(self, initial or {}, on_update)
        self.sid = sid
        self.permanent = permanent
        self.modified = False

class DatabaseSessionInterface(SessionInterface):
    def __init__(self, app):
        self.app = app
        self.permanent = app.config.get('SESSION_PERMANENT', False)
        self.cookie_name = app.config.get('SESSION_COOKIE_NAME', 'session')
        self.cookie_path = app.config.get('SESSION_COOKIE_PATH', '/')
        self.cookie_domain = app.config.get('SESSION_COOKIE_DOMAIN', None)
        self.cookie_secure = app.config.get('SESSION_COOKIE_SECURE', True)
        self.cookie_httponly = app.config.get('SESSION_COOKIE_HTTPONLY', True)
        self.cookie_samesite = app.config.get('SESSION_COOKIE_SAMESITE', 'None')
        self.max_age = app.config.get('SESSION_MAX_AGE', timedelta(days=31))

    def open_session(self, app, request):
        sid = request.cookies.get(self.cookie_name)
        
        app.logger.debug(f"Looking for session with SID: {sid}")
        
        if not sid:
            sid = self._generate_sid()
            app.logger.debug(f"No SID found, generating new: {sid}")
            return DatabaseSession(sid=sid, permanent=self.permanent)

        from .models import db
        session_record = db.session.execute(
            db.text("SELECT * FROM session WHERE session_id = :sid"),
            {"sid": sid}
        ).fetchone()

        if not session_record:
            app.logger.debug(f"No session found in DB for SID: {sid}")
            return DatabaseSession(sid=sid, permanent=self.permanent)

        expiry = session_record.expiry
        if isinstance(expiry, str):
            try:
                expiry = datetime.fromisoformat(expiry.replace('Z', '+00:00'))
            except ValueError:
                app.logger.debug(f"Invalid expiry format: {expiry}")
                return DatabaseSession(sid=sid, permanent=self.permanent)
        
        if expiry < datetime.utcnow():
            app.logger.debug(f"Session expired for SID: {sid}")
            return DatabaseSession(sid=sid, permanent=self.permanent)

        try:
            session_data = json.loads(session_record.data)
            app.logger.debug(f"Session data loaded: {session_data}")
            session = DatabaseSession(session_data, sid=sid, permanent=self.permanent)
            session.modified = False
            return session
        except (json.JSONDecodeError, KeyError) as e:
            app.logger.debug(f"Error loading session data: {e}")
            return DatabaseSession(sid=sid, permanent=self.permanent)

    def save_session(self, app, session, response):
        domain = self.cookie_domain
        if not self.should_set_cookie(app, session):
            return
        
        if session.permanent:
            expiry = datetime.utcnow() + self.max_age
        else:
            expiry = datetime.utcnow() + timedelta(days=1)
        
        session_data = json.dumps(dict(session))
        
        from .models import db
        existing = db.session.execute(
            db.text("SELECT id FROM session WHERE session_id = :sid"),
            {"sid": session.sid}
        ).fetchone()
        
        if existing:
            db.session.execute(
                db.text("UPDATE session SET data = :data, expiry = :expiry WHERE session_id = :sid"),
                {"data": session_data, "expiry": expiry, "sid": session.sid}
            )
        else:
            db.session.execute(
                db.text("INSERT INTO session (session_id, data, expiry) VALUES (:sid, :data, :expiry)"),
                {"sid": session.sid, "data": session_data, "expiry": expiry}
            )
        
        db.session.commit()
        
        response.set_cookie(
            self.cookie_name,
            session.sid,
            max_age=self.max_age.total_seconds() if session.permanent else None,
            expires=expiry if session.permanent else None,
            path=self.cookie_path,
            domain=domain,
            secure=self.cookie_secure,
            httponly=self.cookie_httponly,
            samesite=self.cookie_samesite
        )

    def _generate_sid(self):
        return str(uuid.uuid4())

def create_app(config=None):
    app = Flask(__name__)
    app.secret_key = 'dev-secret-key'
    
    app.config['SESSION_COOKIE_SECURE'] = True
    app.config['SESSION_COOKIE_SAMESITE'] = 'None'
    app.config['SESSION_COOKIE_HTTPONLY'] = True
    app.config['SESSION_COOKIE_DOMAIN'] = None
    
    allowed_origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://smart-hire-beta.vercel.app",
        "https://smart-hire-beta.vercel.app/"
    ]
    
    CORS(
        app,
        origins=allowed_origins,
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization", "X-Requested-With", "Accept"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        expose_headers=["Content-Type", "Authorization"],
        max_age=86400
    )
    
    @app.after_request
    def after_request(response):
        if 'Access-Control-Allow-Origin' not in response.headers:
            origin = request.headers.get('Origin')
            if origin in allowed_origins:
                response.headers.add('Access-Control-Allow-Origin', origin)
                response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With,Accept')
                response.headers.add('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH')
                response.headers.add('Access-Control-Allow-Credentials', 'true')
                response.headers.add('Access-Control-Max-Age', '86400')
        return response
    
    @app.route('/', defaults={'path': ''}, methods=['OPTIONS'])
    @app.route('/<path:path>', methods=['OPTIONS'])
    def handle_options(path):
        response = app.make_default_options_response()
        origin = request.headers.get('Origin')
        if origin in allowed_origins:
            response.headers.add('Access-Control-Allow-Origin', origin)
            response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With,Accept')
            response.headers.add('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH')
            response.headers.add('Access-Control-Allow-Credentials', 'true')
            response.headers.add('Access-Control-Max-Age', '86400')
        return response
    
    if config:
        app.config.from_object(config)
    else:
        env = os.environ.get('FLASK_ENV', 'development')
        if env == 'production':
            app.config.from_object(ProductionConfig)
        else:
            app.config.from_object(DevelopmentConfig)
    
    db.init_app(app)
    Migrate(app, db)
    
    app.session_interface = DatabaseSessionInterface(app)
    
    logging.basicConfig(level=logging.DEBUG)
    
    from .routes import auth_bp
    app.register_blueprint(auth_bp)
    
    @app.route('/uploads/avatars/<filename>')
    def uploaded_avatar(filename):
        uploads_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'uploads', 'avatars')
        return send_from_directory(uploads_path, filename)
    
    @app.before_request
    def suppress_avatar_logging():
        if request.path.startswith('/uploads/avatars/'):
            logging.getLogger('werkzeug').setLevel(logging.WARNING)
        else:
            logging.getLogger('werkzeug').setLevel(logging.INFO)
    
    # ✅ Hardcoded Gmail credentials
    app.config['GMAIL_USER'] = 'demo@gmail.com'
    app.config['GMAIL_APP_PASSWORD'] = 'gqslabpcfzrzgvke'
    app.config['GMAIL_SMTP_HOST'] = 'smtp.gmail.com'
    app.config['GMAIL_SMTP_PORT'] = 465
    
    # ✅ Hardcoded frontend URL
    app.config['FRONTEND_URL'] = 'https://smart-hire-beta.vercel.app'
    
    return app
