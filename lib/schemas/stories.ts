import { z } from "zod"

export const storyCreateSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/i),
  summary: z.string().max(500).optional(),
  // author_name removed from client inputs; author_id remains for associations
  body: z.string().optional(),
  published: z.boolean().optional(),
  cover_image: z.string().optional(),
})

export const storyUpdateSchema = storyCreateSchema.partial()

export type StoryCreate = z.infer<typeof storyCreateSchema>
export type StoryUpdate = z.infer<typeof storyUpdateSchema>

// Select used by admin endpoints to fetch story rows. author_id removed from select to avoid relying on that column.
export const storyDbSelect = `id,title,slug,summary,body,excerpt,content,published,cover_image,image_url,category,status,is_featured,views_count,tags,state,location,created_at,updated_at`
