#!/usr/bin/env node
// Promote a Supabase auth user to admin by inserting/updating the user_profiles table.
// Usage:
//   node scripts/promote_admin_user.js admin@example.com

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
        process.env[key] = value.replace(/^"|"$/g, '').replace(/^'|'$/g, '')
      }
    }
  } catch (err) {
    // ignore
  }
}

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

async function findUserByEmail() {
  const res = await request(`/auth/v1/admin/users?email=${encodeURIComponent(email)}`)
  if (!res.ok) return null
  if (Array.isArray(res.body) && res.body.length > 0) return res.body[0]
  return null
}

async function patchProfile(userId) {
  return request(`/rest/v1/user_profiles?user_id=eq.${userId}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: { role: 'admin' }
  })
}

async function insertProfile(userId) {
  return request(`/rest/v1/user_profiles`, {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: {
      user_id: userId,
      full_name: 'Admin User',
      role: 'admin',
      state_code: 'PL',
      lga: 'Jos North',
      ppa: 'Platform Administration'
    }
  })
}

;(async () => {
  console.log(`Using Supabase URL: ${SUPABASE_URL}`)
  console.log(`Target email: ${email}`)

  const user = await findUserByEmail()
  if (!user) {
    console.error('User not found. Make sure the auth user exists: try running reset_admin_user.js first to create the user.')
    process.exit(1)
  }

  const userId = user.id || user.user_id || user.uid
  if (!userId) {
    console.error('Could not determine user id from admin lookup:', user)
    process.exit(2)
  }

  // Try to patch existing profile
  const patched = await patchProfile(userId)
  if (patched.ok && Array.isArray(patched.body) && patched.body.length > 0) {
    console.log('Updated existing user_profiles role to admin:', patched.body)
    process.exit(0)
  }

  // Otherwise insert a new profile
  const inserted = await insertProfile(userId)
  if (inserted.ok) {
    console.log('Inserted new user_profiles record:', inserted.body)
    process.exit(0)
  }

  console.error('Failed to promote user:', patched.status, patched.body, inserted.status, inserted.body)
  process.exit(3)
})()
