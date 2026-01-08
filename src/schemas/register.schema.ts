import * as z from "zod"

export const registerSchema = z.object({
  email: z.email("Email invalido"),
  name: z.string(),
  password: z.string().min(6, "Minimo 6 caracteres")
})

export type RegisterFormData = z.infer<typeof registerSchema>