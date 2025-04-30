import axios from 'axios'
import Cookies from 'js-cookie'
import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { File } from '@/types'
import Styled from 'styled-components'
import CardComponent from '@/components/common/Card'
import Pagination from '@/components/common/Pagination'
import CommonPrimaryButton from '@/components/common/Button/PrimaryButton'
import CommonOutlineButton from '@/components/common/Button/OutlineButton'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ja from 'date-fns/locale/ja'
import PostsListTable from '@/components/pages/Posts/PostsListTable'
import { axiosInstance } from '@/libs'
import CSVExportButton from '@/components/common/Button/CSVExportButton'

const SearchAreaContainer = Styled.div`
  border-bottom: 1px solid #000;
  margin-bottom: 30px;
  padding-bottom: 30px;
`

const Input = Styled.input`
  width: 100%;
  height: 40px;
  border-radius: 5px;
  border: 1px solid #DADADD;
  margin-bottom: 10px;
  padding-left: 10px;
`

const Table = Styled.table`
  width: 100%;
`

const Th = Styled.th`
  white-space: nowrap;
`

const Flex = Styled.div`
  display: flex;
  gap: 10px;
`

const FlexGap30 = Styled.div`
  display: flex;
  gap: 30px;
`

const FlexContent = Styled.div`
  width: 50%;
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

const CSVButtonContainer = Styled.div`
  display: flex;
  justify-content: end;
  margin-bottom: 30px;
