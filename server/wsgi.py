from app import create_app
from app.config import ProductionConfig
from app.models import db
import os
import time
import sys
from alembic import command
from alembic.config import Config

app = create_app(ProductionConfig)

# Auto-migrate database on startup
def setup_database():
    max_retries = 5
    retry_delay = 3
    
    print("=== SmartHireDatabase Setup ===")
    print(f"Environment DATABASE_URL: {os.environ.get('DATABASE_URL', 'NOT SET')}")
    print(f"App Database URL: {app.config.get('SQLALCHEMY_DATABASE_URI', 'NOT SET')}")
    
    for attempt in range(max_retries):
        try:
            with app.app_context():
                # Test database connection first
                print(f"Attempt {attempt + 1}: Testing database connection...")
                connection = db.engine.connect()
                connection.close()
                print(f"Database connection successful!")
                
                # Run Alembic migrations to ensure schema is up to date
                print("Running database migrations...")
                database_url = app.config.get('SQLALCHEMY_DATABASE_URI')
                
                # Set up Alembic configuration
                alembic_cfg = Config()
                alembic_cfg.set_main_option("script_location", "migrations")
                alembic_cfg.set_main_option("sqlalchemy.url", database_url)
                
                # Check if migrations directory exists and has content
                migrations_dir = "migrations"
                if not os.path.exists(migrations_dir):
                    print("Migrations directory not found, skipping migrations")
                else:
                    try:
                        command.upgrade(alembic_cfg, "head")
                        print("Database migrations completed successfully!")
                    except Exception as migration_error:
                        print(f"Migration failed: {migration_error}")
                        print("Continuing with database creation...")
                
                # Create any missing tables (for new models not yet migrated)
                print("Creating any missing tables...")
                db.create_all()
                print("Database tables created successfully!")
                
                # Verify tables were created
                from sqlalchemy import text
                result = db.session.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"))
                tables = [row[0] for row in result]
                print(f"Available tables: {tables}")
                
                # Test if user table exists and is accessible
                if 'user' in tables:
                    print("SUCCESS: User table exists and is accessible!")
                    # Test a simple query
                    result = db.session.execute(text("SELECT COUNT(*) FROM \"user\""))
                    count = result.scalar()
                    print(f"User table has {count} records")
                    
                    # Check if email_verified column exists
                    result = db.session.execute(text("""
                        SELECT column_name 
                        FROM information_schema.columns 
                        WHERE table_name = 'user' AND column_name = 'email_verified'
                    """))
                    if result.fetchone():
                        print("✓ email_verified column exists")
                    else:
                        print("⚠ email_verified column missing - this may cause issues")
                    
                    return True
                else:
                    print("ERROR: User table was not created!")
                    raise Exception("User table not found after creation")
                
        except Exception as e:
            print(f"Database setup attempt {attempt + 1} failed: {e}")
            if attempt < max_retries - 1:
                print(f"Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
                retry_delay *= 1.5
            else:
                print("CRITICAL: Database setup failed after all retries!")
                print("The app will start but database operations will fail.")
                return False

# Run database setup on startup
print("=== SmartHireWSGI Startup ===")
success = setup_database()
if success:
    print("=== Database setup completed successfully ===")
else:
    print("=== Database setup failed - app will start with limited functionality ===")
print("=== WSGI Startup Complete ===")

if __name__ == '__main__':
    app.run()
