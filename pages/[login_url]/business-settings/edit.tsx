import { useEffect, useRef, useState } from 'react'
import Styled from 'styled-components'
import { useRouter } from 'next/router'
import CardComponent from '@/components/common/Card'

import CommonPrimaryButton from '@/components/common/Button/PrimaryButton'
import 'react-datepicker/dist/react-datepicker.css'
import CommonOutlineButton from '@/components/common/Button/OutlineButton'
import CompletedPopup from '@/components/common/CompletedPopup'
import { axiosInstance } from '@/libs'
import Checkbox from '@/components/common/Checkbox'
import { USER_ROLE } from '@/common/auth'
import Button from '@/components/Button'
import Image from 'next/image'
import { CreateColor } from '@/components/Admin/Organization/CreateColor'
import NoteItem from '@/components/Admin/Organization/NoteItem'
import Cookies from 'js-cookie'

const PageTitle = Styled.h1`
  font-size: 20px;
  font-weight: bold;
  margin: 0.5rem;
`
const FormContainer = Styled.div`
  margin-top: 50px;
  margin-bottom: 30px;
`
const FromCreateOrganization = Styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`
const Label = Styled.label`
  color: #353538;
  min-width: 180px;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
`
const Input = Styled.input<{ hasError: boolean }>`
  width: 100%;
  height: 40px;
  border-radius: 5px;
  border: 1px solid #DADADD;
  margin-bottom: 8px;
  padding-left: 10px;
  ${(props) =>
    props.hasError &&
    `
    color: red;
    border-color: red;
  `}
`

const ErrorText = Styled.p`
    color: red;
    margin: 0px auto 12px 12px;
    font-size: 14px;
`
const ButtonContainer = Styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
`
const BoxInputColor = Styled.div`
  width: 168px;
  display: flex;
  flex-direction: column;
`
const BoxInput = Styled.div`
  width: 358px;
  display: flex;
`
const ContainerInput = Styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  align-items: flex-start;
`
const ContainerImageWrapper = Styled.div`
  display: flex;
  width: 100%;
  gap: 40px;
  border: 1px solid #dadadd;
  padding: 20px;
  border-radius: 10px;
`
const ImageWrapper = Styled.div`
  position: relative;
  display: inline-block;
`
const PreviewImage = Styled.img`
  width: 150px;
  height: auto;
  border-radius: 10px;
`
const DeleteButtonImage = Styled.button`
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: #ffffff;
  color: #d926a9;
  padding: 5px 10px;
  cursor: pointer;
  border: 1px solid #d926a9;
  border-radius: 5px;

  &:hover {
    opacity: 0.9;
  }
`
const OuterContainer = Styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #dadadd;
  border-radius: 10px;
`
const Wrapper = Styled.div`
  padding: 15px;
`
const SectionTitle = Styled.p`
  font-size: 14px;
  font-weight: 600;
`
const AccountRow = Styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 0;
`
const AccountInfo = Styled.div`
  display: flex;
  align-items: center;
  width: 90%;
`
const AccountNumber = Styled.p`
  color: #a0a0a0;
`
const InfoBox = Styled.div`
  margin-left: 10px;
  width: 100%;
  border: 1px solid #dadadd;
  border-radius: 5px;
  padding: 5px 10px;
  font-size: 16px;
  display: flex;
  align-items: center;
`

const Role = Styled.span`
  color: #a0a0a0;
`

const Email = Styled.span`
  margin-left: 10px;
`

const ActionGroup = Styled.div`
  display: flex;
  gap: 10px;
`

const EditButton = Styled.button`
  border: 1px solid #1fb2a6;
  color: #1fb2a6;
  padding: 4px 10px;
  border-radius: 5px;
  background: transparent;
  cursor: pointer;

  &:hover {
    background-color: #e6f7f6;
  }
`

const DeleteButton = Styled.button`
  border: 1px solid #d926a9;
  color: #d926a9;
  padding: 4px 10px;
  border-radius: 5px;
  background: transparent;
  cursor: pointer;

  &:hover {
    background-color: #fef0f7;
  }
