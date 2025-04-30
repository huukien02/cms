import React, { useState, useEffect } from 'react'
import { User } from '@/types'
import Styled from 'styled-components'
import CardComponent from '@/components/common/Card'
import Pagination from '@/components/common/Pagination'
import axios from 'axios'
import Cookies from 'js-cookie'
import CommonPrimaryButton from '@/components/common/Button/PrimaryButton'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ja from 'date-fns/locale/ja'
import CommonOutlineButton from '@/components/common/Button/OutlineButton'
import CSVExportButton from '@/components/common/Button/CSVExportButton'
import UserListTable from '@/components/pages/Users/UserListTable'
import { axiosInstance } from '@/libs'

const Table = Styled.table`
  width: 100%;
`

const Th = Styled.th`
  white-space: nowrap;
`

const SearchAreaContainer = Styled.div`
  border-bottom: 1px solid #000;
  margin-bottom: 30px;
  padding-bottom: 30px;
`

const CheckboxContainer = Styled.div`
  margin-bottom: 10px
`

const CheckboxInput = Styled.input`
  margin-right: 5px;
  border-color: #000;
`

const CheckboxLabel = Styled.label`
  margin-left: 10px;
  display: inline-block;
  &:first-child {
    margin-left: 0;
  }
`

const CheckboxSpan = Styled.span`
  vertical-align: top;
  display: inline-block;
  margin-top: 1px;
`

const Input = Styled.input`
  height: 40px;
  border-radius: 5px;
  border: 1px solid #DADADD;
  margin-bottom: 10px;
  padding-left: 10px;
`

const Flex = Styled.div`
  display: flex;
  gap: 10px;
`

const CSVButtonContainer = Styled.div`
  display: flex;
  justify-content: end;
  margin-bottom: 30px;
`

interface ApiResponse {
  data: User[]
  last_page: number
  current_page: number
  per_page: number
  total: number
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [searchCriteria, setSearchCriteria] = useState({
    hashed_id: '',
    email: '',
    last_name: '',
    first_name: '',
    company: '',
    affiliation: '',
    started_at_from: '',
    started_at_to: '',
    status: [] as number[],
  })
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [csvData, setCsvData] = useState<Array<Record<string, string>>>([])
  const [isDataFetched, setIsDataFetched] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const headers = [
    { label: 'No.', key: 'No.' },
    { label: '利用開始日', key: '利用開始日' },
    { label: 'ユーザーID', key: 'ユーザーID' },
    { label: 'メールアドレス', key: 'メールアドレス' },
    { label: '会社', key: '会社' },
    { label: '所属', key: '所属' },
    { label: '利用者氏名', key: '利用者氏名' },
    { label: 'ステータス', key: 'ステータス' },
    { label: 'アプリ課金開始日時', key: 'アプリ課金開始日時' },
    { label: 'サブスク終了予定日時', key: 'サブスク終了予定日時' },
    { label: '課金状態取得日時', key: '課金状態取得日時' },
    { label: '課金ステータス', key: '課金ステータス' },
  ]

  const customFields = headers.map((header) => {
    return {
      label: header.label,
      value: (row: any) => row[header.key],
    }
  })

  const getStatusText = (user: User) => {
    if (
      user.email_verified_at === null &&
      user.deactivation === 0 &&
      user.deleted_at === null
    ) {
      return '仮登録'
    } else if (
      user.email_verified_at !== null &&
      user.deactivation === 0 &&
      user.deleted_at === null
    ) {
      return '本登録(有効)'
    } else if (
      user.email_verified_at !== null &&
      user.deactivation === 1 &&
      user.deleted_at === null
    ) {
      return '本登録(停止)'
    } else if (user.deleted_at !== null) {
      return '退会'
    }
    return 'Unknown Status'
  }

  const getPaymentStatusText = (user: User) => {
    if (user.plan_status === 3) {
      return '契約中'
    } else if (user.plan_status === 4) {
      return '猶予期間中'
    } else if (user.plan_status === 7) {
      return '解約予定'
    }
    return '未契約'
  }

  useEffect(() => {
    if (!isDataFetched) {
      fetchUsers(currentPage)
    }
  }, [currentPage, searchCriteria])

