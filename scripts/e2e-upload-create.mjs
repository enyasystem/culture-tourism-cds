#!/usr/bin/env node
/*
 * e2e-upload-create.mjs
 *
 * Usage:
 *   node ./scripts/e2e-upload-create.mjs /path/to/image.png "Optional Title"
 *
 * Environment variables required:
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 * Optional:
 *   NEXT_PUBLIC_SUPABASE_BUCKET (defaults to 'stories')
 *
 * This script uploads the file to the storage bucket (public) then inserts a
 * row into the `stories` table with the public URL as `cover_image`.
 */

import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

function guessContentType(filename) {
  const ext = path.extname(filename).toLowerCase().replace('.', '')
  const map = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
  }
  return map[ext] || 'application/octet-stream'
}

async function main() {
  const args = process.argv.slice(2)
  if (args.length < 1) {
    console.error('Usage: node scripts/e2e-upload-create.mjs /path/to/image.png "Optional Title"')
    process.exit(2)
  }

  const filePath = args[0]
  const title = args[1] || `E2E upload ${Date.now()}`

  const SUPABASE_URL = process.env.SUPABASE_URL
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
  const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'stories'

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.')
    process.exit(3)
  }

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`)
    process.exit(4)
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  const fileBuffer = fs.readFileSync(filePath)
  const filename = path.basename(filePath).replace(/[^a-zA-Z0-9.\-_]/g, '_')
  const destPath = `scripts/${Date.now()}-${filename}`
  const contentType = guessContentType(filename)

  console.log('Uploading', filePath, '->', destPath, 'content-type:', contentType)

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(destPath, fileBuffer, {
    contentType,
    upsert: false,
  })

  if (uploadError) {
    console.error('Upload failed:', uploadError)
    process.exit(5)
  }

  const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${encodeURIComponent(destPath)}`
  console.log('Uploaded. Public URL:', publicUrl)

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 200)
  const payload = {
    title,
    slug,
    summary: 'Uploaded via e2e script',
    body: 'This story was created by an automated e2e test script.',
    published: false,
    cover_image: publicUrl,
  }

  console.log('Inserting story row...', { title: payload.title })
  // Attempt insertion with retries for transient PostgREST schema-cache errors (PGRST204)
  async function sleep(ms) {
    return new Promise((res) => setTimeout(res, ms))
  }

  async function insertWithRetry(supabase, payload, maxAttempts = 8) {
    let attempt = 0
    let backoff = 500
    while (attempt < maxAttempts) {
      attempt += 1
      try {
        const { data, error } = await supabase.from('stories').insert(payload).select()
        if (!error) return { data }

        // If this is a PostgREST schema-cache error, retry with backoff
        if (error && error.code === 'PGRST204') {
          console.warn(`Insert attempt ${attempt} failed with PGRST204 (schema cache). Retrying in ${backoff}ms...`)
          await sleep(backoff)
          backoff = Math.min(8000, backoff * 2)
          continue
        }

        // Non-retryable error
        return { error }
      } catch (e) {
        console.warn(`Insert attempt ${attempt} threw:`, e)
        await sleep(backoff)
        backoff = Math.min(8000, backoff * 2)
      }
    }
    return { error: { message: 'Max attempts reached while trying to insert story' } }
  }

  const { data, error: insertError } = await insertWithRetry(supabase, payload)

  if (insertError) {
    console.error('Insert failed:', insertError)
    process.exit(6)
  }

  console.log('Insert successful. Row:', data && data[0])
  process.exit(0)
}

main().catch((err) => {
  console.error('Unexpected error', err)
  process.exit(1)
})
