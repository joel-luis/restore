'use client'

import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

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
  const form = useForm<createFormSchema>({
    resolver: zodResolver(createAccountFormSchema),
  })

  async function onSubmit(data: createFormSchema) {
    console.log(data)
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
          <Button type="submit">Create Account</Button>
        </form>
      </Form>
    </div>
  )
}
