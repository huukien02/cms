import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { Lot } from '../types'
import { cn, downloadCSV } from '@/lib/utils'
import {
  LOT_PLAN_TYPES,
  LOT_PLAN_TYPES_KEYS,
  DEFAULT_PER_PAGE,
} from '../constants'
import axios from 'axios'
import Link from 'next/link'

type LotListTableProps = {
  lotList: any[]
  currentPage: number
  perPage: number
  total: number
}

export const LotListTable: FC<LotListTableProps> = ({
  lotList,
  currentPage,
  perPage,
  total,
}) => {
  const dialog = useRef<HTMLDialogElement>(null)
  const router = useRouter()
  const [checkedItems, setCheckedItems] = useState<number[]>([])
  const [selectedBranchIds, setSelectedBranchIds] = useState<number[]>([])
  const [lotIdPlanTypes, setLotIdPlanTypes] = useState<string[]>([])
  const baseThStyle = 'whitespace-nowrap px-6 py-2 text-xs text-gray-500'
  const baseTdStyle =
    'max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap px-6 py-4 text-center'
  const handleCheckedItems = (id: number, plan_type: any) => {
    setLotIdPlanTypes([`${id}-${plan_type}`, ...lotIdPlanTypes])
    setCheckedItems((items) =>
      items.includes(id)
        ? items.filter((itemId) => itemId !== id)
        : [id, ...items],
    )
    setSelectedBranchIds((branchIds) =>
      branchIds.includes(plan_type)
        ? branchIds.filter((bid) => bid !== plan_type)
        : [plan_type, ...branchIds],
    )
  }
  const startNum = (currentPage - 1) * DEFAULT_PER_PAGE
  const moveToEditPage = (id: number) => {
    router.push(`/lots/edit?lot_id=${id}`)
  }

  const moveToTicketListPage = (id: number) => {
    router.push({
      pathname: '/tickets',
      query: {
        lotId: id,
      },
    })
  }
  const moveToTicketAddPage = () => {
    router.push('/lots/add')
  }

  const printCSV = () => {
    if (lotIdPlanTypes.length === 0) {
      dialog.current?.showModal()
      return
    }

    console.log(lotIdPlanTypes)

    axios
      .post('/cms/3.0/admins/lots/download-csv', {
        lotIdPlanType: lotIdPlanTypes,
      })
      .then((res) => {
        const csvData: string = res.data
        downloadCSV(csvData, 'ロット一覧.csv')
        setLotIdPlanTypes([])
      })
      .catch((error) => {
        console.error('Failed to get lot csv data:', error)
      })
  }

  const downloadPDF = async () => {
    if (lotIdPlanTypes.length === 0) {
      dialog.current?.showModal()
      return
    }
    const requestId = lotIdPlanTypes.map((id) => `${id}`).join(',')
    console.log(requestId, lotIdPlanTypes)
    axios
      .get('/cms/3.0/admins/lots/export/pdf', {
        params: {
          requestId: requestId,
        },
        responseType: 'arraybuffer',
      })
      .then((res) => {
        const blob = new Blob([res.data], { type: 'application/pdf' })
        const file = new File([blob], 'ロット一覧.pdf', {
          type: 'application/pdf',
        })
        const url = URL.createObjectURL(file)

        const link = document.createElement('a')
        link.href = url
        link.download = 'ロット一覧.pdf'
        link.click()

        URL.revokeObjectURL(url)
        setLotIdPlanTypes([])
      })
      .catch((err) => console.log('error', err))
  }

  const closeDialog = () => {
    dialog.current?.close()
  }
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = ('0' + (date.getMonth() + 1)).slice(-2)
    const day = ('0' + date.getDate()).slice(-2)
    return `${year}-${month}-${day}`
  }

  return (
    <section>
      <h2 hidden>ロット一覧テーブル</h2>
      <dialog ref={dialog} className="modal" onClick={closeDialog}>
        <div className="modal-box px-[63px] py-[52px]">
          <p className=" text-center text-xl">
            出力する項目を選択してください。
          </p>
        </div>
      </dialog>
      <div className="flex justify-between">
        <button className="btn btn-primary" onClick={moveToTicketAddPage}>
          チケット発行
        </button>
        <div className="flex gap-3">
          <button className="btn btn-neutral" onClick={printCSV}>
            CSV出力
          </button>
          <button className="btn btn-neutral" onClick={downloadPDF}>
            PDF出力
          </button>
        </div>
      </div>
      <div
        className="mt-4 border-b border-gray-200 shadow"
        style={{ overflow: 'auto' }}
      >
        <table className="w-full table-auto divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className={baseThStyle}>No.</th>
              <th className={baseThStyle}>複数選択</th>
              <th className={baseThStyle}>取引ID</th>
              {/* <th className={baseThStyle}>枝番</th> */}
              <th className={baseThStyle}>契約事業者ID</th>
              <th className={baseThStyle}>契約事業者名称</th>
              <th className={baseThStyle}>利用プラン</th>
              <th className={baseThStyle}>発行枚数/残枚数</th>
              <th className={baseThStyle}>発行日</th>
              <th className={baseThStyle}>有効期限開始日</th>
              <th className={baseThStyle}>有効期限</th>
              <th className={baseThStyle}>有効/無効</th>
              <th className={baseThStyle}>編集</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300 bg-white">
            {lotList.map(
              (
                {
                  id,
                  company_id,
                  company_name,
                  plan_type,
                  is_active,
                  start_on,
                  end_on,
                  issued_at,
                  ticket_count,
                  rest_ticket_count,
                },
                idx,
              ) => {
                return (
                  <tr key={`${id}-${plan_type}`} className="whitespace-nowrap">
                    <td className={cn(baseTdStyle, 'text-sm text-gray-500')}>
                      {total - (startNum + idx)}
                    </td>
                    <td className={baseTdStyle}>
                      <input
                        type="checkbox"
                        checked={lotIdPlanTypes.includes(`${id}-${plan_type}`)}
                        onChange={() => handleCheckedItems(id, plan_type)}
                        value={id}
                      />
                    </td>
                    <td className={baseTdStyle}>
                      <Link className="btn-link" href={`/tickets?lot_id=${id}`}>
                        {id}
                      </Link>
                    </td>
                    {/* <td className={baseTdStyle}>
                      <Link
                        className="btn-link"
                        href={`/tickets?lot_id=${id}&plan_type=${plan_type}`}
                      >
                        {plan_type}
                      </Link>
                    </td> */}
                    <td className={baseTdStyle}>{company_id}</td>
                    <td className={baseTdStyle}>{company_name}</td>
                    <td className={baseTdStyle}>
                      {plan_type === 1
                        ? '有料プランS'
                        : plan_type === 2
                          ? '有料プランM'
                          : plan_type === 3
                            ? '有料プランL'
                            : '-'}
                    </td>
                    <td className={baseTdStyle}>
                      {`${ticket_count}/${rest_ticket_count}`}
                    </td>
                    <td className={baseTdStyle}>{formatDate(issued_at)}</td>
                    <td className={baseTdStyle}>{start_on}</td>
                    <td className={baseTdStyle}>{end_on}</td>
                    <td className={baseTdStyle}>
                      <div
                        className={`badge ${
                          is_active ? 'badge-success' : 'badge-error'
                        }`}
                      >
                        {is_active ? '有効' : '無効'}
                      </div>
                    </td>
                    <td className={baseTdStyle}>
                      <button
                        className="btn btn-accent btn-outline"
                        onClick={() => moveToEditPage(id)}
                      >
                        編集
                      </button>
                    </td>
                  </tr>
                )
              },
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
