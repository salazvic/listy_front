'use client'
 
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "motion/react" 

import { loginSchema, LoginFormData } from "@/schemas/login.schema"
import { useAuthStore } from "@/stores/auth.store"
import { authService } from "@/services/auth.service"

import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting}
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  const containerVariants = {
    hidden: { opacity: 0, x: 40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        easing: "ease-out",
        delayChildren: 0.15,
        staggerChildren: 0.08,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.3,
        easing: "ease-out"
      },
    },
  }

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await authService.login(data)
      console.log(res)
      useAuthStore.getState().setAuth(
        res.user,
        res.access.access_token
      )
      useAuthStore.getState().setAccess_token(res.access.access_token)
      console.log(useAuthStore.getState().access_token)
      console.log("antes de hacer push")
      router.push('/lists')
    } catch (err: any) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* LEFT IMAGE */}
      <motion.div 
        className="relative hidden md:block overflow-hidden" 
        initial={{scale: 1.1}}
        animate={{scale: 1}}
        transition={{duration: 1.2, ease: "easeOut"}}
      >
        <motion.img 
          src="/login.jpg"
          alt="login background"
          className="absolute inset-0 h-full w-full object-cover" 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        <motion.div
          className="absolute inset-0 bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        />
      </motion.div>

      {/* RIGHT FORM */}    
      <motion.div 
        className="relative flex items-center justify-center bg-gray-100 px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* MOBILE BACKGROUND */}
        <div className="absolute inset-0 md:hidden">
          <img 
            src="/login.jpg"
            alt="login background"
            className="h-full w-full object-cover" 
          />
          <div className="absolute inset-0 bg-black/50"/>
        </div>

        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 w-full max-w-sm rounded-2xl bg-white/90 backdrop-blur-md p-6 shadow-xl text-gray-600"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-2xl text-gray-600 font-bold mb-4 text-center"
          >
            Iniciar sesión
          </motion.h1>

          <motion.input
            variants={itemVariants}
            className="w-full border rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Email"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mb-2">
            {errors.email.message}
            </p>
          )}

          <motion.input
            variants={itemVariants}
            type="password"
            placeholder="Contraseña"
            className="w-full border rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-black"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mb-2">
            {errors.password.message}
            </p>
          )}

          <button
            disabled={isSubmitting}
            className="w-full bg-black text-white py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>

          <motion.p 
            className="mt-4 text-center text-sm text-gray-500"
            initial={{opacity: 0, y: 5}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.3, ease: "easeOut"}}
          >
            ¿No tienes cuenta? {" "}
            <Link 
              href="/register"
              className="font-medium text-black hover:underline"
            >
              <motion.span
                whileHover={{scale: 1.05}}
                whileTap={{scale: 0.95}}
                className="hover:underline"
              >
                Registrarse
              </motion.span>
            </Link>
          </motion.p>
        </motion.form>
      </motion.div>
    </div>
  )
}

