import React from 'react'
import { Notice } from '@/types'
import Styled from 'styled-components'

interface NoticeListTableItemProps {
  notice: Notice
  NoticeUpdatePage: (notice: Notice) => void
}

const Td = Styled.td`
  whitespace-nowrap
  py-4
`

const NoticeListTableItem: React.FC<NoticeListTableItemProps> = ({
  notice,
  NoticeUpdatePage,
}) => {
  return (
    <tr key={notice.id} className="whitespace-nowrap">
      <Td className="py-4 px-6 text-sm text-gray-500">{notice.id}</Td>
      <Td className="py-4 px-6">
        {notice.from_date ? notice.from_date.toLocaleString() : '-'}
      </Td>
      <Td className="py-4 px-6">
        {notice.to_date ? notice.to_date.toLocaleString() : '-'}
      </Td>
      <Td
        className="py-4 px-6 max-w-md"
        style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {notice.title}
      </Td>
      <Td className="py-4 px-6 text-center">
        <button
          className="btn btn-outline btn-accent"
          onClick={() => NoticeUpdatePage(notice)}
        >
          編集
        </button>
      </Td>
    </tr>
  )
}

export default NoticeListTableItem
