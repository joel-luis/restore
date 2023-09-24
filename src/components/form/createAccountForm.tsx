'use client'

import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const createAccountFormSchema = z.object({
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

type createFormSchema = z.infer<typeof createAccountFormSchema>

export function CreateAccountForm() {
  const router = useRouter()

  const form = useForm<createFormSchema>({
    resolver: zodResolver(createAccountFormSchema),
  })

  async function onSubmit(data: createFormSchema) {
    try {
      const supabase = createClientComponentClient()
      const { email, password } = data

      const {
        data: { user },
      } = await supabase.auth.signUp({
        email,
        password,
        // options: {
        //   emailRedirectTo: `${location.origin}auth/callback`,
        // },
      })

      if (user) {
        form.reset()
        router.refresh()
      }
    } catch (error) {
      console.log('CreateAccountForm', error)
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
          <Button type="submit">Create Account</Button>
        </form>
      </Form>
    </div>
  )
}
