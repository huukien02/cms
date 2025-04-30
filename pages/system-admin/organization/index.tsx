import Pagination from '@/components/common/Pagination'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Styled from 'styled-components'
import { format } from 'date-fns'
import CardComponent from '@/components/common/Card'
import CommonPrimaryButton from '@/components/common/Button/PrimaryButton'
import CommonOutlineButton from '@/components/common/Button/OutlineButton'
import Popup from '@/components/Popup'
import { axiosInstanceSystemAdmin } from '@/libs'

export type OrganizationStatus = 'entry' | 'deleted'

export interface OrganizationType {
  id: number
  created_at: string
  name: string
  business_id: string
  direction: string
  s3_info: any
  user_orgs: any
  login_url: string
  logo_url?: string | null
  primary_color?: string | null
  secondary_color?: string | null
  tertiary_color?: string | null
  show_items: boolean
  edit_options?: any
  status?: OrganizationStatus | null
  admin_email?: string | null
  admin_name?: string | null
}

type OrganizationSearch = {
  business_id: string
  business_name: string
  directory: string
  color_code: string
  bucket_name: string
}

type S3Info = {
  bucket_name: string
  endpoint: string
  access_key_id: string
}

const Table = Styled.table`
  width: 100%;
`

const Th = Styled.th`
  white-space: nowrap;
  text-align: left;
`

const Td = Styled.td`
  py-4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
  text-align: left;
`

const SearchAreaContainer = Styled.div`
  margin-top: 20px;
  padding:20px;
  border-radius: 20px;
  background-color: #FAFAFA;
 `

const Input = Styled.input`
  width: 100%;
  height: 40px;
  border-radius: 5px;
  border: 1px solid #DADADD;
  margin-bottom: 10px;
  padding-left: 10px;
`

const FlexGap30 = Styled.div`
  display: flex;
  gap: 30px;
`

const BoxInput = Styled.div`
  width: 358px;
  display: flex;
  flex-direction: column;
`

const BoxInputColor = Styled.div`
  width: 168px;
  display: flex;
  flex-direction: column;
`

const BoxButton = Styled.div`
  display: flex;
  gap: 10px;
`

const AddButton = Styled.button`
  margin-top: 20px;
  height: 48px;
  width: 224px;
  border: none;
  border-radius: 8px;
  background-color: #E6791A;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
`

