import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UserAppHeader } from '@/components/user-app/header'
import { ImageUploadPlaceholder } from '@/components/user-app/imageUploadPlaceholder'
import { ImageRestored } from '@/components/user-app/imageRestored'
import { Sidebar } from '@/components/user-app/sidebar'

export const dynamic = 'force-static'

export default async function userApp() {
  const supabase = createServerComponentClient({ cookies })
  const { data: restoredImages } = await supabase.storage
    .from(process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_IMAGE_FOLDER)
    .list(process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_IMAGE_FOLDER_RESTORE, {
      limit: 10,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' },
    })

  const {
    data: { publicUrl },
  } = await supabase.storage
    .from(process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_IMAGE_FOLDER)
    .getPublicUrl(
      process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_IMAGE_FOLDER_RESTORE,
    )

  return (
    <div className="md:block">
      <UserAppHeader />
      <div className="border-t">
        <div className="bg-background">
          <div className="grid lg:grid-cols-5">
            <Sidebar className="hidden lg:block" />
            <div className="col-span-3 lg:col-span-4 lg:border-l">
              <div className="h-full px-4 py-6 lg:px-8">
                <Tabs defaultValue="photos" className="h-full space-y-6">
                  <div className="space-between flex items-center">
                    <TabsList>
                      <TabsTrigger value="photos" className="relative">
                        Upload Photo
                      </TabsTrigger>
                      <TabsTrigger value="restored">
                        Photos Restored
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  <TabsContent
                    value="photos"
                    className="border-none p-0 outline-none"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h2 className="text-2xl font-semibold tracking-tight">
                          Image restoration
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Bringing Old Photos Back to Life
                        </p>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="relative">
                      <ImageUploadPlaceholder />
                    </div>
                  </TabsContent>
                  <TabsContent
                    value="restored"
                    className="h-full flex-col border-none p-0 data-[state=active]:flex"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h2 className="text-2xl font-semibold tracking-tight">
                          Photo Collection
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          The photos yout already enhanced
                        </p>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex items-center justify-center">
                      <ScrollArea>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-12">
                          {restoredImages?.map((image) => (
                            <ImageRestored
                              key={image.name}
                              image={image}
                              className="w-[250px]"
                              aspectRatio="square"
                              width={250}
                              height={330}
                              publicUrl={publicUrl}
                            />
                          ))}
                        </div>
                        <ScrollBar orientation="horizontal" />
                      </ScrollArea>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
