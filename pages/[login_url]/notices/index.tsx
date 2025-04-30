import React, { useState, useEffect } from 'react'
import { Notice } from '@/types'
import Pagination from '@/components/common/Pagination'
import CardComponent from '@/components/common/Card'
import Styled from 'styled-components'
import { useRouter } from 'next/router'
import NoticeListTableItem from '@/components/pages/Notices/NoticeListTableItem'
import { axiosInstance } from '@/libs'
import useCheckLoginUrl from '@/components/hooks/useCheckLoginUrl'

const H1 = Styled.h1`
  margin-bottom: 32px;
`

const HandleToggleCheckboxButtonContainer = Styled.div`
`

const Table = Styled.table`
  width: 100%;
`

const Th = Styled.th`
  whitespace-nowrap
`

const NoticeList: React.FC = () => {
  const router = useRouter()
  const loginUrl = useCheckLoginUrl()
  const [notices, setNotices] = useState<Notice[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)

  const fetchNotices = async (page: number) => {
    try {
      const response = await axiosInstance.get(`/cms/1.0/notices?per_page=20&page=${page}`);

      if (response.status === 200) {
        setNotices(response.data.data)
        setLastPage(response.data.last_page)
      } else {
        console.error('Failed to fetch notices')
      }
    } catch (error) {
      console.error('Error fetching notices:', error)
    }
  }

  useEffect(() => {
    fetchNotices(currentPage)
  }, [currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const NoticeCreatePage = () => {
    router.push(`${loginUrl}/notices/create`)
  }

  const NoticeUpdatePage = (notice: Notice) => {
    router.push(`/${loginUrl}/notices/detail?id=${notice.id}`)
  }

  return (
    <CardComponent>
      <H1>お知らせ管理</H1>
      <HandleToggleCheckboxButtonContainer>
        <button
          className="w-30 btn  btn-primary"
          style={{ float: 'right', marginBottom: '20px', display: 'block' }}
          onClick={NoticeCreatePage}
        >
          新規投稿
        </button>
      </HandleToggleCheckboxButtonContainer>

      <div className="border-b border-gray-200 shadow">
        <Table className="table-auto divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <Th className="px-6 py-2 text-xs text-gray-500">No.</Th>
              <Th className="px-6 py-2 text-xs text-gray-500">開始日</Th>
              <Th className="px-6 py-2 text-xs text-gray-500">終了日</Th>
              <Th className="px-6 py-2 text-xs text-gray-500">タイトル</Th>
              <Th className="px-6 py-2 text-xs text-gray-500">編集</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300 bg-white">
            {notices.map((notice) => (
              <NoticeListTableItem
                notice={notice}
                key={notice.id}
                NoticeUpdatePage={NoticeUpdatePage}
              />
            ))}
          </tbody>
        </Table>
      </div>
      <Pagination
        currentPage={currentPage}
        lastPage={lastPage}
        onPageChange={handlePageChange}
      />
    </CardComponent>
  )
}

export default NoticeList
