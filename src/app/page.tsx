import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { redirect, RedirectType } from 'next/navigation'
import { cookies } from 'next/headers'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CreateAccountForm } from '@/components/form/createAccountForm'
import { LoginAccountForm } from '@/components/form/loginAccountForm'

export const dynamic = 'force-static'

export default async function Home() {
  let loggedIn = false

  try {
    const supabase = createServerComponentClient({ cookies })
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session) loggedIn = true
  } catch (error) {
    console.log('Home', error)
  } finally {
    if (loggedIn) redirect('/user-app', RedirectType.replace)
  }

  return (
    <div className="flex flex-col h-screen justify-center items-center">
      <Tabs
        defaultValue="create-account"
        className="w-[400px] border rounded-md pb-4 shadow-2xl"
      >
        <TabsList className="flex justify-around items-center rounded-b-none h-14">
          <TabsTrigger
            value="create-account"
            className="transition-all delay-150"
          >
            Account
          </TabsTrigger>
          <TabsTrigger value="login" className="transition-all delay-150">
            Login
          </TabsTrigger>
        </TabsList>
        <TabsContent value="create-account">
          <CreateAccountForm />
        </TabsContent>
        <TabsContent value="login">
          <LoginAccountForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}
