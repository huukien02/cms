import React from 'react'
import apiConfig from '@/apiConfig'
import Link from 'next/link'
import { File } from '@/types'
import Styled from 'styled-components'

const Td = Styled.td`
  whitespace-nowrap
  py-4
`

const StopSharedImg = Styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
`

interface PostsListTableProps {
  post: File
}

const detailClick = (post: File) => {
  window.open(
    `/posts/detail?user_id=${post.user_id}&folder_id=${post.folder_id}&file_id=${post.file_id}&extension=${post.extension}`,
    '_blank',
  )
}

const PostsListTable: React.FC<PostsListTableProps> = ({ post }) => {
  return (
    <tr key={post.id} className="whitespace-nowrap">
      <Td className="btn-link px-6 py-4 text-sm text-gray-500">
        <span className="btn-link" onClick={() => detailClick(post)}>
          {post.id}
        </span>
      </Td>
      <Td className="py-4" style={{ position: 'relative' }}>
        {post.stop_shared && (
          <StopSharedImg src="/image/logo/emergency.webp" alt="stop_shared" />
        )}

        <img
          className="cursor-pointer"
          src={`${apiConfig.baseStorageUrl}/${post.folder_id}/${post.file_id}.${post.extension}`}
          alt=""
          onClick={() => detailClick(post)}
        />
      </Td>
      <Td className="px-6 py-4">{post.folder_id}</Td>
      <Td className="px-6 py-4">{post.hashed_id}</Td>
      <Td className="px-6 py-4">
        {post.stop_shared
          ? '共有不可'
          : post.stash === 0
            ? '通常'
            : post.stash === 1
              ? 'ゴミ箱'
              : post.stash === 2
                ? '消去'
                : ''}
      </Td>
      <Td className="px-6 py-4">{post.updated_at ? post.updated_at : '-'}</Td>
      <Td className="px-6 py-4">
        {post.stash === 1 && post.updated_at
          ? post.updated_at
          : post.stash === 2
            ? post.scheduled_at
            : '-'}
      </Td>
      <Td className="px-6 py-4">
        {post.ai_report_status === 0
          ? '通報なし'
          : post.ai_report_status === 1
            ? '通報中'
            : '通報解除'}
      </Td>
      <Td className="px-6 py-4">
        {post.ai_report ? post.ai_report.created_at : '-'}
      </Td>
      <Td className="px-6 py-4">
        {post.ai_report ? post.ai_report.created_at : '-'}
      </Td>
      <Td className="px-6 py-4">
        {post.report_status === 0
          ? '通報なし'
          : post.report_status === 1
            ? '通報中'
            : post.report_status === 2
              ? '通報解除'
              : ''}
      </Td>
      <Td className="px-6 py-4">
        {post.report[0] ? post.report[0].created_at : '-'}
      </Td>
      <Td className="px-6 py-4">
        <span className="btn-link" onClick={() => detailClick(post)}>
          詳細
        </span>
      </Td>
    </tr>
  )
}

export default PostsListTable