  const fetchUsers = async (page: number) => {
    setIsLoading(true)
    try {
      const requestBody = {
        per_page: 20,
        page: page,
        ...searchCriteria,
        started_at_from: startDate,
        started_at_to: endDate,
      }

      const csvRequestBody = {
        ...searchCriteria,
        started_at_from: startDate,
        started_at_to: endDate,
      }

      const response = await axiosInstance.post<ApiResponse>(
        '/cms/1.0/users',
        requestBody,
      )
      console.log(response)

      const csvResponse = await axiosInstance.post<ApiResponse>(
        '/cms/1.0/users',
        csvRequestBody,
      )

      const data = response.data.data
      const csv_data = csvResponse.data.data

      setUsers(data)
      setLastPage(response.data.last_page)

      const csvData: any = csv_data.map((user) => ({
        'No.': user.id,
        利用開始日: user.started_at,
        ユーザーID: user.hashed_id,
        メールアドレス: user.email,
        会社: user.company,
        所属: user.affiliation,
        利用者氏名: `${user.last_name} ${user.first_name}`,
        ステータス: getStatusText(user),
        アプリ課金開始日時: user.plan?.start_time ? user.plan?.start_time.toString() : null,
        サブスク終了予定日時: user.plan?.expire_time ? user.plan?.expire_time.toString() : null,
        課金状態取得日時: user.latest_status_checked_at,
        課金ステータス: getPaymentStatusText(user),
      }))

      setCsvData(csvData)
      setIsDataFetched(true)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartDateChange = (date: any) => {
    setStartDate(date)
  }

  const handleEndDateChange = (date: any) => {
    setEndDate(date)
  }

  const handlePageChange = (page: number) => {
    setIsDataFetched(false)
    setCurrentPage(page)
  }

  const handleSearch = () => {
    setCurrentPage(1)
    fetchUsers(1)
  }

  const handleSearchClear = () => {
    setIsDataFetched(false)
    setSearchCriteria({
      hashed_id: '',
      email: '',
      last_name: '',
      first_name: '',
      company: '',
      affiliation: '',
      started_at_from: '',
      started_at_to: '',
      status: [],
    })
    setStartDate(null)
    setEndDate(null)
    setCurrentPage(1)
    fetchUsers(1)
  }

  const handleStatusChange = (statusValue: any) => {
    const updatedStatus = [...searchCriteria.status]

    if (updatedStatus.includes(statusValue)) {
      updatedStatus.splice(updatedStatus.indexOf(statusValue), 1)
    } else {
      updatedStatus.push(statusValue)
    }

    setSearchCriteria({ ...searchCriteria, status: updatedStatus })
  }

  return (
    <CardComponent>
      <h1>アプリユーザー管理</h1>
      <SearchAreaContainer>
        <Flex>
          <div>
            <label htmlFor="" className="label">
              ユーザID
            </label>
            <Input
              className="input input-bordered"
              type="text"
              placeholder="ユーザID"
              value={searchCriteria.hashed_id}
              onChange={(e) =>
                setSearchCriteria({
                  ...searchCriteria,
                  hashed_id: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label htmlFor="" className="label">
              メールアドレス
            </label>
            <Input
              className="input input-bordered"
              type="text"
              placeholder="メールアドレス"
              value={searchCriteria.email}
              onChange={(e) =>
                setSearchCriteria({ ...searchCriteria, email: e.target.value })
              }
            />
          </div>
        </Flex>
        <Flex>
          <div>
            <label htmlFor="" className="label">
              氏名(姓)
            </label>
            <Input
              className="input input-bordered w-full max-w-xs"
              type="text"
              placeholder="氏名(姓)"
              value={searchCriteria.last_name}
              onChange={(e) =>
                setSearchCriteria({
                  ...searchCriteria,
                  last_name: e.target.value,
                })
              }
              maxLength={255}
            />
          </div>
          <div>
            <label htmlFor="" className="label">
              氏名(名)
            </label>
            <Input
              className="input input-bordered w-full max-w-xs"
              type="text"
              placeholder="氏名(名)"
              value={searchCriteria.first_name}
              onChange={(e) =>
                setSearchCriteria({
                  ...searchCriteria,
                  first_name: e.target.value,
                })
              }
              maxLength={255}
            />
          </div>
        </Flex>
        <label htmlFor="" className="label">
          会社名
        </label>
        <Input
          className="input input-bordered w-full"
          type="text"
          placeholder="会社名"
          value={searchCriteria.company}
          onChange={(e) =>
            setSearchCriteria({ ...searchCriteria, company: e.target.value })
          }
          maxLength={255}
        />
        <label htmlFor="" className="label">
          所属
        </label>
        <Input
          className="input input-bordered w-full"
          type="text"
          placeholder="所属"
          value={searchCriteria.affiliation}
          onChange={(e) =>
            setSearchCriteria({
              ...searchCriteria,
              affiliation: e.target.value,
            })
          }
          maxLength={255}
        />
        <label htmlFor="" className="label">
          利用開始日
        </label>
        <Flex>
          <DatePicker
            placeholderText="利用開始日(始)"
            className="date-input input input-bordered h-10 w-full max-w-xs"
            selected={startDate}
            onChange={handleStartDateChange}
            locale={ja}
            dateFormat="yyyy/MM/dd"
          />
          <DatePicker
            placeholderText="利用開始日(終)"
            className="date-input input input-bordered h-10 w-full max-w-xs"
            selected={endDate}
            onChange={handleEndDateChange}
            locale={ja}
            dateFormat="yyyy/MM/dd"
          />
        </Flex>
        <label htmlFor="" className="label">
          ユーザステータス
        </label>
        <CheckboxContainer>
          <CheckboxLabel>
            <CheckboxInput
              className="checkbox checkbox-sm"
              type="checkbox"
              value={1}
              checked={searchCriteria.status.includes(1)}
              onChange={() => handleStatusChange(1)}
            />
            <CheckboxSpan className="label-text">仮登録</CheckboxSpan>
          </CheckboxLabel>
          <CheckboxLabel>
            <CheckboxInput
              className="checkbox checkbox-sm"
              type="checkbox"
              value={2}
              checked={searchCriteria.status.includes(2)}
              onChange={() => handleStatusChange(2)}
            />
            <CheckboxSpan className="label-text">本登録(有効)</CheckboxSpan>
          </CheckboxLabel>
          <CheckboxLabel>
            <CheckboxInput
              className="checkbox checkbox-sm"
              type="checkbox"
              value={3}
              checked={searchCriteria.status.includes(3)}
              onChange={() => handleStatusChange(3)}
            />
            <CheckboxSpan className="label-text">本登録(停止)</CheckboxSpan>
          </CheckboxLabel>
          <CheckboxLabel>
            <CheckboxInput
              className="checkbox checkbox-sm"
              type="checkbox"
              value={4}
              checked={searchCriteria.status.includes(4)}
              onChange={() => handleStatusChange(4)}
            />
            <CheckboxSpan className="label-text">退会</CheckboxSpan>
          </CheckboxLabel>
        </CheckboxContainer>
        <div style={{ marginTop: '15px' }}>
          <CommonPrimaryButton onClick={handleSearch}>検索</CommonPrimaryButton>
          <CommonOutlineButton
            onClick={handleSearchClear}
            style={{ marginLeft: '20px' }}
          >
            クリア
          </CommonOutlineButton>
        </div>
      </SearchAreaContainer>
      <CSVButtonContainer>
        <CSVExportButton
          csvData={csvData}
          customFields={customFields}
          csvFileName={`user_list`}
        />
      </CSVButtonContainer>
      <div
        className="border-b border-gray-200 shadow"
        style={{ overflow: 'auto' }}
      >
        {isLoading ? (
          <></>
        ) : (
          <>
            {users.length > 0 ? (
              <Table className="table-auto divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <Th className="px-6 py-2 text-xs text-gray-500">No.</Th>
                    <Th className="px-6 py-2 text-xs text-gray-500">
                      利用開始日
                    </Th>
                    <Th className="px-6 py-2 text-xs text-gray-500">
                      ユーザーID
                    </Th>
                    <Th className="px-6 py-2 text-xs text-gray-500">
                      メールアドレス
                    </Th>
                    <Th className="px-6 py-2 text-xs text-gray-500">会社</Th>
                    <Th className="px-6 py-2 text-xs text-gray-500">所属</Th>
                    <Th className="px-6 py-2 text-xs text-gray-500">
                      利用者氏名
                    </Th>
                    <Th className="px-6 py-2 text-xs text-gray-500">
                      ステータス
                    </Th>
                    <Th className="px-6 py-2 text-xs text-gray-500">
                      アプリ課金開始日時
                    </Th>
                    <Th className="px-6 py-2 text-xs text-gray-500">
                      サブスク終了予定日時
                    </Th>
                    <Th className="px-6 py-2 text-xs text-gray-500">
                      課金状態取得日時
                    </Th>
                    <Th className="px-6 py-2 text-xs text-gray-500">
                      課金ステータス
                    </Th>
                    <Th className="px-6 py-2 text-xs text-gray-500">
                      現在利用中のプラン
                    </Th>
                    <Th className="px-6 py-2 text-xs text-gray-500">
                      アプリ決済詳細
                    </Th>
                    <Th className="px-6 py-2 text-xs text-gray-500">
                      撮影画像
                    </Th>
                    <Th className="px-6 py-2 text-xs text-gray-500">編集</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300 bg-white">
                  {users.map((user) => (
                    <UserListTable user={user} key={user.id} />
                  ))}
                </tbody>
              </Table>
            ) : (
              <div
                style={{
                  height: '300px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '-30px',
                }}
              >
                <div className="text-center">
                  <p className="w-full">
                    <img
                      className="mb-2 inline-block"
                      src="/image/logo/logo_gray@3x.png"
                      alt=""
                      width={30}
                    />
                    <span className="block">
                      お探しの結果は見つかりませんでした
                    </span>
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        lastPage={lastPage}
        onPageChange={handlePageChange}
      />
    </CardComponent>
  )
}

export default UserList
