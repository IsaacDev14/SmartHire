#!/usr/bin/env python3
"""
Reset PostgreSQL database completely
"""
import os
import subprocess
import sys

# Database configuration
DB_NAME = "SmartHire"
DB_USER = "smartuser"
DB_PASSWORD = "smartpassword"
DB_HOST = "localhost"

def run_command(command, description):
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

def reset_database():
    """Reset the PostgreSQL database completely"""
    print("Starting database reset process...")
    
    # Step 1: Terminate all connections to the database
    terminate_connections = f"sudo -u postgres psql -c \"SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '{DB_NAME}' AND pid <> pg_backend_pid();\""
    run_command(terminate_connections, "Terminating active connections")
    
    # Step 2: Drop the database if it exists
    drop_db_command = f"sudo -u postgres psql -c \"DROP DATABASE IF EXISTS {DB_NAME};\""
    if not run_command(drop_db_command, "Dropping existing database"):
        return False
    
    # Step 3: Drop the user if it exists
    drop_user_command = f"sudo -u postgres psql -c \"DROP USER IF EXISTS {DB_USER};\""
    if not run_command(drop_user_command, "Dropping existing user"):
        return False
    
    # Step 4: Create the user
    create_user_command = f"sudo -u postgres psql -c \"CREATE USER {DB_USER} WITH PASSWORD '{DB_PASSWORD}';\""
    if not run_command(create_user_command, "Creating database user"):
        return False
    
    # Step 5: Create the database
    create_db_command = f"sudo -u postgres psql -c \"CREATE DATABASE {DB_NAME} OWNER {DB_USER};\""
    if not run_command(create_db_command, "Creating database"):
        return False
    
    # Step 6: Grant privileges
    grant_command = f"sudo -u postgres psql -c \"GRANT ALL PRIVILEGES ON DATABASE {DB_NAME} TO {DB_USER};\""
    if not run_command(grant_command, "Granting privileges"):
        return False
    
    # Step 7: Test connection
    test_command = f"PGPASSWORD={DB_PASSWORD} psql -U {DB_USER} -d {DB_NAME} -h {DB_HOST} -c \"SELECT 1;\""
    if not run_command(test_command, "Testing database connection"):
        return False
    
    print("Database reset completed successfully!")
    return True

if __name__ == "__main__":
    if not reset_database():
        sys.exit(1) 