`

const PostsPage = () => {
  const router = useRouter()
  const { hashed_id } = router.query
  const [posts, setPosts] = useState<File[]>([])
  const [dataExportCSV, setDataExportCSV] = useState<File[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [createdAtFrom, setCreatedAtFrom] = useState(null)
  const [createdAtTo, setCreatedAtTo] = useState(null)
  const [updatedAtFrom, setUpdatedAtFrom] = useState(null)
  const [updatedAtTo, setUpdatedAtTo] = useState(null)
  const [stashUpdatedAtFrom, setStashUpdatedAtFrom] = useState(null)
  const [stashUpdatedAtTo, setStashUpdatedAtTo] = useState(null)
  const [reportedAtFrom, setReportedAtFrom] = useState(null)
  const [reportedAtTo, setReportedAtTo] = useState(null)
  const [aiReportedAtFrom, setAiReportedAtFrom] = useState(null)
  const [aiReportedAtTo, setAiReportedAtTo] = useState(null)
  const [stopShared, setStopShared] = useState<boolean>(false)
  const [searchCriteria, setSearchCriteria] = useState({
    file_id: '',
    folder_id: '',
    hashed_id: hashed_id ? hashed_id : '',
    created_at_from: '',
    created_at_to: '',
    updated_at_from: '',
    updated_at_to: '',
    stash_updated_at_from: '',
    stash_updated_at_to: '',
    reported_at_from: '',
    reported_at_to: '',
    ai_reported_at_from: '',
    ai_reported_at_to: '',
    stash: [] as number[],
    stop_shared: [] as number[],
    report_status: [] as number[],
    ai_report_status: [] as number[],
  })
  const [isDataFetched, setIsDataFetched] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isDataFetched) {
      fetchPosts(currentPage)
    }
  }, [currentPage, searchCriteria])

  const buildSearchParams = () => ({
    ...searchCriteria,
    created_at_from: createdAtFrom,
    created_at_to: createdAtTo,
    updated_at_from: updatedAtFrom,
    updated_at_to: updatedAtTo,
    stash_updated_at_from: stashUpdatedAtFrom,
    stash_updated_at_to: stashUpdatedAtTo,
    reported_at_from: reportedAtFrom,
    reported_at_to: reportedAtTo,
    ai_reported_at_from: aiReportedAtFrom,
    ai_reported_at_to: aiReportedAtTo,
  })

  const fetchPosts = async (page: number) => {
    setIsLoading(true)
    try {
      const searchParams = buildSearchParams()
      const response = await axiosInstance.get<{
        data: any
        last_page: number
      }>(`/cms/1.0/posts`, {
        params: {
          per_page: 20,
          page: page,
          ...searchParams,
        },
      })
      const data = response.data
      setPosts(data.data)
      setLastPage(data.last_page)
      setIsDataFetched(true)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchExportCSVPosts()
  }, []) 

  const fetchExportCSVPosts = async () => {
    setIsLoading(true)
    try {
      const searchParams = buildSearchParams()
      const response = await axiosInstance.get<{
        data: any
        last_page: number
      }>(`/cms/1.0/posts/export-csv-posts`, {
        params: {
          ...searchParams,
        },
      })
      const data = response.data
      setDataExportCSV(data.data)
    } catch (error) {
      console.error('Error fetching export csv posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreatedAtFromChange = (date: any) => {
    setCreatedAtFrom(date)
  }

  const handleCreatedAtToChange = (date: any) => {
    setCreatedAtTo(date)
  }

  const handleStashUpdatedAtFromChange = (date: any) => {
    setStashUpdatedAtFrom(date)
  }

  const handleStashUpdatedAtToChange = (date: any) => {
    setStashUpdatedAtTo(date)
  }

  const handleReportedAtFromChange = (date: any) => {
    setReportedAtFrom(date)
  }

  const handleReportedAtToChange = (date: any) => {
    setReportedAtTo(date)
  }

  const handleAiReportedAtFromChange = (date: any) => {
    setAiReportedAtFrom(date)
  }

  const handleAiReportedAtToChange = (date: any) => {
    setAiReportedAtTo(date)
  }

  const handlePageChange = (page: number) => {
    setIsDataFetched(false)
    setCurrentPage(page)
  }

  const handleSearch = () => {
    setCurrentPage(1)
    fetchPosts(1)
  }

  const handleSearchClear = () => {
    setIsDataFetched(false)
    setSearchCriteria({
      file_id: '',
      folder_id: '',
      hashed_id: '',
      created_at_from: '',
      created_at_to: '',
      updated_at_from: '',
      updated_at_to: '',
      stash_updated_at_from: '',
      stash_updated_at_to: '',
      reported_at_from: '',
      reported_at_to: '',
      ai_reported_at_from: '',
      ai_reported_at_to: '',
      stash: [],
      stop_shared: [],
      report_status: [],
      ai_report_status: [],
    })
    setCreatedAtFrom(null)
    setCreatedAtTo(null)
    setUpdatedAtFrom(null)
    setUpdatedAtTo(null)
    setStashUpdatedAtFrom(null)
    setStashUpdatedAtTo(null)
    setReportedAtFrom(null)
    setReportedAtTo(null)
    setAiReportedAtFrom(null)
    setAiReportedAtTo(null)
    setStopShared(false)
    setCurrentPage(1)
    fetchPosts(1)
  }

  const handleStatusChange = (statusValue: any) => {
    const updatedStatus = [...searchCriteria.stash]

    if (updatedStatus.includes(statusValue)) {
      updatedStatus.splice(updatedStatus.indexOf(statusValue), 1)
    } else {
      updatedStatus.push(statusValue)
    }

    setSearchCriteria({ ...searchCriteria, stash: updatedStatus })
  }

  const handleStopSharedChange = (statusValue: any) => {
    const updatedStopShared = [...searchCriteria.stop_shared]

    if (updatedStopShared.includes(statusValue)) {
      updatedStopShared.splice(updatedStopShared.indexOf(statusValue), 1)
    } else {
      updatedStopShared.push(statusValue)
    }

    setSearchCriteria({ ...searchCriteria, stop_shared: updatedStopShared })
  }

  const handleReportStatusChange = (statusValue: any) => {
    const updatedStatus = [...searchCriteria.report_status]

    if (updatedStatus.includes(statusValue)) {
      updatedStatus.splice(updatedStatus.indexOf(statusValue), 1)
    } else {
      updatedStatus.push(statusValue)
    }

    setSearchCriteria({ ...searchCriteria, report_status: updatedStatus })
  }

  const handleAiReportStatusChange = (statusValue: any) => {
    const updatedStatus = [...searchCriteria.ai_report_status]

    if (updatedStatus.includes(statusValue)) {
      updatedStatus.splice(updatedStatus.indexOf(statusValue), 1)
    } else {
      updatedStatus.push(statusValue)
    }

    setSearchCriteria({ ...searchCriteria, ai_report_status: updatedStatus })
  }

  const headers = [
    { label: '事業名', key: 'org_name' },
    { label: '利用者名（撮影者）', key: 'user_name' },
    { label: 'メールアドレス', key: 'email' },
    { label: 'フォルダID', key: 'folder_id' },
    { label: 'フォルダ名', key: 'folder_name' },
    { label: 'フォルダ作成日時', key: 'created_at_posts' },
    { label: 'フォルダ共有URL', key: 'folder_share_key' },
    { label: 'フォルダ共有状態', key: 'folder_url_accessed' },
    { label: 'ファイルID', key: 'file_id' },
    { label: 'ファイル名', key: 'file_name' },
    { label: 'ファイル共有URL', key: 'file_share_key' },
    { label: 'ファイル共有状態', key: 'file_url_accessed' },
    { label: '撮影直前日時（WEB時間）', key: 'server_datetime' },
    { label: '参考住所', key: 'address' },
    { label: '撮影タイミング★', key: '撮影タイミング★' },
    { label: '撮影場所★', key: 'shooting_place' },
    { label: '撮影場所テキスト★', key: 'path' },
    { label: 'メモ', key: 'メモ' },
  ]

  const customFields = headers.map((header) => {
    return {
      label: header.label,
      value: (row: any) => row[header.key],
    }
  })

  const dataResultExportCsv = useMemo(() => {
    return dataExportCSV.map(post => {
      return {
        ...post,
        shooting_place: post.shooting_place_lat + ',' + post.shooting_place_long,
      }
    })
  }, [dataExportCSV])

  return (
    <CardComponent>
      <h1>ロケトラ管理</h1>
      <SearchAreaContainer>
        <FlexGap30>
          <FlexContent>
            <label htmlFor="" className="label">
              写真ID
            </label>
            <Input
              className="input input-bordered w-full"
              type="text"
              placeholder="写真ID"
              value={searchCriteria.file_id}
              onChange={(e) =>
                setSearchCriteria({
                  ...searchCriteria,
                  file_id: e.target.value,
                })
              }
            />
            <label htmlFor="" className="label">
              フォルダID
            </label>
            <Input
              className="input input-bordered w-full"
              type="text"
              placeholder="フォルダID"
              value={searchCriteria.folder_id}
              onChange={(e) =>
                setSearchCriteria({
                  ...searchCriteria,
                  folder_id: e.target.value,
                })
              }
            />
            <label htmlFor="" className="label">
              ユーザID
            </label>
            <Input
              className="input input-bordered w-full"
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
            <label htmlFor="" className="label">
              写真ステータス
            </label>
            <CheckboxContainer>
              <CheckboxLabel>
                <CheckboxInput
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  checked={searchCriteria.stash.includes(0)}
                  onChange={() => handleStatusChange(0)}
                />
                <CheckboxSpan className="label-text">通常</CheckboxSpan>
              </CheckboxLabel>
              <CheckboxLabel>
                <CheckboxInput
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  checked={searchCriteria.stash.includes(1)}
                  onChange={() => handleStatusChange(1)}
                />
                <CheckboxSpan className="label-text">ゴミ箱</CheckboxSpan>
              </CheckboxLabel>
              <CheckboxLabel>
                <CheckboxInput
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  checked={searchCriteria.stop_shared.includes(1)}
                  onChange={() => handleStopSharedChange(1)}
                />
                <CheckboxSpan className="label-text">共有不可</CheckboxSpan>
              </CheckboxLabel>
              <CheckboxLabel>
                <CheckboxInput
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  checked={searchCriteria.stash.includes(2)}
                  onChange={() => handleStatusChange(2)}
                />
                <CheckboxSpan className="label-text">消去</CheckboxSpan>
              </CheckboxLabel>
            </CheckboxContainer>
            <label htmlFor="" className="label">
              ゴミ箱移動日
            </label>
            <Flex>
              <DatePicker
                className="date-input input input-bordered h-10 w-full max-w-xs"
                selected={stashUpdatedAtFrom}
                onChange={handleStashUpdatedAtFromChange}
                locale={ja}
                dateFormat="yyyy/MM/dd"
              />
              <DatePicker
                className="date-input input input-bordered h-10 w-full max-w-xs"
                selected={stashUpdatedAtTo}
                onChange={handleStashUpdatedAtToChange}
                locale={ja}
                dateFormat="yyyy/MM/dd"
              />
            </Flex>
            <label htmlFor="" className="label">
              アップロード日
            </label>
            <Flex>
              <DatePicker
                className="date-input input input-bordered h-10 w-full max-w-xs"
                selected={createdAtFrom}
                onChange={handleCreatedAtFromChange}
                locale={ja}
                dateFormat="yyyy/MM/dd"
              />
              <DatePicker
                className="date-input input input-bordered h-10 w-full max-w-xs"
                selected={createdAtTo}
                onChange={handleCreatedAtToChange}
                locale={ja}
                dateFormat="yyyy/MM/dd"
              />
            </Flex>
          </FlexContent>
          <FlexContent>
            <label htmlFor="" className="label">
              AIステータス
            </label>
            <CheckboxContainer>
              <CheckboxLabel>
                <CheckboxInput
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  checked={searchCriteria.ai_report_status.includes(0)}
                  onChange={() => handleAiReportStatusChange(0)}
                />
                <CheckboxSpan className="label-text">通報なし</CheckboxSpan>
              </CheckboxLabel>
              <CheckboxLabel>
                <CheckboxInput
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  checked={searchCriteria.ai_report_status.includes(1)}
                  onChange={() => handleAiReportStatusChange(1)}
                />
                <CheckboxSpan className="label-text">通報中</CheckboxSpan>
              </CheckboxLabel>
              <CheckboxLabel>
                <CheckboxInput
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  checked={searchCriteria.ai_report_status.includes(2)}
                  onChange={() => handleAiReportStatusChange(2)}
                />
                <CheckboxSpan className="label-text">通報解除</CheckboxSpan>
              </CheckboxLabel>
            </CheckboxContainer>
            <label htmlFor="" className="label">
              <CheckboxSpan className="label-text">AI遷移日</CheckboxSpan>
            </label>
            <Flex>
              <DatePicker
                className="date-input input input-bordered h-10 w-full max-w-xs"
                selected={aiReportedAtFrom}
                onChange={handleAiReportedAtFromChange}
                locale={ja}
                dateFormat="yyyy/MM/dd"
              />
              <DatePicker
                className="date-input input input-bordered h-10 w-full max-w-xs"
                selected={aiReportedAtTo}
                onChange={handleAiReportedAtToChange}
                locale={ja}
                dateFormat="yyyy/MM/dd"
              />
            </Flex>
            <label htmlFor="" className="label">
              通報ステータス
            </label>
            <CheckboxContainer>
              <CheckboxLabel>
                <CheckboxInput
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  checked={searchCriteria.report_status.includes(0)}
                  onChange={() => handleReportStatusChange(0)}
                />
                <CheckboxSpan className="label-text">通報なし</CheckboxSpan>
              </CheckboxLabel>
              <CheckboxLabel>
                <CheckboxInput
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  checked={searchCriteria.report_status.includes(1)}
                  onChange={() => handleReportStatusChange(1)}
                />
                <CheckboxSpan className="label-text">通報中</CheckboxSpan>
              </CheckboxLabel>
              <CheckboxLabel>
                <CheckboxInput
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  checked={searchCriteria.report_status.includes(2)}
                  onChange={() => handleReportStatusChange(2)}
                />
                <CheckboxSpan className="label-text">通報解除</CheckboxSpan>
              </CheckboxLabel>
            </CheckboxContainer>
            <label htmlFor="" className="label">
              通報日
            </label>
            <Flex>
              <DatePicker
                className="date-input input input-bordered h-10 w-full max-w-xs"
                selected={reportedAtFrom}
                onChange={handleReportedAtFromChange}
                locale={ja}
                dateFormat="yyyy/MM/dd"
              />
              <DatePicker
                className="date-input input input-bordered h-10 w-full max-w-xs"
                selected={reportedAtTo}
                onChange={handleReportedAtToChange}
                locale={ja}
                dateFormat="yyyy/MM/dd"
              />
            </Flex>
          </FlexContent>
        </FlexGap30>
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
      <div>
        <CSVButtonContainer>
          <CSVExportButton
            csvData={dataResultExportCsv as unknown as Array<Record<string, string>>}
            customFields={customFields}
            csvFileName={`posts`}
          />
        </CSVButtonContainer>
      </div>
      <div
        className="border-b border-gray-200 shadow"
        style={{ overflow: 'auto' }}
      >
        {isLoading ? (
          <></>
        ) : (
          <>
            {posts.length > 0 ? (
              <>
                <Table className="table-auto divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <Th className="px-6 py-2 text-xs text-gray-500">No.</Th>
                      <Th className="px-6 py-2 text-xs text-gray-500">
                        サムネイル
                      </Th>
                      <Th className="px-6 py-2 text-xs text-gray-500">
                        フォルダID
                      </Th>
                      <Th className="px-6 py-2 text-xs text-gray-500">
                        ユーザID
                      </Th>
                      <Th className="px-6 py-2 text-xs text-gray-500">
                        ステータス
                      </Th>
                      <Th className="px-6 py-2 text-xs text-gray-500">
                        遷移日
                      </Th>
                      <Th className="px-6 py-2 text-xs text-gray-500">
                        ゴミ箱移動日
                      </Th>
                      <Th className="px-6 py-2 text-xs text-gray-500">
                        AIステータス
                      </Th>
                      <Th className="px-6 py-2 text-xs text-gray-500">
                        AI検出日
                      </Th>
                      <Th className="px-6 py-2 text-xs text-gray-500">
                        AI遷移日
                      </Th>
                      <Th className="px-6 py-2 text-xs text-gray-500">
                        通報ステータス
                      </Th>
                      <Th className="px-6 py-2 text-xs text-gray-500">
                        通報日
                      </Th>
                      <Th className="px-6 py-2 text-xs text-gray-500">詳細</Th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300 bg-white">
                    {posts.map((post) => (
                      <PostsListTable post={post} key={post.id} />
                    ))}
                  </tbody>
                </Table>
              </>
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

export default PostsPage
