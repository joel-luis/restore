'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useDropzone } from 'react-dropzone'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface FilePreview {
  file: Blob
  preview: string
}

export function ImageUploadPlaceholder() {
  const [isMounted, setIsMounted] = useState(false)
  const [file, setFile] = useState<FilePreview | null>()
  const [fileToProcess, setFileToProcess] = useState<{
    path: string
  } | null>(null)
  const [restoreFile, setRestoreFile] = useState<FilePreview | null>()

  const router = useRouter()

  const onDrop = useCallback(async (acceptFiles: File[]) => {
    try {
      const file = acceptFiles[0]
      setFile({
        file,
        preview: URL.createObjectURL(file),
      })

      const supabase = createClientComponentClient()
      const { data, error } = await supabase.storage
        .from(process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_IMAGE_FOLDER)
        .upload(
          `${process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_IMAGE_FOLDER_PROCESSING}/${acceptFiles[0].name}`,
          acceptFiles[0],
        )
      if (!error) {
        setFileToProcess(data)
      }
    } catch (error) {
      console.log('onDrop', error)
    }
  }, [])

  useEffect(() => {
    setIsMounted(true)
    return () => {
      if (file) URL.revokeObjectURL(file.preview)
      if (restoreFile) URL.revokeObjectURL(restoreFile.preview)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { getInputProps, getRootProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg'],
    },
  })

  async function handleDialogOpenChange(event: boolean) {
    if (!event) {
      setFile(null)
      setRestoreFile(null)
      router.refresh()
    }
  }

  async function handleEnhance() {
    try {
      const supabase = createClientComponentClient()
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from(process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_IMAGE_FOLDER)
        .getPublicUrl(`${fileToProcess?.path}`)

      const res = await fetch('/api/ai/replicate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: publicUrl,
        }),
      })

      const restoreImageUrl = await res.json()
      const readImageRes = await fetch(restoreImageUrl.data)
      const imageBlob = await readImageRes.blob()

      setRestoreFile({
        file: imageBlob,
        preview: URL.createObjectURL(imageBlob),
      })

      await supabase.storage
        .from(process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_IMAGE_FOLDER)
        .upload(
          `${process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_IMAGE_FOLDER_RESTORE}/${file?.file.name}`,
          imageBlob,
        )
    } catch (error) {
      console.log('handleEnhance', error)
      setFile(null)
      setRestoreFile(null)
    }
  }

  if (!isMounted) return null

  return (
    <div className="flex h-[300px] w-full shrink-0 items-center justify-center rounded-md border border-dashed">
      <div className="mx-auto flex flex-col items-center justify-center text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-10 w-10 text-muted-foreground"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="11" r="1" />
          <path d="M11 17a1 1 0 0 1 2 0c0 .5-.34 3-.5 4.5a.5.5 0 0 1-1 0c-.16-1.5-.5-4-.5-4.5ZM8 14a5 5 0 1 1 8 0" />
          <path d="M17 18.5a9 9 0 1 0-10 0" />
        </svg>

        <h3 className="mt-4 text-lg font-semibold">Just add a Photo</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">
          The photo you add will be enhanced by AI
        </p>
        <Dialog onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button size="sm" className="relative">
              Bring your past to life
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Photo</DialogTitle>
              <DialogDescription>
                Drag a photo in order to Upload & Enhance
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {!file && (
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p className="flex items-center justify-center border border-dashed p-6 h-36 rounded-md">
                      Drop your photo here...
                    </p>
                  ) : (
                    <p className="flex items-center justify-center border border-dashed p-6 h-36 rounded-md">
                      Drag or click to choose image...
                    </p>
                  )}
                </div>
              )}
              <div className="flex flex-col items-center justify-evenly sm:flex-row gap-2">
                {file && (
                  <div className="flex flex-row flex-wrap drop-shadow-md">
                    <div className="flex w-48 h-48 relative">
                      <img
                        src={file.preview}
                        alt="image"
                        className="w-48 h-48 object-contain border rounded-md"
                        onLoad={() => URL.revokeObjectURL(file.preview)}
                      />
                    </div>
                  </div>
                )}

                {restoreFile && (
                  <div className="flex flex-row flex-wrap drop-shadow-md">
                    <div className="flex w-60 h-60 relative">
                      <img
                        src={restoreFile.preview}
                        alt="image"
                        className="w-60 h-60 object-contain rounded-md"
                        onLoad={() => URL.revokeObjectURL(restoreFile.preview)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleEnhance}>Enhance</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
