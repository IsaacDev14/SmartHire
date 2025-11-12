#!/usr/bin/env python3
"""
Truncate all tables in SmartHiredatabase (for development only)
"""
import os
import sys
import subprocess
from typing import List, Dict, Any

# Database configuration
DB_CONFIG = {
    'development': {
        'db_name': 'SmartHire',
        'db_user': 'smartuser',
        'db_password': 'smartpassword',
        'db_host': 'localhost'
    },
    'testing': {
        'db_name': 'SmartHire_test',
        'db_user': 'smartuser',
        'db_password': 'smartpassword',
        'db_host': 'localhost'
    }
}

def get_environment_config(env_name: str) -> Dict[str, Any]:
    """Get configuration for specified environment"""
    if env_name not in DB_CONFIG:
        print(f"Error: Unknown environment '{env_name}'")
        print(f"Available environments: {', '.join(DB_CONFIG.keys())}")
        sys.exit(1)
    return DB_CONFIG[env_name]

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

def get_table_list(env_config: Dict[str, Any]) -> List[str]:
    """Get list of all tables in the database"""
    db_name = env_config['db_name']
    db_user = env_config['db_user']
    db_password = env_config['db_password']
    db_host = env_config['db_host']
    
    command = f"PGPASSWORD={db_password} psql -U {db_user} -d {db_name} -h {db_host} -t -c \"SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename != 'alembic_version';\""
    
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        tables = [line.strip() for line in result.stdout.strip().split('\n') if line.strip()]
        
        # Double-check that alembic_version is not included
        if 'alembic_version' in tables:
            print("Warning: alembic_version table found in list, removing it...")
            tables.remove('alembic_version')
        
        return tables
    except subprocess.CalledProcessError as e:
        print(f"Error getting table list: {e.stderr}")
        return []

def truncate_tables(env_config: Dict[str, Any], tables: List[str]) -> bool:
    """Truncate all tables in the database"""
    db_name = env_config['db_name']
    db_user = env_config['db_user']
    db_password = env_config['db_password']
    db_host = env_config['db_host']
    
    print(f"Found {len(tables)} tables to truncate:")
    for table in tables:
        print(f"  - {table}")
    
    # Build the SQL command to truncate all tables
    table_list = ', '.join([f'"{table}"' for table in tables])
    sql_command = f"TRUNCATE TABLE {table_list} RESTART IDENTITY CASCADE;"
    
    # Write SQL to a temporary file to avoid shell escaping issues
    import tempfile
    with tempfile.NamedTemporaryFile(mode='w', suffix='.sql', delete=False) as f:
        f.write(sql_command)
        temp_file = f.name
    
    try:
        # Execute the truncate command using the file
        command = f"PGPASSWORD={db_password} psql -U {db_user} -d {db_name} -h {db_host} -f {temp_file}"
        
        if not run_command(command, "Truncating all tables"):
            return False
        
        print("All tables truncated successfully!")
        return True
    finally:
        # Clean up temporary file
        import os
        if os.path.exists(temp_file):
            os.unlink(temp_file)

def verify_truncation(env_config: Dict[str, Any], tables: List[str]) -> bool:
    """Verify that all tables are empty"""
    db_name = env_config['db_name']
    db_user = env_config['db_user']
    db_password = env_config['db_password']
    db_host = env_config['db_host']
    
    print("Verifying table truncation...")
    
    for table in tables:
        # Create SQL query to check count
        sql_query = f'SELECT COUNT(*) FROM "{table}";'
        
        # Write SQL to a temporary file
        import tempfile
        with tempfile.NamedTemporaryFile(mode='w', suffix='.sql', delete=False) as f:
            f.write(sql_query)
            temp_file = f.name
        
        try:
            command = f"PGPASSWORD={db_password} psql -U {db_user} -d {db_name} -h {db_host} -t -f {temp_file}"
            
            result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
            count = result.stdout.strip()
            if count == '0':
                print(f"  ✓ {table}: Empty")
            else:
                print(f"  ✗ {table}: {count} rows (should be 0)")
                return False
        except subprocess.CalledProcessError as e:
            print(f"  ✗ {table}: Error checking count")
            return False
        finally:
            # Clean up temporary file
            import os
            if os.path.exists(temp_file):
                os.unlink(temp_file)
    
    print("All tables verified as empty!")
    return True

def verify_migration_state(env_config: Dict[str, Any]) -> bool:
    """Verify that the migration state is preserved"""
    db_name = env_config['db_name']
    db_user = env_config['db_user']
    db_password = env_config['db_password']
    db_host = env_config['db_host']
    
    print("Verifying migration state...")
    
    # Check if alembic_version table exists and has a version
    command = f"PGPASSWORD={db_password} psql -U {db_user} -d {db_name} -h {db_host} -t -c \"SELECT version_num FROM alembic_version;\""
    
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        version = result.stdout.strip()
        if version:
            print(f"  ✓ Migration version preserved: {version}")
            return True
        else:
            print("  ✗ No migration version found")
            return False
    except subprocess.CalledProcessError as e:
        print(f"  ✗ Error checking migration state: {e.stderr}")
        return False

def main():
    """Main function"""
    if len(sys.argv) != 2:
        print("Usage: python truncate_tables.py <environment>")
        print(f"Available environments: {', '.join(DB_CONFIG.keys())}")
        print("\nThis script will truncate all tables in the database.")
        print("WARNING: This will delete all data in the database!")
        sys.exit(1)
    
    env_name = sys.argv[1]
    env_config = get_environment_config(env_name)
    
    print(f"Starting table truncation for {env_name} environment...")
    print("WARNING: This will delete all data in the database!")
    
    # Confirm action
    confirm = input("Are you sure you want to continue? (yes/no): ")
    if confirm.lower() != 'yes':
        print("Operation cancelled.")
        sys.exit(0)
    
    # Get list of tables
    tables = get_table_list(env_config)
    if not tables:
        print("No tables found or error getting table list.")
        sys.exit(1)
    
    # Truncate tables
    if not truncate_tables(env_config, tables):
        sys.exit(1)
    
    # Verify truncation
    if not verify_truncation(env_config, tables):
        print("Error: Some tables were not properly truncated.")
        sys.exit(1)
    
    # Verify migration state
    if not verify_migration_state(env_config):
        print("Error: Migration state was corrupted. Please run 'flask db upgrade' to fix.")
        sys.exit(1)
    
    print(f"\n--- Table truncation completed successfully for {env_name} environment! ---")
    print("All tables have been truncated and sequences reset.")
    print("Migration state has been preserved.")

if __name__ == "__main__":
    main() 