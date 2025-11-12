# Database and Migration Scripts

This folder contains scripts for managing the SmartHiredatabase and migrations.

## Available Scripts

### Complete Reset Scripts

- **`environment_reset.py`** - Complete reset for any environment (development, production, testing)
  ```sh
  python scripts/environment_reset.py development
  python scripts/environment_reset.py production
  python scripts/environment_reset.py testing
  ```

### Individual Reset Scripts

- **`full_reset.py`** - Orchestrates the complete reset process (legacy)
- **`reset_database.py`** - Resets PostgreSQL database (drops and recreates)
- **`reset_migrations.py`** - Resets migration history and creates fresh migrations
- **`backup_migration_readme.py`** - Backs up the migration README before reset
- **`restore_migration_readme.py`** - Restores the migration README after reset

### Data Management Scripts

- **`truncate_tables.py`** - Truncates all tables in the database (for development only)
  ```sh
  python scripts/truncate_tables.py development
  python scripts/truncate_tables.py testing
  ```

### Verification Scripts

- **`verify_setup.py`** - Verifies that database and migrations are properly configured
  ```sh
  python scripts/verify_setup.py
  ```

## Usage

### For Development
```sh
# Complete reset (recommended)
python scripts/environment_reset.py development

# Clear all data (keeps tables, removes data)
python scripts/truncate_tables.py development

# Verify setup
python scripts/verify_setup.py
```

### For Production
```sh
# Complete reset (uses environment variables)
python scripts/environment_reset.py production
```

### For Testing
```sh
# Complete reset
python scripts/environment_reset.py testing

# Clear test data
python scripts/truncate_tables.py testing
```

## Environment Variables for Production

When using the production environment, set these environment variables:

```sh
export DATABASE_NAME="your_production_db"
export DATABASE_USER="your_production_user"
export DATABASE_PASSWORD="your_production_password"
export DATABASE_HOST="your_production_host"
```

## Database Credentials

- **Development/Testing**: 
  - Database: `SmartHire`
  - User: `smartuser`
  - Password: `smartpassword`
  - Host: `localhost`

- **Production**: Uses environment variables (see above)

## Script Details

### Reset Scripts
- **`environment_reset.py`**: Complete reset for any environment (development, production, testing)
- **`reset_database.py`**: Resets PostgreSQL database (drops and recreates)
- **`reset_migrations.py`**: Resets migration history and creates fresh migrations
- **`backup_migration_readme.py`**: Backs up the migration README before reset
- **`restore_migration_readme.py`**: Restores the migration README after reset

### Data Management Scripts
- **`truncate_tables.py`**: Truncates all tables in the database, resets sequences, and verifies the operation
  - Uses temporary files to avoid shell escaping issues with reserved keywords like "user"
  - Includes confirmation prompt and verification
  - Automatically discovers all tables in the database

### Verification Scripts
- **`verify_setup.py`**: Verifies that database and migrations are properly configured
  - Uses file-based SQL execution to handle reserved keywords properly

## Notes

- Production environment clears tables instead of dropping the database
- All scripts handle active connections automatically
- Migration README is automatically backed up and restored
- Scripts are designed to work across different environments
- Truncate script includes confirmation prompt and verification
- Truncate script automatically discovers all tables in the database
- Scripts use temporary files for SQL execution to avoid shell escaping issues with reserved keywords

## Troubleshooting

### Migration State Corruption

If you encounter `relation "session" does not exist` errors after running the truncate script, it may be due to migration state corruption. This can happen if the `alembic_version` table is accidentally affected.

**Symptoms:**
- Flask application shows `UndefinedTable` errors for the `session` table
- Migration system shows it's at the head, but tables don't exist
- Only `alembic_version` table exists in the database

**Solution:**
1. Clear the migration state: `DELETE FROM alembic_version;`
2. Recreate tables: `flask db upgrade`
3. Verify setup: `python scripts/verify_setup.py`

**Prevention:**
The updated `truncate_tables.py` script now includes:
- Double-checking that `alembic_version` is excluded from truncation
- Verification that migration state is preserved after truncation
- Clear error messages if migration state is corrupted 
- Scripts use temporary files for SQL execution to avoid shell escaping issues with reserved keywords 