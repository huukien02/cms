import { ChangeEvent, FC, useState } from 'react'
import { camelToSnake, cn } from '@/lib/utils'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ja from 'date-fns/locale/ja'
import { useRouter } from 'next/router'
import { LotSearchFormValue } from '../types'

const initialFormValue: LotSearchFormValue = {
  query: undefined,
  companyId: undefined,
  companyName: undefined,
  lot_id: undefined,
  branchNumber: undefined,
  issuedFrom: undefined,
  issuedTo: undefined,
  endOnFrom: undefined,
  endOnTo: undefined,
  isActive: undefined,
  planType: undefined,
  durationType: undefined,
  plan_type: undefined,
}

type TicketSearchFormProps = {
  isOpen: boolean
  handleClose: () => void
}
export const LotsSearchForm: FC<TicketSearchFormProps> = ({
  isOpen,
  handleClose,
}) => {
  const router = useRouter()
  const [formValue, setFormValue] = useState(initialFormValue)
  const [branchNumberDisabled, setBranchNumberDisabled] = useState(true)

  const formItemStyle = 'flex w-full gap-7 py-[10px] items-center'

  const handleFormValue = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target

    const isCheckbox = ['isActive', 'planType', 'durationType'].includes(name)
    let _value: any

    if (
      [
        'lot_id',
        'branchNumber',
        // 'isActive',
        'planType',
        'durationType',
      ].includes(name)
    ) {
      _value = parseInt(value)
    } else {
      _value = value
    }

    if (isCheckbox) {
      setFormValue((form) => ({
        ...form,
        [name]: checked ? _value : undefined,
      }))
    } else {
      setFormValue((form) => ({
        ...form,
        [name]: _value,
      }))
    }

    if (name === 'lot_id') {
      setBranchNumberDisabled(value === '')
    }
  }
  const handleDate = (name: string) => (date: Date) => {
    setFormValue((form) => ({
      ...form,
      [name]: date,
    }))
  }

  const filter = () => {
    const obj: { [key: string]: any } = {}
    Object.entries(formValue).forEach(([key, value]) => {
      if (value) {
        const newKey = camelToSnake(key)
        if (['issuedFrom', 'issuedTo', 'endOnFrom', 'endOnTo'].includes(key)) {
          obj[newKey] = value.toString()
        } else {
          obj[newKey] = value
        }
      }
    })

    router.push({
      pathname: router.pathname,
      query: {
        ...obj,
        page: 1,
      },
    })
  }

  const reset = () => {
    setFormValue(initialFormValue)
    router.push('/lots')
  }

  return (
    <section
      className={cn(
        'overflow-hidden duration-300 ease-in',
        isOpen ? 'h-[680px]' : 'h-0',
      )}
    >
      <h2 hidden>TicketSearchForm</h2>
      <div className={formItemStyle}>
        <label htmlFor="query" className="label w-32 text-sm">
          フリーワード
        </label>
        <input
          id="query"
          name="query"
          type="text"
          placeholder="フリーワード"
          className="input input-bordered w-[541px] "
          onChange={handleFormValue}
          maxLength={255}
          value={formValue.query || ''}
        />
      </div>
      <div className={formItemStyle}>
        <label htmlFor="companyId" className="label w-32 text-sm ">
          契約事業者ID
        </label>
        <input
          id="companyId"
          name="companyId"
          type="text"
          placeholder="契約事業者ID"
          className="input input-bordered w-[541px] "
          onChange={handleFormValue}
          value={formValue.companyId || ''}
          maxLength={255}
        />
      </div>
      <div className={formItemStyle}>
        <label htmlFor="companyName" className="label w-32 text-sm">
          契約事業者名
        </label>
        <input
          id="companyName"
          name="companyName"
          type="text"
          placeholder="契約事業者名"
          className="input input-bordered w-[541px] "
          onChange={handleFormValue}
          value={formValue.companyName || ''}
          maxLength={1024}
        />
      </div>
      <div className={formItemStyle}>
        <label htmlFor="lot_id" className="label w-32 text-sm">
          取引ID
        </label>
        <input
          id="lot_id"
          name="lot_id"
          type="number"
          placeholder="取引ID"
          className="input input-bordered w-[204px] "
          onChange={handleFormValue}
          value={formValue.lot_id || ''}
        />
        {/* -
        <input
          name="plan_type"
          type="number"
          placeholder="枝番"
          className="input input-bordered w-[204px] "
          onChange={handleFormValue}
          disabled={branchNumberDisabled}
          value={branchNumberDisabled ? '' : formValue.plan_type || ''}
        /> */}
      </div>
      <div className={formItemStyle}>
        <label htmlFor="" className="label w-32 text-sm">
          発行日
        </label>
        <div className="flex">
          <DatePicker
            className="date-input input input-bordered h-10 w-[250px] max-w-xs"
            selected={formValue.issuedFrom}
            onChange={handleDate('issuedFrom')}
            locale={ja}
            dateFormat="yyyy/MM/dd"
            isClearable
            selectsStart
            startDate={formValue.issuedFrom}
            endDate={formValue.issuedTo}
            placeholderText="発行日(始)"
          />
          <DatePicker
            className="date-input input input-bordered ml-10 h-10 w-[250px] max-w-xs"
            selected={formValue.issuedTo}
            onChange={handleDate('issuedTo')}
            locale={ja}
            dateFormat="yyyy/MM/dd"
            isClearable
            selectsEnd
            startDate={formValue.issuedFrom}
            endDate={formValue.issuedTo}
            minDate={formValue.issuedFrom}
            placeholderText="発行日(終)"
          />
        </div>
      </div>
      <div className={formItemStyle}>
        <label htmlFor="" className="label w-32 text-sm">
          有効期間
        </label>
        <div className="flex">
          <DatePicker
            className="date-input input input-bordered h-10 w-[250px] max-w-xs"
            selected={formValue.endOnFrom}
            onChange={handleDate('endOnFrom')}
            locale={ja}
            dateFormat="yyyy/MM/dd"
            isClearable
            selectsStart
            startDate={formValue.endOnFrom}
            endDate={formValue.endOnTo}
            placeholderText="有効期間(始)"
          />
          <DatePicker
            className="date-input input input-bordered ml-10 h-10 w-[250px] max-w-xs"
            selected={formValue.endOnTo}
            onChange={handleDate('endOnTo')}
            locale={ja}
            dateFormat="yyyy/MM/dd"
            isClearable
            selectsEnd
            startDate={formValue.endOnFrom}
            endDate={formValue.endOnTo}
            minDate={formValue.endOnFrom}
            placeholderText="有効期間(終)"
          />
        </div>
      </div>
      <div className={formItemStyle}>
        <label htmlFor="" className="label w-32 text-sm">
          利用期間検索
        </label>
        <div className="flex items-center">
          <label htmlFor="durationAll" className="label mr-[31px] w-11 text-sm">
            全て
          </label>
          <input
            id="durationAll"
            name="durationType"
            type="checkbox"
            value={0}
            className="checkbox checkbox-sm"
            checked={formValue.durationType === 0}
            onChange={handleFormValue}
          />
          <label
            htmlFor="duration30"
            className="label ml-[50px] mr-[31px] w-11 text-sm"
          >
            30日
          </label>
          <input
            id="duration30"
            name="durationType"
            type="checkbox"
            value={1}
            className="checkbox checkbox-sm"
            checked={formValue.durationType === 1}
            onChange={handleFormValue}
          />
        </div>
      </div>
      <div className={formItemStyle}>
        <label htmlFor="" className="label w-32 text-sm">
          無効フラグ
        </label>
        <div className="flex items-center">
          <label htmlFor="valid" className="label mr-[31px] w-11 text-sm">
            有効
          </label>
          <input
            id="valid"
            name="isActive"
            type="checkbox"
            value={1}
            className="checkbox checkbox-sm"
            checked={formValue.isActive == 1}
            onChange={handleFormValue}
          />
          <label
            htmlFor="invalid"
            className="label ml-[50px] mr-[31px] w-11 text-sm"
          >
            無効
          </label>
          <input
            id="invalid"
            name="isActive"
            type="checkbox"
            value={0}
            className="checkbox checkbox-sm"
            checked={formValue.isActive == 0}
            onChange={handleFormValue}
          />
        </div>
      </div>
      <div className={formItemStyle}>
        <label htmlFor="" className="label w-32 text-sm">
          利用プラン
        </label>
        <div className="flex items-center">
          <label className="label mr-[6px] w-[31px] text-sm">S</label>
          <input
            name="planType"
            type="checkbox"
            className="checkbox checkbox-sm"
            value={1}
            checked={formValue.planType === 1}
            onChange={handleFormValue}
          />
          <label className="label ml-[34px] mr-[6px] w-[31px] text-sm">M</label>
          <input
            name="planType"
            type="checkbox"
            className="checkbox checkbox-sm"
            value={2}
            onChange={handleFormValue}
            checked={formValue.planType === 2}
          />
          <label className="label ml-[34px] mr-[6px]  w-[31px] text-sm">
            L
          </label>
          <input
            name="planType"
            type="checkbox"
            className="checkbox checkbox-sm"
            value={3}
            onChange={handleFormValue}
            checked={formValue.planType === 3}
          />
        </div>
      </div>

      <div className="flex gap-[20px]">
        <button className="btn btn-primary w-56" onClick={filter}>
          検索
        </button>
        <button className="btn btn-outline w-56" onClick={reset}>
          クリア
        </button>
      </div>
    </section>
  )
}
