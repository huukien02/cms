import React from 'react'
import { Admin } from '@/types'
import Styled from 'styled-components'

interface UserListTableProps {
  user: Admin
  openPopupChangePassword: (adminId: string) => void
  openPopupAdminUserDelete: (adminId: string) => void
}

const Td = Styled.td`
  py-4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
`

const AdminUserChangePasswordButton = Styled.button`
`

const AdminUserDeleteButton = Styled.button`
`

const UserListTable: React.FC<UserListTableProps> = ({
  user,
  openPopupChangePassword,
  openPopupAdminUserDelete,
}) => {
  return (
    <tr key={user.id} className="whitespace-nowrap">
      <Td className="py-4 px-6 text-sm text-gray-500">{user.id}</Td>
      <Td className="py-4 px-6">{user.admin_id}</Td>
      <Td className="py-4 px-6">{user.email}</Td>
      <Td className="py-4 px-6">{user.created_at}</Td>
      <Td className="py-4 px-6 text-center">
        <AdminUserChangePasswordButton
          className="btn btn-outline btn-accent"
          onClick={() => openPopupChangePassword(user.admin_id)}
        >
          パスワード変更
        </AdminUserChangePasswordButton>
      </Td>
      <Td className="py-4 px-6 text-center">
        <AdminUserDeleteButton
          className="btn btn-outline btn-secondary"
          onClick={() => openPopupAdminUserDelete(user.admin_id)}
        >
          削除
        </AdminUserDeleteButton>
      </Td>
    </tr>
  )
}

export default UserListTable
