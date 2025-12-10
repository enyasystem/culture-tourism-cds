export async function uploadBufferToVercel(buffer: Buffer, name: string, contentType = 'application/octet-stream') {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) throw new Error('BLOB_READ_WRITE_TOKEN not configured')

  // Create a new blob (this returns an upload URL)
  const createRes = await fetch('https://api.vercel.com/v1/blob', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  })

  if (!createRes.ok) {
    const text = await createRes.text()
    throw new Error(`Vercel create blob failed: ${createRes.status} ${text}`)
  }

  const createJson = await createRes.json()
  // Expected shape: { id, uploadURL, url }
  const uploadURL: string | undefined = createJson.uploadURL || createJson.upload_url || createJson.uploadUrl
  const publicUrl: string | undefined = createJson.url || createJson.publicUrl || createJson.id

  if (!uploadURL) throw new Error('Vercel create response missing uploadURL')

  // Upload bytes to the provided uploadURL
  const putRes = await fetch(uploadURL, {
    method: 'PUT',
    headers: {
      'Content-Type': contentType,
    },
    body: buffer,
  })

  if (!putRes.ok) {
    const text = await putRes.text()
    throw new Error(`Vercel upload failed: ${putRes.status} ${text}`)
  }

  // If API provided a public URL return it, otherwise try to build one from id
  if (publicUrl && typeof publicUrl === 'string') return publicUrl

  if (createJson.id) return `https://vercel.com/blob/${createJson.id}`

  return null
}
