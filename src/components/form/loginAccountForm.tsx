'use client'

import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Icons } from '../ui/icons'

const loginAccountFormSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required.',
    })
    .email({
      message: 'Must be a valid email address.',
    }),
  password: z
    .string({
      required_error: 'Password is required.',
    })
    .min(6, {
      message: 'Password must have at least 6 characters.',
    }),
})

type loginFormSchema = z.infer<typeof loginAccountFormSchema>

export function LoginAccountForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<loginFormSchema>({
    resolver: zodResolver(loginAccountFormSchema),
  })

  async function onSubmit(data: loginFormSchema) {
    try {
      setIsLoading(true)
      const supabase = createClientComponentClient()
      const { email, password } = data

      const {
        data: { session },
      } = await supabase.auth.signInWithPassword({ email, password })

      if (session) {
        setIsLoading(false)
        form.reset()
        router.push('/user-app')
      }
    } catch (error) {
      console.log('LoginForm:onSubmit', error)
    }
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full px-8 flex-col space-y-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input placeholder="E-mail" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isLoading} type="submit">
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              'Login'
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}
