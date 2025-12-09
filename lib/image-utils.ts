export function normalizeImages(value: any, cover?: string | null): string[] {
  let images: string[] = []

  const pushValue = (val: any) => {
    if (val == null) return
    if (Array.isArray(val)) {
      val.forEach(pushValue)
      return
    }
    if (typeof val === 'string') {
      const s = val.trim()
      // If the string looks like a JSON array, try parsing
      if (s.startsWith('[') && s.endsWith(']')) {
        try {
          const parsed = JSON.parse(s)
          pushValue(parsed)
          return
        } catch (e) {
          // fallthrough to treat as plain string
        }
      }
      images.push(s)
      return
    }
    // fallback stringify
    images.push(String(val))
  }

  pushValue(value)

  // Fallback to cover image when no images found
  if (images.length === 0 && cover) {
    images = [cover]
  }

  // Ensure values are strings and trimmed
  images = images.map((i) => (typeof i === 'string' ? i.trim() : String(i))).filter(Boolean)

  return images
}

/**
 * Resolve an image value to a usable public URL.
 * - If value is already an absolute URL or a leading-slash path, return as-is.
 * - Otherwise assume it's a Supabase storage object path and build a public URL
 *   using `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_BUCKET`.
 */
export function resolveImageUrl(val?: string | null): string | undefined {
  if (!val) return undefined
  const s = String(val).trim()
  if (!s) return undefined
  // already a full url or site-relative path
  if (/^https?:\/\//i.test(s) || s.startsWith("/")) return s

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "stories"
  if (!base) return s

  // encode the path component
  const encoded = encodeURIComponent(s)
  return `${base.replace(/\/$/,"")}/storage/v1/object/public/${bucket}/${encoded}`
}
