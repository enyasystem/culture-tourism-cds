#!/usr/bin/env node
// Small utility to create or reset an auth user in Supabase using the
// service_role key. Safe to run locally. It will:
// 1. Try to create the user (POST /auth/v1/admin/users)
// 2. If user already exists, find the user by email and PATCH the password
// Usage:
//   node scripts/reset_admin_user.js admin@example.com password
// Or provide env vars (recommended):
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/reset_admin_user.js admin@example.com password

const fs = require('fs')
const path = require('path')

function loadEnvFile(envPath) {
  try {
    const src = fs.readFileSync(envPath, 'utf8')
    const lines = src.split(/\r?\n/)
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const idx = trimmed.indexOf('=')
      if (idx === -1) continue
      const key = trimmed.slice(0, idx)
      const value = trimmed.slice(idx + 1)
      if (!(key in process.env)) {
        // remove surrounding quotes if present
        process.env[key] = value.replace(/^"|"$/g, '').replace(/^'|'$/g, '')
      }
    }
  } catch (err) {
    // ignore if file not found
  }
}

// Try to populate env from repo .env if values are missing
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  const repoRoot = path.resolve(__dirname, '..')
  const envPath = path.join(repoRoot, '.env')
  loadEnvFile(envPath)
}

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Set them in environment or in .env')
  process.exit(1)
}

const email = process.argv[2] || 'admin@example.com'
const password = process.argv[3] || 'password'

async function request(pathSuffix, opts = {}) {
  const url = `${SUPABASE_URL.replace(/\/$/, '')}${pathSuffix}`
  const headers = Object.assign({}, opts.headers || {}, {
    apikey: SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
  })
  const body = opts.body ? JSON.stringify(opts.body) : undefined
  const res = await fetch(url, { method: opts.method || 'GET', headers, body })
  const text = await res.text()
  let json = null
  try { json = JSON.parse(text) } catch (e) { /* not json */ }
  return { ok: res.ok, status: res.status, body: json ?? text }
}

async function createUser() {
  // Supabase admin create endpoint
  return request('/auth/v1/admin/users', {
    method: 'POST',
    body: {
      email,
      password,
      email_confirm: true
    }
  })
}

async function findUserByEmail() {
  // List users filtered by email - this query parameter is supported on the
  // admin REST endpoints in most Supabase instances.
  const res = await request(`/auth/v1/admin/users?email=${encodeURIComponent(email)}`)
  if (!res.ok) return null
  // res.body should be an array
  if (Array.isArray(res.body) && res.body.length > 0) return res.body[0]
  return null
}

async function updateUserPassword(userId) {
  return request(`/auth/v1/admin/users/${userId}`, {
    method: 'PATCH',
    body: { password, email_confirm: true }
  })
}

;(async () => {
  console.log(`Using Supabase URL: ${SUPABASE_URL}`)
  console.log(`Target email: ${email}`)

  // Try create
  const created = await createUser()
  if (created.ok) {
    console.log(`User created: ${email}`)
    console.log(created.body)
    process.exit(0)
  }

  console.log('Create user response:', created.status, created.body)

  // If creation failed, try to find the user and update password
  const existing = await findUserByEmail()
  if (!existing) {
    console.error('Could not find existing user to update. Inspect create response above.')
    process.exit(2)
  }

  const uid = existing.id || existing.user_id || existing.aud || existing.uid
  if (!uid) {
    console.error('Unable to determine user id from lookup result:', existing)
    process.exit(3)
  }

  const updated = await updateUserPassword(uid)
  if (updated.ok) {
    console.log(`Password updated for user ${email}`)
    console.log(updated.body)
    process.exit(0)
  }

  console.error('Failed to update user password:', updated.status, updated.body)
  process.exit(4)
})()
