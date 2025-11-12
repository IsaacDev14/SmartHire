Single-database configuration for Flask.

# Migration Best Practices (SmartHire)

- **Always use `flask db` commands** for migrations:
  - `flask db migrate -m "Your message"` to create a migration
  - `flask db upgrade` to apply migrations
  - `flask db downgrade` to revert
- **Never delete migration files** in `migrations/versions/` unless you are resetting the entire database and migration history.
- **Review auto-generated migration scripts** before applying, especially for destructive changes (like `drop_table`).
- **Do not use the Alembic CLI directly** (e.g., `alembic upgrade`), always use Flask-Migrate (`flask db ...`).
- **If you need to reset everything:**
  1. Drop all tables in the database (including `alembic_version`)
  2. Delete all migration files in `migrations/versions/`
  3. Run `flask db init` (if needed)
  4. Run `flask db migrate -m "Initial migration"`
  5. Run `flask db upgrade`
- **Keep this README up to date** with any process changes.

**Centralized migration management ensures safe, reliable, and auditable database changes for all developers.**

---

# Database Reset Scripts

## Complete Reset (Recommended)

For a complete database and migration reset, use the provided scripts:

### Development Environment
```sh
python scripts/environment_reset.py development
```

### Production Environment
```sh
python scripts/environment_reset.py production
```

### Testing Environment
```sh
python scripts/environment_reset.py testing
```

## Data Management

### Clear All Data (Keep Tables)
To clear all data while keeping the table structure:

```sh
python scripts/truncate_tables.py development
python scripts/truncate_tables.py testing
```

**Note**: This will delete all data in the database but keep the table structure intact.

### Manual Reset Steps
If you prefer to reset manually:

1. **Backup migration README:**
   ```sh
   python scripts/backup_migration_readme.py
   ```

2. **Reset database:**
   ```sh
   python scripts/reset_database.py
   ```

3. **Reset migrations:**
   ```sh
   python scripts/reset_migrations.py
   ```

4. **Restore migration README:**
   ```sh
   python scripts/restore_migration_readme.py
   ```

### Script Details

- **`environment_reset.py`**: Complete reset for any environment (development, production, testing)
- **`reset_database.py`**: Resets PostgreSQL database (drops and recreates)
- **`reset_migrations.py`**: Resets migration history and creates fresh migrations
- **`backup_migration_readme.py`**: Backs up the migration README before reset
- **`restore_migration_readme.py`**: Restores the migration README after reset
- **`truncate_tables.py`**: Truncates all tables in the database (for development only)
- **`verify_setup.py`**: Verifies that database and migrations are properly configured

**Note**: Production environment uses environment variables for database credentials and clears tables instead of dropping the database.

---

# Troubleshooting

## Migration Issues

### Tables Not Created After Migration
If migrations run successfully but tables are not created:

1. **Check migration status:**
   ```sh
   flask db current
   ```

2. **Try running upgrade again:**
   ```sh
   flask db upgrade
   ```

3. **If tables still don't exist, create them directly:**
   ```python
   from app import create_app, db
   app = create_app()
   with app.app_context():
       db.create_all()
   ```

### Verification
Always run the verification script after setup:
```sh
python scripts/verify_setup.py
```

---

# PostgreSQL Database Setup & Usage

## 1. Create Database and User

Connect as the `postgres` superuser:
```sh
sudo -u postgres psql
```

Create the database and user (used in this project):
```sql
CREATE DATABASE SmartHire;
CREATE USER smartuser WITH PASSWORD 'smartpassword';
GRANT ALL PRIVILEGES ON DATABASE SmartHireTO smartuser;
```

## 2. Connect to the Database

From your shell:
```sh
psql -U smartuser -d SmartHire-h localhost
```

## 3. Check Tables

Inside the `psql` prompt:
```sql
\dt
```

## 4. Inspect Table Data

To see all users:
```sql
SELECT * FROM "user";
```
To see all sessions:
```sql
SELECT * FROM session;
```

## 5. Change User Password (if needed)
```sql
ALTER USER smartuser WITH PASSWORD 'newpassword';
```

## 6. Reset Alembic Version (if migrations break)
```sql
UPDATE alembic_version SET version_num = '<revision_id>';
```

---

**Database credentials used in this project:**
- DB: `SmartHire`
- User: `smartuser`
- Password: `smartpassword`

**Always use these credentials in your Flask config and when connecting via psql.**
