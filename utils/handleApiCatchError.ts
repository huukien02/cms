import axios from 'axios'

export const handleApiCatchError = (error: any, router: any) => {
  if (axios.isAxiosError(error) && error.response?.status === 503) {
    router.push('/maintenance.html')
  }
}
