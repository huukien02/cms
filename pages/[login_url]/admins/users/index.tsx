import { ChangeEvent, useState, useEffect } from 'react'
import Link from 'next/link'
import { Admin } from '@/types'
import Styled from 'styled-components'
import CardComponent from '@/components/common/Card'
import Pagination from '@/components/common/Pagination'
import axios from 'axios'
import Cookies from 'js-cookie'
import PopupBackgroundComponent from '@/components/common/PopupBackground'
import PopupContainerSmallComponent from '@/components/common/PopupContainerSmall'
import CloseButton from '@/components/common/Button/CloseButton'
import CommonPopupH2 from '@/components/common/CommonPopupH2'
import CommonPrimaryButton from '@/components/common/Button/PrimaryButton'
import CSVExportButton from '@/components/common/Button/CSVExportButton'
import UserListTable from '@/components/pages/Admins/UserListTable'
import UserCreateCompletePopup from '@/components/pages/Admins/UserCreateCompletePopup'
import UserCreateForm from '@/components/pages/Admins/UserCreateForm'
import ChangePasswordPopup from '@/components/pages/Admins/ChangePasswordPopup'
import ConfirmPopup from '@/components/common/ConfirmPopup'
import CompletedPopup from '@/components/common/CompletedPopup'
import { axiosInstance } from '@/libs'

const SearchAreaContainer = Styled.div`
  border-bottom: 1px solid #000;
  margin-bottom: 30px;
  padding-bottom: 30px;
`

const Table = Styled.table`
  width: 100%;
  margin-bottom: 15px;
`

const Th = Styled.th`
  whitespace-nowrap
`

const SearchBar = Styled.input`
  margin-bottom: 1rem;
  padding: 0.5rem;
`

const SearchButton = Styled.button`
  margin-left: 0.5rem;
  height: 48px;
`

const ButtonContainer = Styled.div`
  display: flex;
  justify-content: end;
  margin-bottom: 30px;
`

type FieldErrors = {
  email?: string
  password?: string
  confirm_password?: string
  request?: string
}

