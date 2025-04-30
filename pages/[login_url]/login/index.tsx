import { ChangeEvent, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import Styled from 'styled-components'
import { z } from 'zod'
import Checkbox from '@/components/common/Checkbox'
import { axiosInstance } from '@/libs'
import { TOKEN_ORG_USER, USER_TYPE } from '@/common/auth'

type LoginParams = {
  email: string
  password: string
  org_id: string
  org_name: string
}

const H1 = Styled.h1`
  text-align: left;
  font-size: 18px;
  margin-bottom: 16px;
`

const Input = Styled.input`
  width: 100%;
  height: 40px;
  border-radius: 5px;
  border: 1px solid #DADADD;
  margin-bottom: 18px;
  padding-left: 10px;
`

const Button = Styled.button`
  width: 100%;
  height: 40px;
  border-radius: 8px;
  background-color: #A3BCFD;
  border: 0;
  margin-bottom: 20px;
  margin-top: 35px;
  color: #fff;
  &:hover {
    background-color: #4a79f7;
  }
`

const Image = Styled.img`
  width: 200px;
  margin-bottom: 10px;
  display: inline-block;
`

const CheckboxContainer = Styled.div`
  text-align: left;
`

const ErrorSpan = Styled.span`
  display: block;
  margin-top: -10px;
  margin-bottom: 10px;
  color: red;
  text-align: left;
  font-size: 17px;
`

const validationSchema = z.object({
  email: z.string().min(5, 'IDが無効です'),
  password: z.string().min(6, 'パスワードは少なくとも6文字必要です'),
})

type FieldErrors = {
  email?: string
  password?: string
}

export async function getServerSideProps(context: {
  params: { login_url: any }
}) {
  const { login_url } = context.params

  return {
    props: { login_url },
  }
}

export default function Login({ login_url }: { login_url: string }) {
  const router = useRouter()
  const { basePath } = useRouter()
  const [adminId, setAdminId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [validationErrors, setValidationErrors] = useState<FieldErrors>({})
  const [loginId, setLoginId] = useState<{
    id: string
    name: string
  } | null>(null)
  // const { login_url } = router.query

  useEffect(() => {
    if (login_url) {
      const getOrgInfo = async () => {
        try {
          const { data } = await axiosInstance.get(
            `cms/1.0/admins/organization?login_url=${login_url}`,
          )
          if (data) {
            setLoginId({
              id: data.data.id,
              name: data.data.name,
            })
            Cookies.set('login_url', data.data.login_url, { expires: 7 })
          }
        } catch (error) {
          console.error('Error fetching user info:', error)
        }
      }

      getOrgInfo()
    }
  }, [login_url])

  const changeAdminId = (e: ChangeEvent<HTMLInputElement>) => {
    setAdminId(e.target.value)
  }
  const changePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleClick = async () => {
    if (!loginId) {
      return
    }
    const loginParams: LoginParams = {
      email: adminId,
      password,
      org_id: loginId.id,
      org_name: loginId.name,
    }
    try {
      validationSchema.parse(loginParams)
      setValidationErrors({})

      const { data } = await axiosInstance.post(
        'cms/1.0/admins/login',
        loginParams,
      )

      if (data) {
        Cookies.set(TOKEN_ORG_USER, data.data.token, { expires: 7 })
        Cookies.set('user_type', USER_TYPE.ORGANIZATION, { expires: 7 })
        router.push(`/${login_url}/notices`)
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: {
          email?: string
          password?: string
        } = {}
        error.errors.forEach((err) => {
          fieldErrors[err.path[0] as keyof typeof fieldErrors] = err.message
        })
        setValidationErrors(fieldErrors)
      }
    }
  }

  return (
    <>
      <div>
        <Image src={`${basePath}/image/logo/logo2x.png`} alt="" />
      </div>

      <H1>ログイン</H1>
      <div>
        <Input
          type="email"
          placeholder="IDを入力してください"
          onChange={changeAdminId}
        />
        {validationErrors.email && (
          <ErrorSpan>{validationErrors.email}</ErrorSpan>
        )}
      </div>
      <div>
        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder="パスワードを入力してください"
          onChange={changePassword}
        />
        {validationErrors.password && (
          <ErrorSpan>{validationErrors.password}</ErrorSpan>
        )}
      </div>

      <CheckboxContainer>
        <Checkbox
          onChange={toggleShowPassword}
          checked={showPassword}
          label="パスワードを表示する"
        />
      </CheckboxContainer>
      <Button disabled={!loginId?.id} onClick={handleClick}>
        ログイン
      </Button>
    </>
  )
}
