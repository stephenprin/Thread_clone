import * as z from "zod"

export const ThreadValidation = z.object({
    thread: z.string().nonempty().min(3, { message: "Minimum of three characters" }),
    accountId: z.string()
})

export const CommentValidation = z.object({
    thread: z.string().nonempty().min(3, { message: "Minimum of three characters" }),
    name: z.string().min(3).max(30),
    accountId: z.string()
})