`

const UploadContainer = Styled.div``

const Title = Styled.p`
  font-size: 14px;
  font-weight: 600;
`

const ConditionList = Styled.ul`
  margin-top: 10px;
`

const ConditionItem = Styled.li`
  font-size: 14px;
`

const HiddenInput = Styled.input`
  display: none;
`

const EditOrganization = () => {
  interface FieldError {
    errorText: string
    isBlur?: boolean
  }

  interface FieldErrors {
    [key: string]: FieldError
  }

  type FieldValues = {
    name: string
    login_url: string
    logo_file: string | null
    primary_color: string | null
    secondary_color: string | null
    tertiary_color: string | null
    show_items: boolean
    admin_email: string | null
    admin_name: string | null

    endpoint: string | null
    access_key_id: string | null
    secret_access_key: string | null
  }

  interface UserOrg {
    id: number
    email: string
    password: string
    password_confirmation: string
    role: string
  }

  interface NoteItemData {
    f_name: string
    f_type: string
    f_options: string[]
  }

  const router = useRouter()
  const { login_url } = router.query

  const [isInternal, setIsInternal] = useState(true)

  const [accounts, setAccounts] = useState<UserOrg[]>([])
  const [formValue, setFormValue] = useState<any>({
    id: '',
    name: '',
    login_url: '',
    logo_file: '',
    primary_color: '',
    secondary_color: '',
    tertiary_color: '',
    edit_options: '',
    show_items: true,
    admin_email: '',
    admin_name: '',
    s3_endpoint: '',
    s3_access_key_id: '',
    s3_secret_access_key: '',
  })

  const [validationErrors, setValidationErrors] = useState<FieldErrors>({
    name: {
      errorText: '',
      isBlur: false,
    },
    login_url: {
      errorText: '',
      isBlur: false,
    },
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false)
  const [imagePreview, setImagePreview] = useState<any>(null)
  const [isModalOpenCreateColor, setIsModalOpenCreateColor] = useState(false)
  const fileInputRef = useRef<any>(null)

  const [noteItems, setNoteItems] = useState<NoteItemData[]>([
    { f_name: '', f_type: 'text', f_options: [] },
  ])

  const [modalAccount, setModalAccount] = useState<any>({
    open: false,
    type: '',
    data: {},
  })

  const [formDataAccount, setFormDataAccount] = useState({
    id: 0,
    email: '',
    password: '',
    confirmPassword: '',
    role: USER_ROLE.SECRETARIAT,
  })

  useEffect(() => {
    fetchOrganization()
  }, [login_url])

  const fetchOrganization = async () => {
    if (login_url) {
      try {
        const response = await axiosInstance.get(
          `/cms/1.0/admins/organization/detail?login_url=${login_url}`,
        )
        const data = response.data.data

        setFormValue((prevFormValue: any) => ({
          ...prevFormValue,
          id: data.id,
          name: data.name,
          login_url: data.login_url,
          primary_color: data?.primary_color ?? '',
          secondary_color: data?.secondary_color ?? '',
          tertiary_color: data?.tertiary_color ?? '',
        }))

        if (data.edit_options) {
          const parsedOptions = JSON.parse(data.edit_options).map(
            (item: any) => {
              if (item.f_options) {
                try {
                  item.f_options = JSON.parse(item.f_options)
                } catch (e) {
                  console.warn(e)
                }
              }
              return item
            },
          )

          setNoteItems(parsedOptions)
        }

        if (data.logo_url) {
          setImagePreview(data.logo_url)
        }

        if (data.s3_info) {
          setIsInternal(false)
          setFormValue((prevFormValue: any) => ({
            ...prevFormValue,
            s3_endpoint: data.s3_info.endpoint,
            s3_access_key_id: data.s3_info.access_key_id,
            s3_secret_access_key: data.s3_info.secret_access_key,
          }))
        }
        if (data.user_orgs.length > 0) {
          setAccounts(data.user_orgs)
        }
      } catch (error) {
        console.error('Error fetching user info:', error)
      }
    }
  }

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target

    let errorText = ''

    switch (name) {
      case 'name':
        if (!value.trim()) {
          errorText = 'Value Empty'
        }
      case 'login_url':
        if (!value.trim()) {
          errorText = 'Value Empty'
        }
        break
      default:
        break
    }

    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: {
        ...prevErrors[name],
        errorText: errorText,
        isBlur: true,
      },
    }))
  }
  const handleChange = (e: React.FocusEvent<HTMLInputElement>) => {
    let { name, value } = e.target
    let newValue: FieldValues
    newValue = {
      ...formValue,
      [name]: value,
    }
    setFormValue(newValue)

    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: {
        ...prevErrors[name],
        errorText: validation(name, value),
        isBlur: true,
      },
    }))
  }
  const validation = (name: string, value: string) => {
    let newError = ''
    switch (name) {
      case 'name':
        if (!value) {
          return '契約事業者IDを入力してください。'
        }
      case 'login_url':
        if (!value) {
          return 'ログインURLを入力してください。'
        }
    }
    return ''
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const openCompletedModal = () => {
    setIsCompletedModalOpen(true)
  }

  const closeCompletedModal = () => {
    setIsCompletedModalOpen(false)
  }

  const handleCancel = () => {
    router.push(`/${login_url}/business-settings/`)
  }

  const handleUpdate = async () => {
    const formData = new FormData()

    formData.append('id', formValue.id)
    formData.append('name', formValue.name)
    formData.append('login_url', formValue.login_url)
    formData.append('show_items', '1')
    formData.append('primary_color', formValue.primary_color)
    formData.append('secondary_color', formValue.secondary_color)
    formData.append('tertiary_color', formValue.tertiary_color)
    formData.append('admin_email', formValue.admin_email)
    formData.append('admin_name', formValue.admin_name)

    if (formValue.logo_file) {
      formData.append('logo_file', formValue.logo_file)
    }
    
    if (noteItems.length > 0) {
      noteItems.forEach((item, index) => {
        formData.append(`edit_options[${index}][f_name]`, item.f_name)
        formData.append(`edit_options[${index}][f_type]`, item.f_type)

        if (Array.isArray(item.f_options) && item.f_options.length > 0) {
          item.f_options.forEach((opt, optIndex) => {
            formData.append(
              `edit_options[${index}][f_options][${optIndex}]`,
              opt,
            )
          })
        } else {
          formData.append(`edit_options[${index}][f_options][]`, '')
        }
      })
    }

    if (accounts.length > 0) {
      accounts.forEach((org, index) => {
        formData.append(`user_orgs[${index}][email]`, org.email)
        formData.append(`user_orgs[${index}][password]`, org.password)
        formData.append(
          `user_orgs[${index}][password_confirmation]`,
          org.password,
        )
        formData.append(`user_orgs[${index}][role]`, org.role)
      })
    }

    if (!isInternal) {
      formData.append('s3[bucket_name]', 'bucket-name')
      formData.append('s3[region]', 'us-east-1')
      formData.append('s3[access_key_id]', formValue.s3_access_key_id)
      formData.append('s3[secret_access_key]', formValue.s3_secret_access_key)
      formData.append('s3[endpoint]', formValue.s3_endpoint)
    }

    try {
      const response = await axiosInstance.post(
        `/cms/1.0/admins/organization/update`,
        formData,
      )
      if (response) {
        Cookies.set('login_url', formValue.login_url, { expires: 7 })
        router.push(`/${formValue.login_url}/business-settings`)
      }

      closeModal()
      openCompletedModal()
    } catch (error) {
      console.error(error)
    }
  }

  const handleFileChangePreview = (e: any) => {
    const file = e.target.files[0]
    if (file) {
      setFormValue({
        ...formValue,
        logo_file: file,
      })
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleChangeAccount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormDataAccount((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmitAccount = () => {
    if (formDataAccount.password !== formDataAccount.confirmPassword) {
      alert('パスワードが一致しません')
      return
    }

    const newAccount = {
      id: accounts.length + 1,
      email: formDataAccount.email,
      password: formDataAccount.password,
      password_confirmation: formDataAccount.confirmPassword,
      role: formDataAccount.role,
    }

    setAccounts((prev) => [...prev, newAccount])
    setModalAccount({ open: false })

    // Reset form
    setFormDataAccount({
      id: 0,
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
    })
  }

  const handleEditAccount = () => {
    setAccounts((prevAccounts: any) =>
      prevAccounts.map((account: any) =>
        account.id === formDataAccount.id
          ? { ...account, ...formDataAccount }
          : account,
      ),
    )
    setModalAccount({ open: false })
  }

  const handleDeleteAccount = (id: number) => {
    setAccounts((prev) => prev.filter((account) => account.id !== id))
  }

  const handleCloseFormAccount = () => {
    setModalAccount({ open: false })
    setFormDataAccount({
      id: 0,
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
    })
  }

  const handleAddNoteItem = () => {
    setNoteItems([...noteItems, { f_name: '', f_type: 'text', f_options: [] }])
  }

  const handleDeleteNoteItem = (index: number) => {
    if (noteItems.length === 1) {
      setNoteItems([{ f_name: '', f_type: 'text', f_options: [] }])
      return
    }
    setNoteItems(noteItems.filter((_, i) => i !== index))
  }

  const handleItemChange = (index: number, data: Partial<NoteItemData>) => {
    const updatedItems = [...noteItems]
    updatedItems[index] = { ...updatedItems[index], ...data }
    setNoteItems(updatedItems)
  }

  return (
    <>
      {formValue.name && (
        <CardComponent>
          <PageTitle>事業編集</PageTitle>
          <FormContainer>
            <form>
              <FromCreateOrganization>
                <ContainerInput>
                  <Label>事業名</Label>
                  <div className="flex w-full flex-col">
                    <Input
                      className="input input-bordered w-full"
                      type="text"
                      name="name"
                      value={formValue.name || ''}
                      onChange={handleChange}
                      maxLength={255}
                      onBlur={handleBlur}
                      hasError={!!validationErrors.name.errorText}
                      placeholder="事業名"
                    />
                    {validationErrors.name.errorText && (
                      <ErrorText>{validationErrors.name.errorText}</ErrorText>
                    )}
                  </div>
                </ContainerInput>

                <ContainerInput>
                  <Label>URL</Label>
                  <div className="flex w-full flex-col">
                    <Input
                      className="input input-bordered w-full"
                      type="text"
                      name="login_url"
                      value={formValue.login_url || ''}
                      onChange={handleChange}
                      maxLength={255}
                      onBlur={handleBlur}
                      hasError={!!validationErrors.login_url.errorText}
                      placeholder="ログインURL"
                    />
                    {validationErrors.login_url.errorText && (
                      <ErrorText>
                        {validationErrors.login_url.errorText}
                      </ErrorText>
                    )}
                  </div>
                </ContainerInput>

                <ContainerInput>
                  <Label>
                    <span> ロゴ</span> <br />
                    <span className="text-[12px] font-[300] text-[#999999]">
                      APP・WEB ののロゴ画像
                      <br />
                      (ログイン後)
                    </span>
                  </Label>
                  <ContainerImageWrapper>
                    {imagePreview && (
                      <ImageWrapper>
                        <PreviewImage src={imagePreview} alt="Image Preview" />
                        <DeleteButtonImage
                          onClick={() => {
                            setImagePreview(null)
                          }}
                        >
                          削除
                        </DeleteButtonImage>
                      </ImageWrapper>
                    )}
                    <UploadContainer>
                      <Title>画像のアップロード条件</Title>
                      <ConditionList>
                        <ConditionItem>
                          ・ファイル形式：JPG または PNG
                        </ConditionItem>
                        <ConditionItem>
                          ・ファイルサイズ：5MB 以下
                        </ConditionItem>
                        <ConditionItem>
                          ・画像サイズ：380 × 290 ピクセル
                        </ConditionItem>
                      </ConditionList>

                      <button
                        className="btn mt-2 w-[216px]"
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                      >
                        アップロード
                      </button>

                      <HiddenInput
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChangePreview}
                      />
                    </UploadContainer>
                  </ContainerImageWrapper>
                </ContainerInput>

                <ContainerInput>
                  <Label>カラーコード</Label>
                  <button
                    onClick={() => {
                      setIsModalOpenCreateColor(true)
                    }}
                    className="btn mt-2 w-[240px]"
                    type="button"
                  >
                    <Image
                      src="/image/icons/ic-color.png"
                      alt="Delete Icon"
                      width={20}
                      height={20}
                    />
                    テーマを設定する
                  </button>
                </ContainerInput>
                <hr />

                <ContainerInput>
                  <Label>メモ項目</Label>
                  <div className="w-full rounded-[5px] border border-[#DADADD] px-[20px] py-[20px]">
                    <div className="flex w-full flex-col gap-[20px]">
                      <div className="flex w-full flex-col gap-[50px] rounded-[10px] border border-[#DADADD] bg-[#FAFAFC] px-[20px] py-[20px]">
                        {noteItems.map((item, index) => (
                          <NoteItem
                            key={index}
                            index={index}
                            itemName={item.f_name}
                            isPullDownNote={item.f_type}
                            listNote={item.f_options}
                            onChange={handleItemChange}
                            onDelete={() => handleDeleteNoteItem(index)}
                          />
                        ))}
                      </div>
                      <button
                        onClick={handleAddNoteItem}
                        className="btn mt-2 w-[240px]"
                        type="button"
                      >
                        項目を追加 ＋
                      </button>
                    </div>
                  </div>
                </ContainerInput>
                <hr />

                <ContainerInput>
                  <Label>S3</Label>
                  <div className="flex w-full flex-col overflow-hidden rounded-[10px] border border-[#DADADD]">
                    <div className="flex items-center justify-start gap-[20px] border bg-[#FAFAFC] p-[15px]">
                      <Checkbox
                        onChange={() => setIsInternal(true)}
                        checked={isInternal}
                        label="内部"
                      />
                      <Checkbox
                        onChange={() => setIsInternal(false)}
                        checked={!isInternal}
                        label="外部"
                      />
                    </div>
                    {!isInternal && (
                      <div className="mt-[15px] p-[15px]">
                        <BoxInput>
                          <label
                            htmlFor=""
                            className="label w-[200px] font-[600]"
                          >
                            エンドポイント
                          </label>
                          <Input
                            className="input input-bordered w-full !bg-[#FFFFFF]"
                            type="text"
                            name="s3_endpoint"
                            value={formValue.s3_endpoint || ''}
                            onChange={handleChange}
                            placeholder="エンドポイント"
                            hasError={false}
                          />
                        </BoxInput>
                        <BoxInput>
                          <label
                            htmlFor=""
                            className="label w-[200px] font-[600]"
                          >
                            アクセスキー
                          </label>
                          <Input
                            className="input input-bordered w-full !bg-[#FFFFFF]"
                            type="text"
                            placeholder="アクセスキー"
                            name="s3_access_key_id"
                            value={formValue.s3_access_key_id || ''}
                            onChange={handleChange}
                            hasError={false}
                          />
                        </BoxInput>
                        <BoxInput>
                          <label
                            htmlFor=""
                            className="label w-[200px] font-[600]"
                          >
                            アクセスキー
                          </label>
                          <Input
                            className="input input-bordered w-full !bg-[#FFFFFF]"
                            type="text"
                            placeholder="アクセスキー"
                            name="s3_secret_access_key"
                            value={formValue.s3_secret_access_key || ''}
                            onChange={handleChange}
                            hasError={false}
                          />
                        </BoxInput>
                      </div>
                    )}
                  </div>
                </ContainerInput>

                <ContainerInput>
                  <Label>管理者アカウント</Label>
                  <OuterContainer>
                    <div className="flex items-center justify-start gap-[20px] border bg-[#FAFAFC] p-[15px]">
                      <Checkbox
                        onChange={() => {}}
                        checked={true}
                        label="Org CMSの「システム管理者」権限を作成"
                      />
                    </div>
                    <Wrapper>
                      <SectionTitle>管理者アカウント</SectionTitle>
                      {accounts.length > 0 &&
                        accounts.map((account: UserOrg, index: number) => (
                          <AccountRow key={index}>
                            <AccountInfo>
                              <AccountNumber>{index + 1}</AccountNumber>
                              <InfoBox>
                                <Role>{account.role}</Role>
                                <Email>{account.email}</Email>
                              </InfoBox>
                            </AccountInfo>
                            <ActionGroup>
                              <Button
                                w="w-[60px]"
                                h="h-[40px]"
                                color="text-[#1FB2A6]"
                                borderColor="border-[#1FB2A6]"
                                onClick={() => {
                                  setFormDataAccount({
                                    id: account.id,
                                    email: account.email,
                                    role: account.role,
                                    password: account.password,
                                    confirmPassword: account.password,
                                  })
                                  setModalAccount({
                                    open: true,
                                    type: 'edit',
                                    data: account,
                                  })
                                }}
                              >
                                戻る
                              </Button>

                              <Button
                                w="w-[60px]"
                                h="h-[40px]"
                                color="text-[#D926A9]"
                                borderColor="border-[#D926A9]"
                                onClick={() => handleDeleteAccount(account.id)}
                              >
                                削除
                              </Button>
                            </ActionGroup>
                          </AccountRow>
                        ))}

                      <button
                        onClick={() => {
                          setModalAccount({ open: true, type: 'add' })
                        }}
                        className="btn mt-2 w-[240px]"
                        type="button"
                      >
                        管理者アカウントを追加 ＋
                      </button>
                    </Wrapper>
                  </OuterContainer>
                </ContainerInput>
              </FromCreateOrganization>
            </form>
          </FormContainer>

          <div className="flex items-center justify-center gap-[20px]">
            <Button
              w="w-[250px]"
              h="h-[50px]"
              color="text-[#A6ADBA]"
              borderColor="border-[lightgray]"
              onClick={handleCancel}
            >
              戻る
            </Button>

            <Button
              w="w-[250px]"
              h="h-[50px]"
              color="text-[#FFFFFF]"
              borderColor="border-[#4B79F7]"
              bg="bg-[#4B79F7]"
              onClick={handleUpdate}
            >
              保存する
            </Button>
          </div>
        </CardComponent>
      )}
      <CompletedPopup
        isOpen={isCompletedModalOpen}
        onClose={closeCompletedModal}
        title="発行しました"
      />

      <CreateColor
        setValue={setFormValue}
        value={formValue}
        isOpen={isModalOpenCreateColor}
        onClose={() => setIsModalOpenCreateColor(false)}
      />

      {modalAccount.type === 'add' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-[480px] rounded bg-white p-6 shadow">
            <div className=" flex items-center justify-end text-xl">
              <span onClick={() => handleCloseFormAccount()}>&times;</span>
            </div>
            <h3 className="mb-4 text-lg font-bold">新規管理者アカウント登録</h3>
            <div className="border-b-2 border-[#DADADD] pb-[20px]">
              <ContainerInput>
                <Label>メールアドレス</Label>
                <Input
                  className="input input-bordered w-full"
                  type="text"
                  name="email"
                  value={formDataAccount.email}
                  onChange={handleChangeAccount}
                  maxLength={255}
                  placeholder="メールアドレス"
                  hasError={false}
                />
              </ContainerInput>
              <ContainerInput>
                <Label>パスワード</Label>
                <Input
                  className="input input-bordered w-full"
                  type="password"
                  name="password"
                  value={formDataAccount.password}
                  onChange={handleChangeAccount}
                  maxLength={255}
                  hasError={false}
                  placeholder="パスワード"
                />
              </ContainerInput>
              <ContainerInput>
                <Label>パスワード確認</Label>
                <Input
                  className="input input-bordered w-full"
                  type="password"
                  name="confirmPassword"
                  value={formDataAccount.confirmPassword}
                  onChange={handleChangeAccount}
                  maxLength={255}
                  placeholder="パスワード確認"
                  hasError={false}
                />
              </ContainerInput>

              <Checkbox
                onChange={() => {}}
                checked={true}
                label="パスワードを表示する"
              />
            </div>
            <ContainerInput className="mt-[30px]">
              <Label>権限</Label>
              <div className="flex flex-col">
                <Checkbox
                  onChange={() =>
                    setFormDataAccount((prev) => ({
                      ...prev,
                      role: USER_ROLE.SYSTEM_ADMINISTRATOR,
                    }))
                  }
                  checked={
                    formDataAccount.role === USER_ROLE.SYSTEM_ADMINISTRATOR
                  }
                  label="システム管理者"
                />
                <Checkbox
                  onChange={() =>
                    setFormDataAccount((prev) => ({
                      ...prev,
                      role: USER_ROLE.SECRETARIAT,
                    }))
                  }
                  checked={formDataAccount.role === USER_ROLE.SECRETARIAT}
                  label="事務局"
                />
              </div>
            </ContainerInput>
            <div className="mt-[30px] flex flex-col items-center gap-5">
              <CommonPrimaryButton
                type="button"
                onClick={handleSubmitAccount}
                style={{
                  backgroundColor: '#E6791A',
                  border: 'none',
                  color: '#FFFFFF',
                }}
              >
                追加する
              </CommonPrimaryButton>
              <CommonOutlineButton
                type="button"
                onClick={() => handleCloseFormAccount()}
              >
                戻る
              </CommonOutlineButton>
            </div>
          </div>
        </div>
      )}

      {modalAccount.type === 'edit' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-[480px] rounded bg-white p-6 shadow">
            <div className=" flex items-center justify-end text-xl">
              <span onClick={() => handleCloseFormAccount()}>&times;</span>
            </div>
            <h3 className="mb-4 text-lg font-bold">管理者アカウント編集</h3>
            <div className="border-b-2 border-[#DADADD] pb-[20px]">
              <ContainerInput>
                <Label>メールアドレス</Label>
                <Input
                  className="input input-bordered w-full"
                  type="text"
                  name="email"
                  value={formDataAccount.email}
                  onChange={handleChangeAccount}
                  maxLength={255}
                  placeholder="メールアドレス"
                  hasError={false}
                />
              </ContainerInput>
              <ContainerInput>
                <Label>パスワード</Label>
                <Input
                  className="input input-bordered w-full"
                  type="password"
                  name="password"
                  value={formDataAccount.password}
                  onChange={handleChangeAccount}
                  maxLength={255}
                  onBlur={handleBlur}
                  hasError={false}
                  placeholder="パスワード"
                />
              </ContainerInput>
              <ContainerInput>
                <Label>パスワード確認</Label>
                <Input
                  className="input input-bordered w-full"
                  type="password"
                  name="confirmPassword"
                  value={formDataAccount.confirmPassword}
                  onChange={handleChangeAccount}
                  maxLength={255}
                  placeholder="パスワード確認"
                  hasError={false}
                />
              </ContainerInput>

              <Checkbox
                onChange={() => {}}
                checked={true}
                label="パスワードを表示する"
              />
            </div>
            <ContainerInput className="mt-[30px]">
              <Label>権限</Label>
              <div className="flex flex-col">
                <Checkbox
                  onChange={() =>
                    setFormDataAccount((prev) => ({
                      ...prev,
                      role: USER_ROLE.SYSTEM_ADMINISTRATOR,
                    }))
                  }
                  checked={
                    formDataAccount.role === USER_ROLE.SYSTEM_ADMINISTRATOR
                  }
                  label="システム管理者"
                />
                <Checkbox
                  onChange={() =>
                    setFormDataAccount((prev) => ({
                      ...prev,
                      role: USER_ROLE.SECRETARIAT,
                    }))
                  }
                  checked={formDataAccount.role === USER_ROLE.SECRETARIAT}
                  label="事務局"
                />
              </div>
            </ContainerInput>
            <div className="mt-[30px] flex flex-col items-center gap-5">
              <CommonPrimaryButton
                type="button"
                onClick={handleEditAccount}
                style={{
                  backgroundColor: '#E6791A',
                  border: 'none',
                  color: '#FFFFFF',
                }}
              >
                追加する
              </CommonPrimaryButton>
              <CommonOutlineButton
                type="button"
                onClick={() => handleCloseFormAccount()}
              >
                戻る
              </CommonOutlineButton>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default EditOrganization
