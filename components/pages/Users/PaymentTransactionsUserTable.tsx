import React from 'react'
import Styled from 'styled-components'
import { PaymentTransactionsUser } from '@/types'

// const Td = Styled.td`
//   word-break: break-word;
// `

const Table = Styled.table`
  width: 100%;
  border-collapse: collapse;
`

const Tr = Styled.tr`
  height: 58px;
`

const Th = Styled.th`
  whitespace-nowrap
  border: 1px solid #000;
  padding: 8px;
`

const Td = Styled.td`
  whitespace-nowrap
  py-4
  border: 1px solid #000;
  padding: 8px;
`

interface PaymentTransactionsUserProps {
  user: PaymentTransactionsUser
}

const PaymentTransactionsUserTable: React.FC<PaymentTransactionsUserProps> = ({
  user,
}) => {
  return (
    <div
      className="border-b border-gray-200 shadow"
      style={{ overflow: 'auto', marginBottom: '30px' }}
    >
      <Table className="divide-y divide-gray-300 table-auto">
        <tbody className="bg-white divide-y divide-gray-300">
          <Tr>
            <Th className="py-2 px-6 text-xs text-gray-500 bg-gray-50">
              ユーザID
            </Th>
            <Td className="py-4 px-6">{user.hashed_id}</Td>
          </Tr>
          <Tr>
            <Th className="py-2 px-6 text-xs text-gray-500 bg-gray-50">
              メールアドレス
            </Th>
            <Td className="py-4 px-6">{user.email}</Td>
          </Tr>
          <Tr>
            <Th className="py-2 px-6 text-xs text-gray-500 bg-gray-50">
              ユーザ名
            </Th>
            <Td className="py-4 px-6">
              {user.last_name + '  ' + user.first_name}
            </Td>
          </Tr>
        </tbody>
      </Table>
    </div>
  )
}

export default PaymentTransactionsUserTable
