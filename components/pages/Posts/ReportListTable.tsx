import React from 'react'
import { Report, AiReport } from '@/types'
import Styled from 'styled-components'

interface ReportListTableProps {
  ai_report_status: number
  report: Report
  report_status: any
  rowNumber: number
}

const Td = Styled.td`
  whitespace-nowrap
  py-4
`

const ReportListTable: React.FC<ReportListTableProps> = ({
  ai_report_status,
  report,
  report_status,
  rowNumber,
}) => {
  return (
    <tr className="whitespace-nowrap">
      <Td className="py-4 px-6 text-sm text-gray-500">{rowNumber}</Td>
      <Td className="py-4 px-6">{report.content ? '通報' : 'AI'}</Td>
      <Td className="py-4 px-6">{report.created_at}</Td>
      <Td className="py-4 px-6">{report.updated_at}</Td>
      <Td className="py-4 px-6">
        {report.content && report_status === 0
          ? '通報なし'
          : report.content && report_status === 1
          ? '通報中'
          : report.content && report_status === 2
          ? '通報解除'
          : !report.content && ai_report_status === 0
          ? '通報なし'
          : !report.content && ai_report_status === 1
          ? '通報中'
          : !report.content && ai_report_status === 2
          ? '通報解除'
          : ''}
      </Td>
      <Td className="py-4 px-6">{report.email}</Td>
      <Td className="py-4 px-6">{report.name}</Td>
      <Td className="py-4 px-6">{report.content}</Td>
    </tr>
  )
}

export default ReportListTable