export default function Organization() {
  const router = useRouter()
  const [openSearch, setOpenSearch] = useState(false)
  const [s3Info, setS3Info] = useState<S3Info | null>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)

  const [isDataFetched, setIsDataFetched] = useState(false)
  const [organizations, setOrganizations] = useState([])

  const [searchOrganization, setSearchOrganization] =
    useState<OrganizationSearch>({
      business_id: '',
      business_name: '',
      directory: '',
      color_code: '',
      bucket_name: '',
    })

  useEffect(() => {
    if (!isDataFetched) {
      fetchOrganization(currentPage)
    }
  }, [currentPage, searchOrganization])

  const fetchOrganization = async (page: number) => {
    try {
      const filteredSearchParams = Object.fromEntries(
        Object.entries(searchOrganization).filter(
          ([, value]) => value !== null && value !== undefined && value !== '',
        ),
      )

      const queryParams = new URLSearchParams()
      queryParams.append('page', page.toString())
      queryParams.append('per_page', '20')

      if (filteredSearchParams.directory) {
        queryParams.append('direction', filteredSearchParams.directory)
      }
      if (filteredSearchParams.business_id) {
        queryParams.append('business_id', filteredSearchParams.business_id)
      }
      if (filteredSearchParams.business_name) {
        queryParams.append('name', filteredSearchParams.business_name)
      }
      if (filteredSearchParams.color_code) {
        queryParams.append('color_code', filteredSearchParams.color_code)
      }
      if (filteredSearchParams.bucket_name) {
        queryParams.append('bucket_name', filteredSearchParams.bucket_name)
      }

      const response = await axiosInstanceSystemAdmin.get(
        `/api/system_admin/1.0/organizations?${queryParams.toString()}`,
      )

      const data = response.data
      setOrganizations(data.data.data)
      setLastPage(data.data.last_page)
      setIsDataFetched(true)
    } catch (error) {
      console.error('Error fetching posts:', error)
    }
  }

  const handlePageChange = (page: number) => {
    setIsDataFetched(false)
    setCurrentPage(page)
  }

  const handleDetail = (id: number) => {
    router.push(`/system-admin/organization/detail?organization_id=${id}`)
  }

  const handleSearch = () => {
    fetchOrganization(1)
    setCurrentPage(1)
  }

  const handleSearchClear = () => {
    setSearchOrganization({
      business_id: '',
      business_name: '',
      directory: '',
      color_code: '',
      bucket_name: '',
    })
  }

  return (
    <CardComponent>
      <BoxButton>
        <h1 className="text-[20px] font-[600]">事業管理</h1>
        <button className="btn" onClick={() => setOpenSearch(!openSearch)}>
          {openSearch ? '折り返す' : '絞り込む'}
        </button>
      </BoxButton>

      {openSearch && (
        <SearchAreaContainer>
          <FlexGap30>
            <BoxInput>
              <label htmlFor="" className="label">
                事業ID
              </label>
              <Input
                className="input input-bordered w-full !bg-[#FFFFFF]"
                type="text"
                placeholder="事業ID"
                onChange={(e) =>
                  setSearchOrganization({
                    ...searchOrganization,
                    business_id: e.target.value,
                  })
                }
                value={searchOrganization.business_id}
              />
            </BoxInput>
            <BoxInput>
              <label htmlFor="" className="label">
                事業名
              </label>
              <Input
                className="input input-bordered w-full !bg-[#FFFFFF]"
                type="text"
                placeholder="事業名"
                onChange={(e) =>
                  setSearchOrganization({
                    ...searchOrganization,
                    business_name: e.target.value,
                  })
                }
                value={searchOrganization.business_name}
              />
            </BoxInput>
            <BoxInput>
              <label htmlFor="" className="label">
                ディレクトリ
              </label>
              <Input
                className="input input-bordered w-full !bg-[#FFFFFF]"
                type="text"
                placeholder="ディレクトリ"
                onChange={(e) =>
                  setSearchOrganization({
                    ...searchOrganization,
                    directory: e.target.value,
                  })
                }
                value={searchOrganization.directory}
              />
            </BoxInput>
          </FlexGap30>
          <FlexGap30>
            <BoxInputColor>
              <label htmlFor="" className="label">
                カラーコード
              </label>
              <div className="align-center flex justify-center gap-[10px]">
                <input
                  className="min-h-[40px] min-w-[40px] rounded-[5px]"
                  type="color"
                  value={searchOrganization.color_code}
                  onChange={(e) =>
                    setSearchOrganization({
                      ...searchOrganization,
                      color_code: e.target.value,
                    })
                  }
                />
                <Input
                  className="input input-bordered w-[100px] !bg-[#FFFFFF]"
                  type="text"
                  placeholder="#4CAA9C"
                  value={searchOrganization.color_code}
                  onChange={(e) => {
                    const value = e.target.value
                    setSearchOrganization({
                      ...searchOrganization,
                      color_code: value,
                    })
                  }}
                />
              </div>
            </BoxInputColor>
            <BoxInput>
              <label htmlFor="" className="label">
                S3｜バケット名
              </label>
              <Input
                className="input input-bordered w-full !bg-[#FFFFFF]"
                type="text"
                placeholder="バケット名"
                onChange={(e) =>
                  setSearchOrganization({
                    ...searchOrganization,
                    bucket_name: e.target.value,
                  })
                }
                value={searchOrganization.bucket_name}
              />
            </BoxInput>
          </FlexGap30>
          <div className="mt-[15px]">
            <CommonPrimaryButton
              style={{
                background: ' #E6791A',
                border: 'none',
                width: '188px',
                height: '40px',
              }}
              onClick={handleSearch}
            >
              検索
            </CommonPrimaryButton>
            <CommonOutlineButton
              onClick={handleSearchClear}
              style={{
                width: '188px',
                height: '40px',
                marginLeft: '20px',
                background: '#fff',
              }}
            >
              クリア
            </CommonOutlineButton>
          </div>
        </SearchAreaContainer>
      )}

      <AddButton onClick={() => router.push('/system-admin/organization/add')}>
        新規追加
      </AddButton>

      {organizations && organizations.length > 0 && (
        <div className="mt-5">
          <Table className="table-auto divide-y divide-gray-300 border">
            <thead className="bg-gray-50">
              <tr>
                <Th className="px-6 py-2 text-xs text-gray-500">No.</Th>
                <Th className="px-6 py-2 text-xs text-gray-500">作成日時</Th>
                <Th className="px-6 py-2 text-xs text-gray-500">事業ID</Th>
                <Th className="px-6 py-2 text-xs text-gray-500">事業名</Th>
                <Th className="px-6 py-2 text-xs text-gray-500">
                  ディレクトリ
                </Th>
                <Th className="px-6 py-2 text-xs text-gray-500">RDS情報</Th>
                <Th className="px-6 py-2 text-xs text-gray-500">S3情報</Th>
                <Th className="px-6 py-2 text-xs text-gray-500">詳細</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300 bg-white">
              {organizations?.map((org: OrganizationType, index: number) => (
                <tr key={org.id}>
                  <Td className="px-6 py-2 text-sm text-gray-700 underline">
                    {org.id}
                  </Td>
                  <Td className="px-6 py-2 text-sm text-gray-700">
                    {format(new Date(org.created_at), 'dd/MM/yyyy HH:mm:ss')}
                  </Td>
                  <Td className="px-6 py-2 text-sm">{org.business_id}</Td>
                  <Td className="px-6 py-2 text-sm text-gray-700">
                    {org.name}
                  </Td>
                  <Td className="px-6 py-2 text-sm text-gray-700">
                    {org.direction}
                  </Td>
                  <Td className="px-6 py-2 text-sm capitalize text-gray-700">
                    {org.status || '—'}
                  </Td>
                  <Td
                    className="cursor-pointer px-6 py-2 text-sm text-blue-600 text-blue-700 underline"
                    onClick={() => {
                      setS3Info(org.s3_info)
                    }}
                  >
                    {org?.s3_info?.bucket_name}
                  </Td>
                  <Td className="flex flex-col gap-2 px-6 py-2 text-sm text-gray-700">
                    <button
                      onClick={() => handleDetail(org.id)}
                      className="text-left text-sm text-[#641AE6] underline"
                    >
                      詳細
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination
            currentPage={currentPage}
            lastPage={lastPage}
            onPageChange={handlePageChange}
          />
          <Popup
            isOpen={null !== s3Info}
            onClose={() => {
              setS3Info(null)
            }}
            title="詳細"
            content={
              <div>
                <p>{s3Info?.bucket_name}</p>
                <p>{s3Info?.endpoint}</p>
                <p>{s3Info?.access_key_id}</p>
              </div>
            }
          />
        </div>
      )}
    </CardComponent>
  )
}