interface ApiResponse {
  data: Admin[]
  last_page: number
  current_page: number
  per_page: number
  total: number
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<Admin[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [searchEmail, setSearchEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [isPopupChangePassword, setIsPopupChangePassword] = useState(false)
  const [isPopupChangePasswordComplete, setIsPopupChangePasswordComplete] =
    useState(false)
  const [isPopupAdminUserDelete, setIPopupAdminUserDelete] = useState(false)
  const [isPopupAdminUserDeleteComplete, setIsPopupAdminUserDeleteComplete] =
    useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [adminId, setAdminId] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isPopupOpenCreateAdminUserForm, setIsPopupOpenCreateAdminUserForm] =
    useState(false)
  const [
    isPopupOpenCreateAdminUserComplete,
    setisPopupOpenCreateAdminUserComplete,
  ] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [validationErrors, setValidationErrors] = useState<FieldErrors>({
    email: '',
    password: '',
    confirm_password: '',
    request: '',
  })
  const [csvData, setCsvData] = useState<Array<Record<string, string>>>([])
  const [isNewPasswordValid, setIsNewPasswordValid] = useState(false)
  const [isFormValid, setIsFormValid] = useState(false)
  const [isPasswordFormValid, setIsPasswordFormValid] = useState(false)
  const [isDataFetched, setIsDataFetched] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const headers = [
    { label: 'No.', key: 'No.' },
    { label: 'ユーザーID', key: 'ユーザーID' },
    { label: 'メールアドレス', key: 'メールアドレス' },
    { label: '作成日', key: '作成日' },
  ]

  const customFields = headers.map((header) => {
    return {
      label: header.label,
      value: (row: any) => row[header.key],
    }
  })

  const newErrors: FieldErrors = { ...validationErrors }

  useEffect(() => {
    if (!isDataFetched) {
      fetchUsers(currentPage, searchEmail)
    }

    if (
      newPassword === confirmPassword &&
      email &&
      newPassword &&
      confirmPassword &&
      isNewPasswordValid
    ) {
      setIsFormValid(true)
    } else {
      setIsFormValid(false)
    }

    if (
      newPassword === confirmPassword &&
      newPassword &&
      confirmPassword &&
      isNewPasswordValid
    ) {
      setIsPasswordFormValid(true)
    } else {
      setIsPasswordFormValid(false)
    }
  }, [email, newPassword, confirmPassword, currentPage])

  const fetchUsers = async (page: number, email: string) => {
    setIsLoading(true)
    try {
      const response = await axiosInstance.get<ApiResponse>(`/cms/1.0/admins`, {
        params: {
          per_page: 20,
          page: page,
          email: email,
        },
      })

      const csvResponse = await axiosInstance.get<ApiResponse>(
        `/cms/1.0/admins`,
        {
          params: {
            email: email,
          },
        },
      )
      const data = response.data.data
      const csv_data = csvResponse.data.data

      setUsers(data)
      setLastPage(response.data.last_page)

      const csvData: any = csv_data.map((user) => ({
        'No.': user.id,
        ユーザーID: user.admin_id,
        メールアドレス: user.email,
        作成日: user.created_at,
      }))
      setCsvData(csvData)
      setIsDataFetched(true)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateUser = async () => {
    try {
      const response = await axiosInstance.post(`/cms/1.0/admins/register`, {
        ...formData,
        email: email,
        password: newPassword,
      })

      if (response.status === 200) {
        fetchUsers(currentPage, searchEmail)
        closePopupCreateAdminUserForm()
        openPopupCreateAdminUserComplete()
      } else {
        console.error('Error:', response)
      }
    } catch (error: any) {
      setValidationErrors({
        request: error.response.data.message,
      })
      return
    }
  }

  const adminUserChangePassword = async (adminId: string) => {
    try {
      const requestBody = {
        new_password: newPassword,
      }

      console.log(requestBody)

      const response = await axiosInstance.put(
        `/cms/1.0/admins/${adminId}/change-password`,
        requestBody,
      )

      closePopupChangePassword()
      openPopupChangePasswordComplete()
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 500) {
        // router.push('/500');
      }
    }
  }

  const adminUserDelete = async () => {
    try {
      const requestBody = {
        new_password: newPassword,
      }

      console.log(requestBody)

      const response = await axiosInstance.delete(`/cms/1.0/admins/${adminId}`)

      closePopupAdminUserDelete()
      openPopupAdminUserDeleteComplete()
      fetchUsers(currentPage, searchEmail)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 500) {
      }
    }
  }

  const applyValidationRule = (name: string, value: string) => {
    let error = ''

    if (name === 'email') {
      error = value ? '' : 'メールアドレスを入力してください。'
    } else if (name === 'password') {
      error = value ? '' : 'パスワードを入力してください。'
    } else if (name === 'confirm_password') {
      error = value ? '' : 'パスワード(確認用)を入力してください。'
    }

    return error
  }

  const onInputBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const error = applyValidationRule(name, value)

    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }))
  }

  const changeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    const registerEmail = e.target.value
    setEmail(registerEmail)
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const openPopupCreateAdminUserForm = () => {
    setIsPopupOpenCreateAdminUserForm(true)
  }

  const closePopupCreateAdminUserForm = () => {
    setEmail('')
    setNewPassword('')
    setConfirmPassword('')
    showPassword === true ? toggleShowPassword() : ''
    setValidationErrors({
      email: '',
      password: '',
      confirm_password: '',
      request: '',
    })
    setIsNewPasswordValid(false)
    setIsFormValid(false)
    setIsPopupOpenCreateAdminUserForm(false)
  }

  const openPopupCreateAdminUserComplete = () => {
    setisPopupOpenCreateAdminUserComplete(true)
  }

  const closePopupCreateAdminUserComplete = () => {
    setisPopupOpenCreateAdminUserComplete(false)
  }

  const handlePageChange = (page: number) => {
    setIsDataFetched(false)
    setCurrentPage(page)
  }

  const handleSearch = () => {
    fetchUsers(1, searchEmail)
  }

  const handleClear = () => {
    setSearchEmail('')
    fetchUsers(1, '')
  }

  // Ｌｏｒｅｍ ｉｐｓｕｍ ｄｏｌｏｒ ｓｉｔ ａｍｅｔ, ｃｏｎｓｅｃｔｅｔｕｒ ａｄｉｐｉｓｃｉｎｇ

  const changeNewPassword = (e: ChangeEvent<HTMLInputElement>) => {
    let newPassword = e.target.value

    const filteredPassword = newPassword
      .replace(/[^\x01-\x7E]/g, '')
      .replace(/\s/g, '')

    setNewPassword(filteredPassword)
    const isMatch =
      filteredPassword !== '' &&
      confirmPassword !== '' &&
      confirmPassword === filteredPassword
    onInputBlur(e)
    setIsNewPasswordValid(isMatch)
  }

  const changeConfirmPassword = (e: ChangeEvent<HTMLInputElement>) => {
    let confirm = e.target.value

    const filteredPassword = confirm
      .replace(/[^\x01-\x7E]/g, '')
      .replace(/\s/g, '')

    setConfirmPassword(filteredPassword)
    const isMatch =
      newPassword !== '' &&
      filteredPassword !== '' &&
      newPassword === filteredPassword
    onInputBlur(e)
    setIsNewPasswordValid(isMatch)
  }

  const openPopupChangePassword = (adminId: string) => {
    setAdminId(adminId)
    setIsPopupChangePassword(true)
  }

  const closePopupChangePassword = () => {
    setNewPassword('')
    setConfirmPassword('')
    showPassword === true ? toggleShowPassword() : ''
    setValidationErrors({
      password: '',
      confirm_password: '',
    })
    setIsPasswordFormValid(false)
    setIsNewPasswordValid(false)
    setIsPopupChangePassword(false)
  }

  const openPopupChangePasswordComplete = () => {
    setIsPopupChangePasswordComplete(true)
  }

  const closePopupChangePasswordComplete = () => {
    setIsPopupChangePasswordComplete(false)
  }

  const openPopupAdminUserDelete = (adminId: string) => {
    setAdminId(adminId)
    setIPopupAdminUserDelete(true)
  }

  const closePopupAdminUserDelete = () => {
    setIPopupAdminUserDelete(false)
  }

  const openPopupAdminUserDeleteComplete = () => {
    setIsPopupAdminUserDeleteComplete(true)
  }

  const closePopupAdminUserDeleteComplete = () => {
    setIsPopupAdminUserDeleteComplete(false)
  }

  return (
    <>
      <CardComponent>
        <h1>管理ユーザー管理</h1>
        <SearchAreaContainer>
          <label className="label">
            <span className="label-text-alt" style={{ cursor: 'default' }}>
              メールアドレス
            </span>
          </label>
          <SearchBar
            className="input input-bordered input-primary w-full max-w-xs"
            type="text"
            placeholder="メールアドレスで検索"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
          />
          <SearchButton className="btn btn-primary w-20" onClick={handleSearch}>
            検索
          </SearchButton>
          <SearchButton className="btn btn-outline w-20" onClick={handleClear}>
            クリア
          </SearchButton>
        </SearchAreaContainer>
        <ButtonContainer>
          <CommonPrimaryButton onClick={openPopupCreateAdminUserForm}>
            アカウント追加
          </CommonPrimaryButton>
          <CSVExportButton
            csvData={csvData}
            customFields={customFields}
            csvFileName={`admin_user_list`}
          />
        </ButtonContainer>
        <div
          className="border-b border-gray-200 shadow"
          style={{ overflow: 'auto' }}
        >
          {isLoading ? (
            <></>
          ) : (
            <>
              {users.length > 0 ? (
                <>
                  <Table className="table-auto divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <Th className="px-6 py-2 text-xs text-gray-500">No.</Th>
                        <Th className="px-6 py-2 text-xs text-gray-500">
                          ユーザID
                        </Th>
                        <Th className="px-6 py-2 text-xs text-gray-500">
                          メールアドレス
                        </Th>
                        <Th className="px-6 py-2 text-xs text-gray-500">
                          作成日
                        </Th>
                        <Th className="px-6 py-2 text-xs text-gray-500">
                          パスワード
                        </Th>
                        <Th className="px-6 py-2 text-xs text-gray-500">
                          編集
                        </Th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-300 bg-white">
                      {users.map((user) => (
                        <UserListTable
                          user={user}
                          key={user.id}
                          openPopupChangePassword={openPopupChangePassword}
                          openPopupAdminUserDelete={openPopupAdminUserDelete}
                        />
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

      {isPopupChangePassword && (
        <>
          <ChangePasswordPopup
            showPassword={showPassword}
            toggleShowPassword={toggleShowPassword}
            isOpen={isPopupChangePassword}
            adminId={adminId}
            isNewPasswordValid={isNewPasswordValid}
            newPassword={newPassword}
            confirmPassword={confirmPassword}
            closePopup={closePopupChangePassword}
            changeNewPassword={changeNewPassword}
            changeConfirmPassword={changeConfirmPassword}
            adminUserChangePassword={adminUserChangePassword}
            onInputBlur={onInputBlur}
            validationErrors={validationErrors}
            isPasswordFormValid={isPasswordFormValid}
          />
        </>
      )}

      {isPopupChangePasswordComplete && (
        <>
          <PopupBackgroundComponent onClick={closePopupChangePasswordComplete}>
            <></>
          </PopupBackgroundComponent>
          <PopupContainerSmallComponent>
            <CloseButton
              onClick={closePopupChangePasswordComplete}
            ></CloseButton>
            <CommonPopupH2>パスワードを変更しました。</CommonPopupH2>
          </PopupContainerSmallComponent>
        </>
      )}

      <ConfirmPopup
        isOpen={isPopupAdminUserDelete}
        onClose={closePopupAdminUserDelete}
        onConfirm={adminUserDelete}
        title="ユーザーを削除しますか？"
        confirmButtonText="削除する"
      />

      <CompletedPopup
        isOpen={isPopupAdminUserDeleteComplete}
        onClose={closePopupAdminUserDeleteComplete}
        title="削除しました。"
      />

      {isPopupOpenCreateAdminUserForm && (
        <UserCreateForm
          showPassword={showPassword}
          toggleShowPassword={toggleShowPassword}
          changeEmail={changeEmail}
          changeNewPassword={changeNewPassword}
          changeConfirmPassword={changeConfirmPassword}
          onInputBlur={onInputBlur}
          handleCreateUser={handleCreateUser}
          validationErrors={validationErrors}
          closePopupCreateAdminUserForm={closePopupCreateAdminUserForm}
          isFormValid={isFormValid}
          newPassword={newPassword}
          confirmPassword={confirmPassword}
          isNewPasswordValid={isNewPasswordValid}
        />
      )}

      {isPopupOpenCreateAdminUserComplete && (
        <UserCreateCompletePopup
          closePopup={closePopupCreateAdminUserComplete}
        />
      )}
    </>
  )
}

export default UserList
