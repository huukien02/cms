import React from 'react'
import { parse } from 'json2csv'

interface CSVExportButtonProps {
  csvData: Array<Record<string, string>>
  customFields: any[]
  csvFileName: string
}

const CSVExportButton: React.FC<CSVExportButtonProps> = ({
  csvData,
  customFields,
  csvFileName,
}) => {
  const handleCSVDownload = () => {
    if (csvData.length > 0) {
      try {
        const csv = parse(csvData, { fields: customFields })

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const url = window.URL.createObjectURL(blob)
        const tempLink = document.createElement('a')
        tempLink.href = url
        tempLink.setAttribute('download', `${csvFileName}.csv`)
        tempLink.click()
      } catch (error) {
        console.error('Error creating CSV:', error)
      }
    }
  }

  return (
    <button
      className="btn btn-neutral"
      onClick={handleCSVDownload}
    >
      CSV出力
    </button>
  )
}

export default CSVExportButton
