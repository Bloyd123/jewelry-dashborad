// FILE: src/hooks/bugReport/useScreenshotUpload.ts

import { useState, useCallback, useMemo } from 'react'
import { useUploadScreenshotMutation } from '@/store/api/uploadApi'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { useNotification } from '@/hooks/useNotification'

export interface ScreenshotPreview {
  id: string
  url: string
  filename: string
  fileId: string
  previewUrl: string
}

export const useScreenshotUpload = () => {
  const { handleError } = useErrorHandler()
  const { showError, showWarning } = useNotification()

  const [screenshots, setScreenshots] = useState<ScreenshotPreview[]>([])
  const [uploadMutation, uploadState] = useUploadScreenshotMutation()

  const handleFileChange = useCallback(async (files: FileList | null) => {
    if (!files) return

    const remaining = 5 - screenshots.length

    if (remaining <= 0) {
      showWarning('bugReport.screenshots.limitTitle', 'bugReport.screenshots.limitDesc')
      return
    }

    const toUpload = Array.from(files).slice(0, remaining)

    if (files.length > remaining) {
      showWarning(
        'bugReport.screenshots.limitTitle',
        'bugReport.screenshots.limitDesc'
      )
    }

    for (const file of toUpload) {
      const previewUrl = URL.createObjectURL(file)
      const formData = new FormData()
      formData.append('screenshots', file)

      try {
const result = await uploadMutation(formData).unwrap()
const uploaded = result.screenshots[0] // 👈 array ke andar hai
setScreenshots(prev => [...prev, {
  id: uploaded.fileId,
  url: uploaded.url,
  filename: uploaded.filename,
  fileId: uploaded.fileId,
  previewUrl,
}])
      } catch (error: any) {
        URL.revokeObjectURL(previewUrl)
        handleError(error)  // 👈 same as useBugReport
      }
    }
  }, [screenshots.length, uploadMutation, handleError, showWarning])

  const removeScreenshot = useCallback((fileId: string) => {
    setScreenshots(prev => {
      const found = prev.find(s => s.fileId === fileId)
      if (found) URL.revokeObjectURL(found.previewUrl)
      return prev.filter(s => s.fileId !== fileId)
    })
  }, [])

const screenshotPayload = useMemo(() => 
  screenshots.map(s => ({
    url: s.url,
    filename: s.filename,
    fileId: s.fileId,
  }))
, [screenshots])

  return {
    screenshots,
    screenshotPayload,
    isUploading: uploadState.isLoading,  // 👈 same pattern
    isSuccess: uploadState.isSuccess,     // 👈 same pattern
    handleFileChange,
    removeScreenshot,
  }
}