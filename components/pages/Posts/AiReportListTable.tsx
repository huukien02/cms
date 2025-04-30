import React from 'react'
import { AiReport } from '@/types'
import Styled from 'styled-components'

interface AiReportListTableProps {
  ai_report: AiReport
  ai_report_status: any
}

const Td = Styled.td`
  whitespace-nowrap
  py-4
`

const AiReportListTable: React.FC<AiReportListTableProps> = ({
  ai_report,
  ai_report_status,
}) => {
  return (
    <tr className="whitespace-nowrap">
      <Td className="py-4 px-6 text-sm text-gray-500">1</Td>
      <Td className="py-4 px-6">AI</Td>
      <Td className="py-4 px-6">{ai_report.created_at}</Td>
      <Td className="py-4 px-6">{ai_report.updated_at}</Td>
      <Td className="py-4 px-6">
        {ai_report_status === 1 ? '通報中' : '通報なし'}
      </Td>
    </tr>
  )
}

export default AiReportListTable
