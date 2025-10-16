import { z } from "zod"

export const storyCreateSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/i),
  summary: z.string().max(500).optional(),
  body: z.string().optional(),
  published: z.boolean().optional(),
  cover_image: z.string().optional(),
})

export const storyUpdateSchema = storyCreateSchema.partial()

export type StoryCreate = z.infer<typeof storyCreateSchema>
export type StoryUpdate = z.infer<typeof storyUpdateSchema>

export const storyDbSelect = `id,title,slug,summary,body,published,cover_image,created_at,updated_at`
