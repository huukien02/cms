import React from 'react'
import Styled from 'styled-components'
import { PaymentTransactions } from '@/types'

const Td = Styled.td`
  word-break: break-word;
`

interface PaymentTransactionsProps {
  payment: PaymentTransactions
  rowNumber: any
}

const UsersPayments: React.FC<PaymentTransactionsProps> = ({
  payment,
  rowNumber,
}) => {
  return (
    <tr key={payment.id} className="whitespace-nowrap">
      <Td className="py-4 px-6 text-center">{rowNumber}</Td>
      <Td className="py-4 px-6 text-center">
        {payment.platform === 1
          ? 'Android'
          : payment.platform === 2
          ? 'IOS'
          : '-'}
      </Td>
      <Td className="py-4 px-6 text-center">
        {payment.payment_status === 3
          ? '契約中'
          : payment.payment_status === 4
          ? '猶予期間中'
          : payment.payment_status === 7
          ? '解約予定'
          : '未契約'}
      </Td>
      <Td className="py-4 px-6 text-center">
        {payment.start_time ? payment.start_time : '-'}
      </Td>
      <Td className="py-4 px-6 text-center">
        {payment.expire_time ? payment.expire_time : '-'}
      </Td>
      <Td className="py-4 px-6 text-center">
        {payment.updated_at ? payment.updated_at : '-'}
      </Td>
    </tr>
  )
}

export default UsersPayments
