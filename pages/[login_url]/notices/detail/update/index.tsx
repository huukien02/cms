import { useEffect, useState } from 'react'
import Styled from 'styled-components'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import CommonPrimaryButton from '@/components/common/Button/PrimaryButton'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ja from 'date-fns/locale/ja'
import CardComponent from '@/components/common/Card'
import { z } from 'zod'
import PopupBackgroundComponent from '@/components/common/PopupBackground'
import PopupContainerSmallComponent from '@/components/common/PopupContainerSmall'
import CloseButton from '@/components/common/Button/CloseButton'
import CommonOutlineButton from '@/components/common/Button/OutlineButton'
import CommonPopupH2 from '@/components/common/CommonPopupH2'
import { useAppContext } from '@/components/state/AppContext'
import axiosInstance from '@/libs/axiosInstance'
import useCheckLoginUrl from '@/components/hooks/useCheckLoginUrl'

const UpdateUserInfo = Styled.div`
  display: flex;
  flex-direction: column;
`

const Input = Styled.input<{ hasError: boolean }>`
  width: 100%;
  height: 40px;
  border-radius: 5px;
  border: 1px solid #DADADD;
  margin-bottom: 18px;
  padding-left: 10px;
  ${(props) =>
    props.hasError &&
    `
    color: red;
    border-color: red;
  `}
`

const Textarea = Styled.textarea<{ hasError: boolean }>`
  ${(props) =>
    props.hasError &&
    `
    color: red;
    border-color: red;
  `}
`

const FormContainer = Styled.div`
`

const Label = Styled.label`
  color: #353538;
  font-size: 14px;
`

const NameTd = Styled.td`
  display: flex;
  gap: 11px;
`

const ButtonContainer = Styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
`

const Table = Styled.table`
  text-align: left;
  margin-bottom: 20px;
`

const Tr = Styled.tr`
  vertical-align: baseline;
  height: 58px;
`

const ErrorSpan = Styled.span`
  display: block;
  margin-top: -10px;
  margin-bottom: 10px;
