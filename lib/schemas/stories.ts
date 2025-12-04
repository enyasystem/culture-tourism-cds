import { z } from "zod"

export const storyCreateSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/i),
  summary: z.string().max(500).optional(),
  // author_name removed from client inputs; author_id remains for associations
  body: z.string().optional(),
  published: z.boolean().optional(),
  cover_image: z.string().optional(),
  images: z.array(z.string()).optional(),
})

export const storyUpdateSchema = storyCreateSchema.partial()

export type StoryCreate = z.infer<typeof storyCreateSchema>
export type StoryUpdate = z.infer<typeof storyUpdateSchema>

// Select used by admin endpoints to fetch story rows. author_id removed from select to avoid relying on that column.
// Prioritized select: include the most essential and stable columns first,
// followed by optional/legacy columns. This reduces the chance that
// PostgREST will error about a missing column on the first attempt and
// avoids repeated expensive retries.
// NOTE: keep this list minimal and stable. Some deployments may not have
// legacy columns like `content`; removing them prevents PostgREST errors
// (42703) when a column is missing.
// Keep this list intentionally minimal and stable. Columns like
// `category`, `status`, `is_featured`, `views_count`, `tags`, `state`,
// and `location` are optional in some deployments and caused 42703
// errors at runtime. Only include the columns we expect to exist.
export const storyDbSelect = `id,title,slug,summary,body,excerpt,published,created_at,updated_at,images,cover_image`
