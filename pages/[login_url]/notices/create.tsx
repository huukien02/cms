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
import CommonOutlineButton from '@/components/common/Button/OutlineButton'
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
  margin-top: 50px;
  margin-bottom: 30px;
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

const validationSchema = z.object({
  // title: z
  //   .string()
  //   .nonempty('タイトル必須です')
  //   .min(4, 'タイトルは4文字以上で入力してください'),
  // content: z
  //   .string()
  //   .nonempty('内容は必須です')
  //   .min(6, '内容は6文字以上で入力してください'),
})

type FieldErrors = {
  title?: string
  content?: string
}

const CreateNoticesPage = () => {
  const router = useRouter()
  const loginUrl = useCheckLoginUrl()

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    from_date: null,
    to_date: null,
  })
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [validationErrors, setValidationErrors] = useState<FieldErrors>({
    title: '',
    content: '',
  })
  const newErrors: FieldErrors = { ...validationErrors }
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)

  useEffect(() => {
    const { from_date, to_date, title, content } = formData
    setIsButtonDisabled(
      !title ||
        !content ||
        (from_date !== null &&
          to_date !== null &&
          new Date(from_date) > new Date(to_date))
    )
  }, [formData])

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

      const response = await axiosInstance.post(`/cms/1.0/notices`, {
        ...formData,
        from_date: formattedFromDateForAPI,
        to_date: formattedToDateForAPI,
      })

      if (response.status === 200) {
        setUpdateSuccess(true)
        router.push(`${loginUrl}/notices`)
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

  const handleClearDates = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
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
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
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
          (link: any) => !link.startsWith('https://')
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
        (link: string) => !link.startsWith('https://')
      )

      return invalidLinks.length > 0
    }

    return false
  }

  return (
    <>
      <CardComponent>
        <h1>お知らせ</h1>
        <FormContainer>
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
                    <th style={{ verticalAlign: 'middle' }}>内容</th>
                    <td>
                      <Textarea
                        style={{ marginBottom: '18px', display: 'block' }}
                        className="textarea textarea-bordered w-full h-40"
                        name="content"
                        value={formData.content || ''}
                        onChange={handleChange}
                        // maxLength={255}
                        onBlur={onInputBlur}
                        hasError={!!validationErrors.content}
                      />
                    </td>
                  </Tr>
                  <Tr>
                    <th>公開期間</th>
                    <NameTd>
                      <Label>
                        <DatePicker
                          name="from_date"
                          placeholderText="公開開始日"
                          className="date-input input input-bordered w-full max-w-xs h-10"
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
                          name="to_date"
                          placeholderText="公開終了日"
                          className="date-input input input-bordered w-full max-w-xs h-10"
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
                  onClick={handleSave}
                  disabled={isButtonDisabled}
                >
                  保存する
                </CommonPrimaryButton>
                <CommonOutlineButton
                  style={{ marginTop: '15px' }}
                  type="button"
                  onClick={handleCancel}
                >
                  戻る
                </CommonOutlineButton>
              </ButtonContainer>
            </UpdateUserInfo>
          </form>
        </FormContainer>
      </CardComponent>
    </>
  )
}

export default CreateNoticesPage
