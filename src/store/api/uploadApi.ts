import { baseApi } from './baseApi'
import { BUG_REPORT_ENDPOINTS } from '@/api/endpoints'

export interface UploadedScreenshot {
  url: string
  filename: string
  fileId: string
}

export const uploadApi = baseApi.injectEndpoints({
  endpoints: build => ({
uploadScreenshot: build.mutation<{ screenshots: UploadedScreenshot[] }, FormData>({
  query: formData => ({
    url: BUG_REPORT_ENDPOINTS.UPLOAD_SCREENSHOTS,
    method: 'POST',
    body: formData,
  }),
  transformResponse: (res: any) => res.data, // { screenshots: [...] }
}),
  }),
})

export const { useUploadScreenshotMutation } = uploadApi