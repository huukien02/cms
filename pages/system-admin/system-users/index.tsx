import Pagination from '@/components/common/Pagination'
import { axiosInstanceSystemAdmin } from '@/libs'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import Styled from 'styled-components'
import { format } from 'date-fns'
import Button from '@/components/Button'
import CardComponent from '@/components/common/Card'
import PopupBackgroundComponent from '@/components/common/PopupBackground'
import PopupContainerSmallComponent from '@/components/common/PopupContainerSmall'
import CloseButton from '@/components/common/Button/CloseButton'
import CommonPopupH2 from '@/components/common/CommonPopupH2'
import CommonSeccondaryButton from '@/components/common/Button/SecondaryButton'
import CommonOutlineButton from '@/components/common/Button/OutlineButton'
import { ChangePasswordUser } from '@/components/Admin/User/ChangePasswordUser'
import { CreateUserModal } from '@/components/Admin/User/CreateUserModal'
import CSVExportButton from '@/components/common/Button/CSVExportButton'
export type SystemUsersRole = 'jimukyoku' | 'kanrisha' | 'tantosha'

export const systemUserRoles: SystemUsersRole[] = [
  'jimukyoku',
  'kanrisha',
  'tantosha',
]

export interface SystemUserType {
  code: string
  id: number
  name: string
  email: string
  password: string | null
  organization_id: number
  company_id: string
  role: SystemUsersRole
  created_at: string
}

const Table = Styled.table`
  width: 100%;
`

const Th = Styled.th`
  text-align: left;
  white-space: nowrap;
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

const FlexGap30 = Styled.div`
  display: flex;
  gap: 30px;
`

const BoxInput = Styled.div`
  min-width: 800px;
  display: flex;
  flex-direction: column;
`

const Input = Styled.input`
  width: 100%;
  height: 40px;
  border-radius: 5px;
  border: 1px solid #DADADD;
  margin-bottom: 10px;
  padding-left: 10px;
