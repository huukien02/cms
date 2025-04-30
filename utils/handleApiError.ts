import axios from 'axios'

export const handleApiError = (error: any, router: any) => {
  if (axios.isAxiosError(error) && error.response?.status === 500) {
    router.push('/500')
  }
}
