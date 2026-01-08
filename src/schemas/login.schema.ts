import { email, z } from "zod"

export const loginSchema = z.object({
  email: z.email("Email invalido"),
  password: z.string().min(6, "Minimo 6 caracteres")
})

export type LoginFormData = z.infer<typeof loginSchema>