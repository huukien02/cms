import axios from 'axios'
import { ChangeEvent, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import Styled from 'styled-components'
import Link from 'next/link'
import apiConfig from '@/apiConfig'
import { z } from 'zod'
import { useAppContext } from '@/components/state/AppContext'
import Checkbox from '@/components/common/Checkbox'
import { axiosInstance } from '@/libs'
import { TOKEN_SYSTEM_USER, USER_TYPE } from '@/common/auth'

type LoginParams = {
  email: string
  password: string
}

type User = {
  email: string
  name: string
  user_type: (typeof USER_TYPE)[keyof typeof USER_TYPE]
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

export default function Login() {
  const [adminId, setAdminId] = useState('')
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [validationErrors, setValidationErrors] = useState<FieldErrors>({})

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
    const loginParams: LoginParams = { email: adminId, password }
    try {
      validationSchema.parse(loginParams)
      setValidationErrors({})

      const { data } = await axiosInstance.post(
        'api/system_admin/1.0/auth/login',
        loginParams,
      )

      if (data) {
        Cookies.set(TOKEN_SYSTEM_USER, data.data.token, { expires: 7 })
        Cookies.set('user_type', data.data.user_type, { expires: 7 })
        router.push('/system-admin/organization')
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
        {/* <Image src="/image/logo/logo@2x.png" alt="" /> */}
        <img
          src="/image/logo/logo@2x.png"
          alt="Logo"
          width="200"
          height="100"
        />
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
      <Button onClick={handleClick}>ログイン</Button>
    </>
  )
}
