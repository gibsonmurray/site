import { z } from "zod/v4"

const PassageMetaSchema = z.object({
    canonical: z.string().optional(),
    chapter_start: z.tuple([z.number(), z.number()]).optional(),
    chapter_end: z.tuple([z.number(), z.number()]).optional(),
    prev_verse: z.number().optional(),
    next_verse: z.number().optional(),
    prev_chapter: z.tuple([z.number(), z.number()]).optional(),
    next_chapter: z.tuple([z.number(), z.number()]).optional(),
})

export const ESVPassageSchema = z.object({
    query: z.string().optional(),
    canonical: z.string().optional(),
    parsed: z.array(z.tuple([z.number(), z.number()])).optional(),
    passage_meta: z.array(PassageMetaSchema).optional(),
    passages: z.array(z.string()).optional(),
})
export type ESVPassage = z.infer<typeof ESVPassageSchema>

const PassageSearchSchema = z.object({
    reference: z.string().optional(), // e.g., "Numbers 11:4"
    content: z.string().optional(), // verse text; may include escaped unicode like \u201c
})

export const ESVSearchSchema = z.object({
    page: z.number().int().min(1).optional(),
    total_results: z.number().int().min(0).optional(),
    results: z.array(PassageSearchSchema).optional(),
    total_pages: z.number().int().min(1).optional(),
})
export type ESVSearch = z.infer<typeof ESVSearchSchema>