`

const validationSchema = z.object({})

type FieldErrors = {
  title?: string
  content?: string
}

const UpdateNoticesPage = () => {
  const loginUrl = useCheckLoginUrl()

  const router = useRouter()
  const { id } = router.query
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    from_date: null,
    to_date: null,
  })
  const [isPopupNoticeUpdateConfirm, setIsPopupNoticeUpdateConfirm] =
    useState(false)
  const { showUpdateNoticeSuccessPopup, setShowUpdateNoticeSuccessPopup } =
    useAppContext()
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [validationErrors, setValidationErrors] = useState<FieldErrors>({
    title: '',
    content: '',
  })
  const newErrors: FieldErrors = { ...validationErrors }
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  const [isDataFetched, setIsDataFetched] = useState(false)

  useEffect(() => {
    if (id && !isDataFetched) {
      fetchNoticesData()
    }
    const { from_date, to_date, title, content } = formData
    setIsButtonDisabled(
      !title ||
        !content ||
        (from_date !== null &&
          to_date !== null &&
          new Date(from_date) > new Date(to_date)),
    )
  }, [id, formData])

  const fetchNoticesData = async () => {
    try {
      const response = await axiosInstance.get(`/cms/1.0/notices/${id}`)

      if (response.status === 200) {
        const userData = response.data.data
        setFormData({
          title: userData.title,
          content: userData.content,
          from_date: userData.from_date,
          to_date: userData.to_date,
        })
        setIsDataFetched(true)
      } else {
        console.error('Error fetching user info:', response)
      }
    } catch (error) {
      console.error('Error fetching user info:', error)
    }
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target

    if (name === 'title') {
      setFormData({
        ...formData,
        title: value,
      })
    } else if (name === 'content') {
      setFormData({
        ...formData,
        content: value,
      })

      if (httpLinksHaveError(value)) {
        setIsButtonDisabled(true)
      } else {
        setIsButtonDisabled(false)
      }
    }

    if (name === 'title' && value.length >= 1 && formData.content.length >= 1) {
      if (!httpLinksHaveError(value)) {
        setIsButtonDisabled(false)
      }
    } else if (
      name === 'content' &&
      value.length >= 1 &&
      formData.title.length >= 1
    ) {
      if (!httpLinksHaveError(value)) {
        setIsButtonDisabled(false)
      }
    } else {
      setIsButtonDisabled(true)
    }

    try {
      validationSchema.pick({ [name]: true }).parse({ [name]: value })
      setValidationErrors({ ...validationErrors, [name]: '' })
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors[0].message
        setValidationErrors({ ...validationErrors, [name]: errorMessage })
      }
    }
  }

  const handleDateChange = (name: string, date: any) => {
    setFormData({
      ...formData,
      [name]: date,
    })
  }

  const handleSave = async () => {
    try {
      validationSchema.parse(formData)
      setValidationErrors({})

      const formattedFromDateForAPI = formData.from_date
        ? formatDateForAPI(formData.from_date)
        : null
      const formattedToDateForAPI = formData.to_date
        ? formatDateForAPI(formData.to_date)
        : null

      const response = await axiosInstance.put(`/cms/1.0/notices/${id}`, {
        ...formData,
        from_date: formattedFromDateForAPI,
        to_date: formattedToDateForAPI,
      })
      if (response.status === 200) {
        closePopupNoticeUpdateConfirm()
        router.push(`${loginUrl}/notices/detail?id=${id}`)
        setShowUpdateNoticeSuccessPopup(true)
      } else {
        console.error('Error:', response)
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: FieldErrors = {}
        error.errors.forEach((err) => {
          fieldErrors[err.path[0] as keyof FieldErrors] = err.message
        })
        setValidationErrors(fieldErrors)
      }
      return
    }
  }

  const handleCancel = () => {
    router.push(`${loginUrl}/notices`)
  }

  function formatDateForAPI(inputDate: any) {
    if (inputDate === null) {
      return null
    }

    const date = new Date(inputDate)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }

  const openPopupNoticeUpdateConfirm = () => {
    setIsPopupNoticeUpdateConfirm(true)
  }

  const closePopupNoticeUpdateConfirm = () => {
    setIsPopupNoticeUpdateConfirm(false)
  }

  const handleClearDates = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault()
    setFormData({
      ...formData,
      from_date: null,
      to_date: null,
    })
    setStartDate(null)
    setEndDate(null)
  }

  const onInputBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    const httpLinks = value.match(/http:\/\/\S+/gi)

    if (name === 'title') {
      if (!value) {
        newErrors.title = 'タイトルを入力してください。'
      } else {
        newErrors.title = ''
      }
    } else if (name === 'content') {
      if (!value) {
        newErrors.content = '内容入力してください。'
      } else {
        newErrors.content = ''
      }

      if (httpLinks) {
        const invalidLinks = httpLinks.filter(
          (link: any) => !link.startsWith('https://'),
        )

        if (invalidLinks.length > 0) {
          newErrors.content = 'リンクはHTTPSプロトコルで始まる必要があります。'
        } else {
          newErrors.content = ''
        }
      } else {
        newErrors.content = ''
      }
    }

    setValidationErrors(newErrors)
  }

  function httpLinksHaveError(text: string) {
    const httpLinks = text.match(/http:\/\/\S+/gi)

    if (httpLinks) {
      const invalidLinks = httpLinks.filter(
        (link: string) => !link.startsWith('https://'),
      )

      return invalidLinks.length > 0
    }

    return false
  }

  return (
    <>
      <CardComponent>
        <FormContainer>
          <h1>お知らせ</h1>
          <form>
            <UpdateUserInfo>
              <Table>
                <tbody>
                  <Tr>
                    <th>タイトル</th>
                    <td>
                      <Label>
                        <Input
                          className="input input-bordered w-full"
                          type="text"
                          name="title"
                          value={formData.title || ''}
                          onChange={handleChange}
                          maxLength={255}
                          onBlur={onInputBlur}
                          hasError={!!validationErrors.title}
                        />
                      </Label>
                    </td>
                  </Tr>
                  <Tr>
                    <th>内容</th>
                    <td>
                      <Textarea
                        style={{ marginBottom: '18px', display: 'block' }}
                        className="textarea textarea-bordered h-40 w-full"
                        name="content"
                        value={formData.content || ''}
                        onChange={handleChange}
                        // maxLength={255}
                        onBlur={onInputBlur}
                        hasError={!!validationErrors.content}
                      />
                    </td>
                  </Tr>
                  <Tr style={{ height: '48px' }}>
                    <th>公開期間</th>
                    <NameTd>
                      <Label>
                        <DatePicker
                          placeholderText="公開開始日"
                          className="date-input input input-bordered h-10 w-full max-w-xs"
                          selected={
                            formData.from_date
                              ? new Date(formData.from_date)
                              : null
                          }
                          onChange={(date: any) =>
                            handleDateChange('from_date', date)
                          }
                          locale={ja}
                          dateFormatCalendar={'yyyy年M月'}
                          showTimeSelect
                          timeFormat="HH:mm"
                          dateFormat="yyyy/MM/dd HH:mm"
                        />
                      </Label>
                      <Label>
                        <DatePicker
                          placeholderText="公開終了日"
                          className="date-input input input-bordered h-10 w-full max-w-xs"
                          selected={
                            formData.to_date ? new Date(formData.to_date) : null
                          }
                          onChange={(date: any) =>
                            handleDateChange('to_date', date)
                          }
                          locale={ja}
                          dateFormatCalendar={'yyyy年M月'}
                          showTimeSelect
                          timeFormat="HH:mm"
                          dateFormat="yyyy/MM/dd HH:mm"
                        />
                      </Label>
                      <button
                        className="btn btn-link w-20"
                        onClick={handleClearDates}
                      >
                        クリア
                      </button>
                    </NameTd>
                  </Tr>
                  <tr>
                    <th></th>
                    <td>※未入力の場合は常に公開状態</td>
                  </tr>
                </tbody>
              </Table>
              {validationErrors.title && (
                <ErrorSpan style={{ color: '#f74a4a' }}>
                  {validationErrors.title}
                </ErrorSpan>
              )}
              {validationErrors.content && (
                <ErrorSpan style={{ color: '#f74a4a' }}>
                  {validationErrors.content}
                </ErrorSpan>
              )}
              <ButtonContainer>
                <CommonPrimaryButton
                  type="button"
                  onClick={openPopupNoticeUpdateConfirm}
                  disabled={isButtonDisabled}
                >
                  保存する
                </CommonPrimaryButton>
                <CommonOutlineButton
                  type="button"
                  style={{ marginTop: '15px' }}
                  onClick={handleCancel}
                >
                  キャンセル
                </CommonOutlineButton>
              </ButtonContainer>
            </UpdateUserInfo>
          </form>
        </FormContainer>
      </CardComponent>

      {isPopupNoticeUpdateConfirm && (
        <>
          <PopupBackgroundComponent onClick={closePopupNoticeUpdateConfirm}>
            <></>
          </PopupBackgroundComponent>
          <PopupContainerSmallComponent>
            <CloseButton onClick={closePopupNoticeUpdateConfirm}></CloseButton>
            <CommonPopupH2>お知らせを保存しますか？</CommonPopupH2>
            <CommonPrimaryButton onClick={handleSave}>
              保存する
            </CommonPrimaryButton>
            <CommonOutlineButton
              style={{ marginTop: '15px' }}
              onClick={closePopupNoticeUpdateConfirm}
            >
              キャンセル
            </CommonOutlineButton>
          </PopupContainerSmallComponent>
        </>
      )}
    </>
  )
}

export default UpdateNoticesPage
