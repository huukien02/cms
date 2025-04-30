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

interface UserListTableProps {
  user: User
}

const UserListTable: React.FC<UserListTableProps> = ({ user }) => {
  const router = useRouter()
  const { hashedId, setHashedId } = useAppContext()
  // const now = new Date()
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

  const ticketClick = () => {
    router.push(
      `/tickets?lot_id=${user.lot_id}&branch_number=${user.plan_type}&page=1`,
    )
  }

  const setUserIdClick = () => {
    setHashedId(user.hashed_id)
    window.open(`/posts/users?hashed_id=${user.hashed_id}`, '_blank')
  }

  const userPaymentClick = () => {
    window.open(`/users/payment?user_id=${user.id}`, '_blank')
  }

  const userDetailClick = () => {
    window.open(`/users/detail?user_id=${user.id}`, '_blank')
  }

  return (
    <tr key={user.id} className="whitespace-nowrap">
      <Td className="px-6 py-4 text-sm text-gray-500">{user.id}</Td>
      <Td className="px-6 py-4">{user.started_at}</Td>
      <Td className="px-6 py-4">{user.hashed_id}</Td>
      <Td className="px-6 py-4">{user.email}</Td>
      <Td className="px-6 py-4">{user.company}</Td>
      <Td className="px-6 py-4">{user.affiliation}</Td>
      <Td className="px-6 py-4">{user.last_name + '  ' + user.first_name}</Td>
      <Td className="px-6 py-4">
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
      <Td className="px-6 py-4">{user.plan?.start_time ? user.plan?.start_time.toString() : '-'}</Td>
      <Td className="px-6 py-4">{user.plan?.expire_time ? user.plan?.expire_time.toString() : '-'}</Td>
      <Td className="px-6 py-4">
        {user.latest_status_checked_at ? user.latest_status_checked_at : '-'}
      </Td>
      <Td className="px-6 py-4">
        {(user.lot_id &&
          user.plan_status === 1 &&
          new Date(user.plan?.expire_time) > new Date(Date.now())) ||
        (!user.lot_id &&
          user.plan_status === 3 &&
          new Date(user.plan?.expire_time) > new Date(Date.now()))
          ? '契約中'
          : new Date(user.plan?.buffer_time) > new Date(Date.now()) &&
              new Date(Date.now()) > new Date(user.plan?.expire_time)
            ? '猶予期間中'
            : user.plan_status === 7
              ? '解約予定'
              : '未契約'}
      </Td>
      <Td className="px-6 py-4">
        {user.lot_id && user.plan?.name ? (
          <button
            onClick={ticketClick}
            className="btn btn-link p-0 text-[16px]"
          >
            {user.plan?.name ? user.plan.name : '-'}
          </button>
        ) : !user.lot_id && user.plan?.name ? (
          <span className="text-[16px]">{user.plan.name}</span>
        ) : (
          <>{'-'}</>
        )}
      </Td>
      <Td className="btn-link px-6 py-4">
        <button onClick={userPaymentClick} className="btn btn-link">
          詳細
        </button>
      </Td>
      <Td className="btn-link px-6 py-4">
        <button onClick={setUserIdClick} className="btn btn-link">
          写真管理
        </button>
      </Td>
      <Td className="btn-link px-6 py-4">
        <button onClick={userDetailClick} className="btn btn-link">
          会員詳細
        </button>
      </Td>
    </tr>
  )
}

export default UserListTable
