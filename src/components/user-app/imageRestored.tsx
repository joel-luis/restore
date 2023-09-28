'use client'

import Image from 'next/image'
import { PlusCircleIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { RestoredImage } from '@/types'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface ImageRestoredProps extends React.HTMLAttributes<HTMLDivElement> {
  image: RestoredImage
  aspectRatio?: 'portrait' | 'square'
  width?: number
  height?: number
  publicUrl: string
}

export function ImageRestored({
  image,
  aspectRatio = 'portrait',
  width,
  height,
  publicUrl,
  className,
  ...props
}: ImageRestoredProps) {
  async function downloadImage(image: string) {
    const supabase = createClientComponentClient()
    const { data } = await supabase.storage
      .from(process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_IMAGE_FOLDER)
      .download(
        `${process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_IMAGE_FOLDER_RESTORE}/${image}`,
      )

    if (data) {
      const a = document.createElement('a')
      document.body.appendChild(a)

      const url = window.URL.createObjectURL(data)
      a.href = url
      a.download = image
      a.click()
      window.URL.revokeObjectURL(url)
    }
  }

  return (
    <div className={cn('space-y-3', className)} {...props}>
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="overflow-hidden rounded-md">
            <Image
              src={`${publicUrl}/${image.name}`}
              alt={image.name}
              width={width}
              height={height}
              className={cn(
                'h-auto w-auto object-cover transition-all hover:scale-105',
                aspectRatio === 'portrait' ? 'aspect-[3/4]' : 'aspect-square',
              )}
            />
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-40">
          <ContextMenuItem>Add to Collection</ContextMenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger>Add to Photo</ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-48">
              <ContextMenuItem>
                <PlusCircleIcon className="mr-2 h-4 w-4" />
                New Collection
              </ContextMenuItem>
              <ContextMenuSeparator />
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSeparator />
          <ContextMenuItem>Delete</ContextMenuItem>
          <ContextMenuItem>Duplicate</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem
            onClick={() => {
              downloadImage(image.name)
            }}
          >
            Download
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>Like</ContextMenuItem>
          <ContextMenuItem>Share</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <div className="space-y-1 text-sm">
        <p className="text-xs text-muted-foreground">{image.name}</p>
      </div>
    </div>
  )
}
