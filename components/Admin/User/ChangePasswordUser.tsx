import React, { useState } from 'react'
import Styled from 'styled-components'
import Button from '@/components/Button'
import Checkbox from '@/components/common/Checkbox'
import { axiosInstanceSystemAdmin } from '@/libs'

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

interface CreateUserModalProps {
  userId?: number
  open: boolean
  onClose: () => void
}

interface FormValue {
  password: string
  password_confirmation: string
}

interface FieldError {
  errorText: string
  isBlur?: boolean
}

interface FieldErrors {
  [key: string]: FieldError
}

export const ChangePasswordUser: React.FC<CreateUserModalProps> = ({
  userId,
  open,
  onClose,
}) => {
  const [formValue, setFormValue] = useState<FormValue>({
    password: '',
    password_confirmation: '',
  })

  const [showPassword, setShowPassword] = useState<boolean>(false)

  const [validationErrors, setValidationErrors] = useState<FieldErrors>({
    password: {
      errorText: '',
      isBlur: false,
    },
    password_confirmation: {
      errorText: '',
      isBlur: false,
    },
  })

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    let errorText = ''

    switch (name) {
      case 'password':
        if (!value.trim()) {
          errorText = 'パスワードが空です'
        } else if (value.length < 8) {
          errorText = 'パスワードは8文字以上である必要があります'
        }
        break
      case 'password_confirmation':
        if (!value.trim()) {
          errorText = 'パスワードの確認 空です'
        }
        if (!value.trim()) {
          errorText = 'パスワードの確認 空です'
        } else if (value !== formValue.password) {
          errorText = 'パスワードが一致しません'
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

  const isEnableButton = Object.values(validationErrors).some((field) => {
    const isErrorTextNotEmpty = field.errorText !== ''
    const isBlurFalse = field.isBlur === false
    return isErrorTextNotEmpty || isBlurFalse
  })

  const handleChange = (e: React.FocusEvent<HTMLInputElement>) => {
    let { name, value } = e.target
    let newValue: FormValue
    newValue = {
      ...formValue,
      [name]: value,
    }
    setFormValue(newValue)
  }

  const handleChangePassword = async () => {
    const formData = {
      password: formValue.password,
    }
    try {
      const response = await axiosInstanceSystemAdmin.put(
        `/api/system_admin/1.0/users/${userId}/update`,
        formData,
      )
      if (response) {
        console.log(response)
        onClose()
      }
    } catch (error) {
      console.error(error)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        {/* Close Button */}
        <button
          className="absolute right-4 top-[-5px] text-[30px] text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Modal Header */}
        <h2 className="mb-4 text-center text-lg font-semibold text-gray-800">
          新規登録
        </h2>

        {/* Modal Body */}
        <form className="space-y-4">
          <div className="flex items-start"></div>

          <div className="flex items-start">
            <label className="label flex w-[180px] text-[12px] font-[600] text-[#6B7280]">
              新しいパスワード
            </label>
            <div className="flex w-full flex-col">
              <Input
                className="input input-bordered w-full !bg-[#FFFFFF]"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="新しいパスワードを入力します"
                onChange={handleChange}
                value={formValue.password}
                onBlur={handleBlur}
                hasError={!!validationErrors.password.errorText}
              />
              {validationErrors.password.errorText && (
                <ErrorText>{validationErrors.password.errorText}</ErrorText>
              )}
            </div>
          </div>

          <div className="flex items-start">
            <label className="label flex w-[180px] text-[12px] font-[600] text-[#6B7280]">
              新しいパスワード
            </label>
            <div className="flex w-full flex-col">
              <Input
                className="input input-bordered w-full !bg-[#FFFFFF]"
                type={showPassword ? 'text' : 'password'}
                name="password_confirmation"
                placeholder="確認用パスワードを入力する"
                onChange={handleChange}
                onBlur={handleBlur}
                hasError={!!validationErrors.password_confirmation.errorText}
                value={formValue.password_confirmation}
              />
              {validationErrors.password_confirmation.errorText && (
                <ErrorText>
                  {validationErrors.password_confirmation.errorText}
                </ErrorText>
              )}
            </div>
          </div>

          <Checkbox
            onChange={() => {
              setShowPassword(!showPassword)
            }}
            checked={showPassword}
            label="パスワードを表示する"
          />

          {/* Modal Footer */}
          <div className="flex flex-col items-center justify-center gap-[20px]">
            <Button
              w="w-[250px]"
              h="h-[50px]"
              color={isEnableButton ? 'text-[#A6ADBA]' : 'text-[white]'}
              borderColor={
                !isEnableButton ? 'text-[#E6791A]' : 'text-[#A6ADBA54]'
              }
              bg={!isEnableButton ? 'bg-[#E6791A]' : 'bg-[#A6ADBA54]'}
              onClick={handleChangePassword}
              disabled={isEnableButton}
            >
              登録する
            </Button>

            <Button
              w="w-[250px]"
              h="h-[50px]"
              color="text-[#A6ADBA]"
              borderColor="border-[##A6ADBA]"
              bg="bg-[#FFFFFF]"
              onClick={onClose}
            >
              キャンセル
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
