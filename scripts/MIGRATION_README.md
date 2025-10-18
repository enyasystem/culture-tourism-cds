Migration helper

This folder contains a helper script to apply the `scripts/012_add_author_id_to_stories.sql` migration using the Supabase CLI.

Files
- `apply_migration_with_supabase_cli.sh` — copies the migration into `supabase/migrations` with a timestamped filename and runs `supabase db push` if the Supabase CLI is installed; otherwise prints a psql fallback command.

Quick steps
1. Ensure Supabase CLI is installed and you are logged in:

```bash
# Install: https://supabase.com/docs/guides/cli
supabase login
# Link to your project (use your project ref from the Supabase dashboard)
supabase link --project-ref <your-project-ref>
```

2. Run the helper script from the repo root:

```bash
./scripts/apply_migration_with_supabase_cli.sh
```

3. If the script detects the Supabase CLI it will run `supabase db push`. Otherwise it will print a `psql` command you can run manually (replace credentials accordingly).

Verification

- Confirm the column exists:

```bash
# example using psql directly
psql "postgresql://<DB_USER>:<DB_PASS>@<DB_HOST>:<DB_PORT>/<DB_NAME>?sslmode=require" -c "SELECT column_name, data_type FROM information_schema.columns WHERE table_name='stories' AND column_name='author_id';"
```

- Or in psql run:

```bash
\d+ stories
```

PostgREST / Supabase API cache refresh

- Hosted Supabase: open the project dashboard and look for a way to restart the API (Project Settings → API). If there is no explicit restart control, wait a minute and retry your API calls.
- Self-hosted: restart the PostgREST service or the Docker container:

```bash
# systemd example
sudo systemctl restart postgrest

# docker-compose example
docker-compose restart postgrest
```

Notes
- Always keep backups for production systems before running migrations.
- If you want, I can prepare a backfill script to populate `author_name` for existing stories from `profiles` (safe default: only update rows where `author_id` or `author_name` is NULL).
