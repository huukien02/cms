import axios, { AxiosResponse } from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { Lot, LotResponse, LotParams } from '../types'
import { useRouter } from 'next/router'
import { DEFAULT_PER_PAGE } from '../constants'
import { axiosInstance } from '@/libs'

export const useLotList = () => {
  const router = useRouter()
  const [lotList, setLotList] = useState<Lot[]>([])
  const [pageInfo, setPageInfo] = useState({
    lastPage: 0,
    currentPage: 0,
    perPage: 0,
    total: 0,
  })

  const getLotList = useCallback(async (params: LotParams) => {
    const _params: { [key: string]: any } = {}
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        if (
          ['end_on_from', 'end_on_to', 'issued_from', 'issued_to'].includes(key)
        ) {
          _params[key] = new Date(value)
        } else {
          _params[key] = value
        }
      }
    })

    axios
      .get('/cms/3.0/admins/lots', {
        params: { ..._params, per_page: DEFAULT_PER_PAGE },
      })
      .then((res: AxiosResponse<LotResponse>) => {
        const { last_page, current_page, per_page, total, data } = res.data
        setLotList(data ? data : [])
        setPageInfo({
          currentPage: current_page,
          lastPage: last_page,
          perPage: per_page,
          total: total,
        })
      })
      .catch((error) => console.error('Error fetching lots:', error))
  }, [])

  useEffect(() => {
    if (router.isReady) getLotList(router.query as LotParams)
  }, [router])

  return {
    lotList,
    pageInfo,
  }
}
