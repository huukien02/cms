import React from 'react'
import { User } from '@/types'
import Styled from 'styled-components'
import { useAppContext } from '@/components/state/AppContext'
import { useRouter } from 'next/router'

const Td = Styled.td`
  py-4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
`

interface PostUserListTableProps {
  user: User
}

const PostUserListTable: React.FC<PostUserListTableProps> = ({ user }) => {
  const router = useRouter()
  const { hashedId, setHashedId } = useAppContext()
  const status = {
    isProvisional:
      user.email_verified_at === null &&
      user.deactivation === 0 &&
      user.deleted_at === null,
    isActive:
      user.email_verified_at !== null &&
      user.deactivation === 0 &&
      user.deleted_at === null,
    isStopped:
      user.email_verified_at !== null &&
      user.deactivation === 1 &&
      user.deleted_at === null,
    isDeleted: user.deleted_at !== null,
  }

  const setUserIdClick = () => {
    setHashedId(user.hashed_id)
    router.push(`/posts/users?hashed_id=${user.hashed_id}`)
  }

  const userDetailClick = () => {
    router.push(`/users/detail?user_id=${user.id}`)
  }

  return (
    <tr key={user.id} className="whitespace-nowrap">
      <Td className="py-4 px-6 text-sm text-gray-500">{user.id}</Td>
      <Td className="py-4 px-6">{user.started_at}</Td>
      <Td className="py-4 px-6">{user.hashed_id}</Td>
      <Td className="py-4 px-6">{user.email}</Td>
      <Td className="py-4 px-6">{user.company}</Td>
      <Td className="py-4 px-6">{user.affiliation}</Td>
      <Td className="py-4 px-6">{user.last_name + '  ' + user.first_name}</Td>
      <Td className="py-4 px-6">
        {status.isProvisional
          ? '仮登録'
          : status.isActive
          ? '本登録(有効)'
          : status.isStopped
          ? '本登録(停止)'
          : status.isDeleted
          ? '退会'
          : 'Unknown Status'}
      </Td>
      <Td className="py-4 px-6 btn-link">
        <button onClick={setUserIdClick} className="btn btn-link">
          写真管理
        </button>
      </Td>
      <Td className="py-4 px-6 btn-link">
        <button onClick={userDetailClick} className="btn btn-link">
          会員詳細
        </button>
      </Td>
    </tr>
  )
}

export default PostUserListTable
