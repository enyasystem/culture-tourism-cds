#!/usr/bin/env bash
set -euo pipefail

# Apply the SQL migration using the Supabase CLI if available.
# - Copies scripts/012_add_author_id_to_stories.sql into supabase/migrations with a timestamp
# - Runs `supabase db push` to apply migrations
# Fallback: prints the psql one-liner to run manually.

MIG_SRC="scripts/012_add_author_id_to_stories.sql"
MIG_DIR="supabase/migrations"

if [ ! -f "$MIG_SRC" ]; then
  echo "Migration source not found: $MIG_SRC"
  exit 1
fi

mkdir -p "$MIG_DIR"
TIMESTAMP=$(date +%Y%m%d%H%M%S)
MIG_DST="$MIG_DIR/${TIMESTAMP}_add_author_id_to_stories.sql"
cp "$MIG_SRC" "$MIG_DST"
chmod 644 "$MIG_DST"

echo "Created migration: $MIG_DST"

if command -v supabase >/dev/null 2>&1; then
  echo "Supabase CLI found. Running: supabase db push"
  echo "(Make sure you've run 'supabase login' and 'supabase link' if needed.)"
  supabase db push
  echo "supabase db push finished. Verify the change in your Supabase dashboard or by running the checks in the checklist."
else
  echo "Supabase CLI not found. To apply migration with supabase CLI, install it: https://supabase.com/docs/guides/cli"
  echo "Fallback: run the psql command below (replace with your connection string):"
  echo
  echo "psql \"postgresql://<DB_USER>:<DB_PASS>@<DB_HOST>:<DB_PORT>/<DB_NAME>?sslmode=require\" -f $MIG_DST"
  echo
fi
