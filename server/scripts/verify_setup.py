#!/usr/bin/env python3
"""
Verify database and migration setup
"""
import os
import sys
import subprocess

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"Running: {description}")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"Success: {description}")
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"Error: {description}")
        print(f"Command: {command}")
        print(f"Error: {e.stderr}")
        return None

def verify_setup():
    """Verify that database and migrations are properly set up"""
    print("Verifying database and migration setup...")
    
    # Check migration status
    migration_status = run_command("flask db current", "Checking migration status")
    if not migration_status:
        return False
    
    # Check database tables
    tables_output = run_command("PGPASSWORD=smartpassword psql -U smartuser -d SmartHire-h localhost -c \"\\dt\"", "Checking database tables")
    if not tables_output:
        return False
    
    # Check if session table exists
    session_check = run_command("PGPASSWORD=smartpassword psql -U smartuser -d SmartHire-h localhost -c \"SELECT COUNT(*) FROM session;\"", "Checking session table")
    if not session_check:
        return False
    
    # Check if user table exists (using file to avoid shell escaping issues)
    import tempfile
    with tempfile.NamedTemporaryFile(mode='w', suffix='.sql', delete=False) as f:
        f.write('SELECT COUNT(*) FROM "user";')
        temp_file = f.name
    
    try:
        user_check = run_command(f"PGPASSWORD=smartpassword psql -U smartuser -d SmartHire-h localhost -f {temp_file}", "Checking user table")
        if not user_check:
            return False
    finally:
        import os
        if os.path.exists(temp_file):
            os.unlink(temp_file)
    
    # Test Flask application
    print("Testing Flask application...")
    test_app = run_command("curl -s http://localhost:5000/notifications/unread-count", "Testing Flask application")
    if test_app and "Not authenticated" in test_app:
        print("Success: Flask application is responding correctly")
    else:
        print("Warning: Flask application may not be running or responding")
    
    print("\n--- Setup verification completed successfully! ---")
    print("Your database and migrations are properly configured.")
    return True

if __name__ == "__main__":
    if not verify_setup():
        sys.exit(1) 