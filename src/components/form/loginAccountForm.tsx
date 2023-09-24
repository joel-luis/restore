'use client'

import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

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
  const router = useRouter()

  const form = useForm<loginFormSchema>({
    resolver: zodResolver(loginAccountFormSchema),
  })

  async function onSubmit(data: loginFormSchema) {
    try {
      const supabase = createClientComponentClient()
      const { email, password } = data

      const {
        data: { session },
      } = await supabase.auth.signInWithPassword({ email, password })

      if (session) {
        form.reset()
        router.push('/user-app')
      }
    } catch (error) {
      console.log('LoginForm:onSubmit', error)
    }
  }

  return (
    <div className="flex flex-col justify-center items-center space-y-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col space-y-2"
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
                <FormDescription>This is your E-mail</FormDescription>
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
                  <Input placeholder="Password" {...field} />
                </FormControl>
                <FormDescription>This is your Password</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Login</Button>
        </form>
      </Form>
    </div>
  )
}