`

type UsersSearch = {
  email: string
}

export default function SystemUsers() {
  const router = useRouter()

  const [idUser, setIdUser] = useState<Number | null>(null)
  const [csvData, setCsvData] = useState<Array<Record<string, string>>>([])
  const fileInputRef = useRef<any>(null)
  const [isDeleteModal, setIsDeleteModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)

  const headers = [
    { label: 'No.', key: 'No.' },
    { label: 'ユーザID', key: 'ユーザID' },
    { label: 'メールアドレス', key: 'メールアドレス' },
    { label: '作成日', key: '作成日' },
  ]

  const customFields = headers.map((header) => ({
    label: header.label,
    value: (row: any) => row[header.key],
  }))

  const [openCreateUser, setOpenCreateUser] = useState(false)
  const [openChangePassword, setOpenChangePassword] = useState({
    isOpen: false,
    id: null as number | null,
  })

  const [isDataFetched, setIsDataFetched] = useState(false)
  const [users, setUsers] = useState([])

  const [searchUsers, setSearchUsers] = useState<UsersSearch>({
    email: '',
  })

  const handleFileUpload = async (event: any) => {
    const file = event.target.files[0]
    const formData = new FormData()
    formData.append('csv_file', file)

    if (file) {
      const response = await axiosInstanceSystemAdmin.post(
        `/api/system_admin/1.0/users/import-csv`,
        formData,
      )

      if (response) {
        fetchSystemUsers(1)
      }
    }
  }

  useEffect(() => {
    if (!isDataFetched) {
      fetchSystemUsers(currentPage)
    }
  }, [currentPage])

  const fetchSystemUsers = async (page: number) => {
    try {
      const filteredSearchParams = Object.fromEntries(
        Object.entries(searchUsers).filter(
          ([, value]) => value !== null && value !== undefined && value !== '',
        ),
      )

      const queryParams = new URLSearchParams()
      queryParams.append('page', page.toString())
      queryParams.append('per_page', '20')

      if (filteredSearchParams.email) {
        queryParams.append('email', filteredSearchParams.email)
      }

      const response = await axiosInstanceSystemAdmin.get(
        `/api/system_admin/1.0/users?${queryParams.toString()}`,
      )

      const data = response.data?.data
      const csv_data = response.data?.data.data
      const csvData = csv_data.map((user: any, index: number) => ({
        'No.': index + 1,
        ユーザID: user.codecode,
        メールアドレス: user.email,
        作成日: user.created_at,
      }))
      setCsvData(csvData)
      setUsers(data.data)
      setLastPage(data.last_page)
      setIsDataFetched(true)
    } catch (error) {
      console.error('Error fetching posts:', error)
    }
  }

  const handlePageChange = (page: number) => {
    setIsDataFetched(false)
    setCurrentPage(page)
  }

  const handleSearch = () => {
    fetchSystemUsers(1)
    setCurrentPage(1)
  }

  const handleSearchClear = () => {
    setSearchUsers({
      email: '',
    })
  }

  const handleDelete = async () => {
    try {
      if (!idUser) return
      await axiosInstanceSystemAdmin.delete(
        `/api/system_admin/1.0/users/${idUser}/delete`,
      )

      closeDeleteModal()
      fetchSystemUsers(1)
    } catch (error) {
      console.error('Error fetching posts:', error)
    }
  }

  const openDeleteModal = (id: number) => {
    setIdUser(id)
    setIsDeleteModal(true)
  }
  const closeDeleteModal = () => {
    setIdUser(null)
    setIsDeleteModal(false)
  }

  return (
    <CardComponent>
      <h1 className="text-[20px] font-[600]">管理ユーザー管理</h1>
      <SearchAreaContainer>
        <FlexGap30>
          <BoxInput>
            <label htmlFor="" className="label">
              メールアドレス
            </label>
            <div className="flex w-full gap-[10px]">
              <Input
                className="input input-bordered w-full !bg-[#FFFFFF]"
                type="text"
                placeholder="メールアドレスで検索"
                onChange={(e) =>
                  setSearchUsers({
                    ...searchUsers,
                    email: e.target.value,
                  })
                }
                value={searchUsers.email}
              />
              <div className="flex gap-[10px]">
                <Button
                  w="w-[80px]"
                  h="h-[40px]"
                  color="text-[#FFFFFF]"
                  borderColor="border-[#E6791A]"
                  bg="bg-[#E6791A]"
                  onClick={handleSearch}
                >
                  検索
                </Button>
                <Button
                  w="w-[80px]"
                  h="h-[40px]"
                  color="text-[#A6ADBA]"
                  borderColor="border-[#A6ADBA]"
                  bg="bg-[#FFFFFF]"
                  onClick={handleSearchClear}
                >
                  クリア
                </Button>
              </div>
            </div>
          </BoxInput>
        </FlexGap30>
      </SearchAreaContainer>
      <div className="mt-[10px] flex justify-end gap-[20px]">
        <Button
          w="w-[244px]"
          h="h-[48px]"
          color="text-[#FFFFFF]"
          borderColor="border-[#E6791A]"
          bg="bg-[#E6791A]"
          onClick={() => setOpenCreateUser(true)}
        >
          アカウント追加
        </Button>

        <Button
          w="w-[179px]"
          h="h-[48px]"
          color="text-[#A6ADBA]"
          borderColor="border-[#2A323C]"
          bg="bg-[#2A323C]"
          onClick={() => {
            if (!fileInputRef.current) return
            fileInputRef.current.click()
          }}
        >
          CSVでアカウント追加
        </Button>
        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
        />

        <CSVExportButton
          csvData={csvData}
          customFields={customFields}
          csvFileName={`user_list`}
        />
      </div>

      {users && users.length > 0 && (
        <div className="mt-5">
          <Table className="table-auto divide-y divide-gray-300 border">
            <thead className="bg-gray-50">
              <tr>
                <Th className="px-6 py-2 text-xs text-gray-500">No</Th>
                <Th className="px-6 py-2 text-xs text-gray-500">ユーザID</Th>
                <Th className="px-6 py-2 text-xs text-gray-500">
                  メールアドレス
                </Th>
                <Th className="px-6 py-2 text-xs text-gray-500">作成日</Th>
                <Th className="px-6 py-2 text-xs text-gray-500">パスワード</Th>
                <Th className="px-6 py-2 text-xs text-gray-500">編集</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300 bg-white">
              {users?.map((user: SystemUserType) => (
                <tr key={user.id}>
                  <Td className="px-6 py-2 text-sm text-gray-700 underline">
                    {user.id}
                  </Td>
                  <Td className="px-6 py-2 text-sm text-gray-700">
                    {user.code}
                  </Td>
                  <Td className="px-6 py-2 text-sm text-gray-700">
                    {user.email}
                  </Td>
                  <Td className="px-6 py-2 text-sm text-gray-700">
                    {format(new Date(user.created_at), 'dd/MM/yyyy HH:mm:ss')}
                  </Td>
                  <Td className="px-6 py-2 text-sm text-gray-700">
                    <Button
                      w="w-[136px]"
                      h="h-[40px]"
                      color="text-[#1FB2A6]"
                      borderColor="border-[#1FB2A6]"
                      onClick={() => {
                        setOpenChangePassword({
                          id: user.id,
                          isOpen: true,
                        })
                      }}
                    >
                      パスワード変更
                    </Button>
                  </Td>
                  <Td className="flex flex-col gap-2 px-6 py-2 text-sm text-gray-700">
                    <Button
                      w="w-[64px]"
                      h="h-[40px]"
                      color="text-[#D926A9]"
                      borderColor="border-[#D926A9]"
                      onClick={() => openDeleteModal(user.id)}
                    >
                      削除
                    </Button>
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
        </div>
      )}

      {isDeleteModal && (
        <>
          <PopupBackgroundComponent onClick={closeDeleteModal}>
            <></>
          </PopupBackgroundComponent>
          <PopupContainerSmallComponent>
            <CloseButton onClick={closeDeleteModal}></CloseButton>
            <CommonPopupH2>このロットを削除しますか？</CommonPopupH2>
            <CommonSeccondaryButton onClick={handleDelete}>
              削除する
            </CommonSeccondaryButton>
            <CommonOutlineButton
              style={{ marginTop: '15px' }}
              onClick={closeDeleteModal}
            >
              キャンセル
            </CommonOutlineButton>
          </PopupContainerSmallComponent>
        </>
      )}

      <CreateUserModal
        onload={() => {
          fetchSystemUsers(1)
        }}
        open={openCreateUser}
        onClose={() => setOpenCreateUser(false)}
      />

      <ChangePasswordUser
        userId={openChangePassword.id || undefined}
        open={openChangePassword.isOpen}
        onClose={() => setOpenChangePassword({ isOpen: false, id: null })}
      />
    </CardComponent>
  )
}
