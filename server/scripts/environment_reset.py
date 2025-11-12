#!/usr/bin/env python3
"""
Environment-aware database and migration reset script
"""
import os
import sys
import subprocess
from typing import Dict, Any

# Environment configurations
ENVIRONMENTS = {
    'development': {
        'db_name': 'SmartHire',
        'db_user': 'smartuser',
        'db_password': 'smartpassword',
        'db_host': 'localhost',
        'flask_env': 'development'
    },
    'production': {
        'db_name': os.environ.get('DATABASE_NAME', 'SmartHire'),
        'db_user': os.environ.get('DATABASE_USER', 'smartuser'),
        'db_password': os.environ.get('DATABASE_PASSWORD', 'smartpassword'),
        'db_host': os.environ.get('DATABASE_HOST', 'localhost'),
        'flask_env': 'production'
    },
    'testing': {
        'db_name': 'SmartHire_test',
        'db_user': 'smartuser',
        'db_password': 'smartpassword',
        'db_host': 'localhost',
        'flask_env': 'testing'
    }
}

def get_environment_config(env_name: str) -> Dict[str, Any]:
    """Get configuration for specified environment"""
    if env_name not in ENVIRONMENTS:
        print(f"Error: Unknown environment '{env_name}'")
        print(f"Available environments: {', '.join(ENVIRONMENTS.keys())}")
        sys.exit(1)
    return ENVIRONMENTS[env_name]

def run_command(command: str, description: str) -> bool:
    """Run a command and handle errors"""
    print(f"Running: {description}")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"Success: {description}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error: {description}")
        print(f"Command: {command}")
        print(f"Error: {e.stderr}")
        return False

def reset_database_for_environment(env_config: Dict[str, Any]) -> bool:
    """Reset database for specific environment"""
    print(f"Resetting database for environment...")
    
    db_name = env_config['db_name']
    db_user = env_config['db_user']
    db_password = env_config['db_password']
    db_host = env_config['db_host']
    
    # For production, we can't drop/recreate the database, so we'll just clear tables
    if env_config['flask_env'] == 'production':
        print("Production environment detected - clearing tables instead of dropping database")
        
        # Terminate connections
        terminate_cmd = f"PGPASSWORD={db_password} psql -U {db_user} -d {db_name} -h {db_host} -c \"SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '{db_name}' AND pid <> pg_backend_pid();\""
        run_command(terminate_cmd, "Terminating active connections")
        
        # Drop all tables except alembic_version
        drop_tables_cmd = f"PGPASSWORD={db_password} psql -U {db_user} -d {db_name} -h {db_host} -c \"DROP SCHEMA public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO {db_user};\""
        if not run_command(drop_tables_cmd, "Clearing all tables"):
            return False
    else:
        # For development/testing, we can drop and recreate the database
        if db_host == 'localhost':
            # Terminate connections
            terminate_connections = f"sudo -u postgres psql -c \"SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '{db_name}' AND pid <> pg_backend_pid();\""
            run_command(terminate_connections, "Terminating active connections")
            
            # Drop database
            drop_db_command = f"sudo -u postgres psql -c \"DROP DATABASE IF EXISTS {db_name};\""
            if not run_command(drop_db_command, "Dropping existing database"):
                return False
            
            # Drop user
            drop_user_command = f"sudo -u postgres psql -c \"DROP USER IF EXISTS {db_user};\""
            if not run_command(drop_user_command, "Dropping existing user"):
                return False
            
            # Create user
            create_user_command = f"sudo -u postgres psql -c \"CREATE USER {db_user} WITH PASSWORD '{db_password}';\""
            if not run_command(create_user_command, "Creating database user"):
                return False
            
            # Create database
            create_db_command = f"sudo -u postgres psql -c \"CREATE DATABASE {db_name} OWNER {db_user};\""
            if not run_command(create_db_command, "Creating database"):
                return False
            
            # Grant privileges
            grant_command = f"sudo -u postgres psql -c \"GRANT ALL PRIVILEGES ON DATABASE {db_name} TO {db_user};\""
            if not run_command(grant_command, "Granting privileges"):
                return False
    
    # Test connection
    test_command = f"PGPASSWORD={db_password} psql -U {db_user} -d {db_name} -h {db_host} -c \"SELECT 1;\""
    if not run_command(test_command, "Testing database connection"):
        return False
    
    print("Database reset completed successfully!")
    return True

def reset_migrations() -> bool:
    """Reset migrations and create fresh migration history"""
    print("Starting migration reset process...")
    
    # Remove migrations folder if it exists
    migrations_path = "migrations"
    if os.path.exists(migrations_path):
        import shutil
        shutil.rmtree(migrations_path)
        print("Removed existing migrations folder")
    
    # Initialize migrations
    if not run_command("flask db init", "Initializing migrations"):
        return False
    
    # Create initial migration
    if not run_command("flask db migrate -m \"Initial migration\"", "Creating initial migration"):
        return False
    
    # Apply migrations
    if not run_command("flask db upgrade", "Applying migrations"):
        return False
    
    print("Migration reset completed successfully!")
    return True

def main():
    """Main function"""
    if len(sys.argv) != 2:
        print("Usage: python environment_reset.py <environment>")
        print(f"Available environments: {', '.join(ENVIRONMENTS.keys())}")
        sys.exit(1)
    
    env_name = sys.argv[1]
    env_config = get_environment_config(env_name)
    
    print(f"Starting complete reset for {env_name} environment...")
    
    # Set Flask environment
    os.environ['FLASK_ENV'] = env_config['flask_env']
    
    # Backup migration README
    backup_script = "python scripts/backup_migration_readme.py"
    if not run_command(backup_script, "Backing up migration README"):
        return False
    
    # Reset database for environment
    if not reset_database_for_environment(env_config):
        return False
    
    # Reset migrations
    if not reset_migrations():
        return False
    
    # Restore migration README
    restore_script = "python scripts/restore_migration_readme.py"
    if not run_command(restore_script, "Restoring migration README"):
        return False
    
    print(f"\n--- Complete reset finished successfully for {env_name} environment! ---")
    print("Your database and migrations have been reset to a clean state.")
    return True

if __name__ == "__main__":
    if not main():
        sys.exit(1) 