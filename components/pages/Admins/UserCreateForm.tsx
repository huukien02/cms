import React, { ChangeEvent } from 'react'
import Styled from 'styled-components'
import CommonPopupH2 from '@/components/common/CommonPopupH2'
import CommonOutlineButton from '@/components/common/Button/OutlineButton'
import CommonSeccondaryButton from '@/components/common/Button/SecondaryButton'
import PopupContainerSmallComponent from '@/components/common/PopupContainerSmall'
import PopupBackgroundComponent from '@/components/common/PopupBackground'
import Checkbox from '@/components/common/Checkbox'

const Table = Styled.table`
  width: 100%;
  margin-bottom: 15px;
  text-align: left;
`

const Th = Styled.th`
  whitespace-nowrap
`

const Tr = Styled.tr`
  height: 40px;
`

const Input = Styled.input<{ hasError: boolean }>`

  ${(props) =>
    props.hasError &&
    `
    color: red;
    border-color: red;
  `}
`

const CheckboxContainer = Styled.div`
  text-align: left;
  margin-bottom: 20px;
`

const ErrorSpan = Styled.span`
  display: block;
  margin-top: -10px;
  margin-bottom: 10px;
`

type FieldErrors = {
  email?: string
  password?: string
  confirm_password?: string
  request?: string
}

interface UserCreateFormProps {
  showPassword: boolean
  toggleShowPassword: () => void
  changeEmail: (e: React.ChangeEvent<HTMLInputElement>) => void
  changeNewPassword: (e: ChangeEvent<HTMLInputElement>) => void
  changeConfirmPassword: (e: ChangeEvent<HTMLInputElement>) => void
  onInputBlur: (e: React.FocusEvent<HTMLInputElement>) => void
  handleCreateUser: () => void
  validationErrors: FieldErrors
  closePopupCreateAdminUserForm: () => void
  isFormValid: boolean
  newPassword: string
  confirmPassword: string
  isNewPasswordValid: boolean
}

const UserCreateForm: React.FC<UserCreateFormProps> = ({
  showPassword,
  toggleShowPassword,
  changeEmail,
  changeNewPassword,
  changeConfirmPassword,
  onInputBlur,
  handleCreateUser,
  validationErrors,
  closePopupCreateAdminUserForm,
  isFormValid,
  newPassword,
  confirmPassword,
  isNewPasswordValid,
}) => {
  return (
    <>
      <PopupBackgroundComponent onClick={closePopupCreateAdminUserForm}>
        <></>
      </PopupBackgroundComponent>
      <PopupContainerSmallComponent>
        <CommonPopupH2>新規登録</CommonPopupH2>
        <Table>
          <tbody>
            <Tr>
              <Th className="py-2 text-xs text-gray-500">メールアドレス</Th>
              <td>
                <Input
                  className="input input-bordered input-sm w-full max-w-xs"
                  type="email"
                  name="email"
                  placeholder="メールアドレスを入力する"
                  onChange={changeEmail}
                  onBlur={onInputBlur}
                  hasError={!!validationErrors.email}
                  maxLength={50}
                />
              </td>
            </Tr>
            <Tr>
              <Th className="py-2 text-xs text-gray-500">パスワード</Th>
              <td>
                <Input
                  className="input input-bordered input-sm w-full max-w-xs"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="パスワードを入力する"
                  onChange={changeNewPassword}
                  onBlur={onInputBlur}
                  hasError={!!validationErrors.password}
                  maxLength={50}
                  value={newPassword}
                />
              </td>
            </Tr>
            <Tr>
              <Th className="py-2 text-xs text-gray-500">パスワード(確認用)</Th>
              <td>
                <Input
                  className="input input-bordered input-sm w-full max-w-xs"
                  name="confirm_password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="パスワードを入力する"
                  onChange={changeConfirmPassword}
                  onBlur={onInputBlur}
                  hasError={!!validationErrors.confirm_password}
                  maxLength={50}
                  value={confirmPassword}
                />
              </td>
            </Tr>
          </tbody>
        </Table>
        <CheckboxContainer>
          <Checkbox
            onChange={toggleShowPassword}
            checked={showPassword}
            label="パスワードを表示する"
          />
        </CheckboxContainer>
        {validationErrors.email && (
          <ErrorSpan style={{ color: '#f74a4a' }}>
            {validationErrors.email}
          </ErrorSpan>
        )}
        {validationErrors.password && (
          <ErrorSpan style={{ color: '#f74a4a' }}>
            {validationErrors.password}
          </ErrorSpan>
        )}
        {validationErrors.confirm_password && (
          <ErrorSpan style={{ color: '#f74a4a' }}>
            {validationErrors.confirm_password}
          </ErrorSpan>
        )}
        {validationErrors.request && (
          <ErrorSpan style={{ color: '#f74a4a' }}>
            {validationErrors.request}
          </ErrorSpan>
        )}
        {newPassword &&
          confirmPassword &&
          !isFormValid &&
          !isNewPasswordValid && (
            <ErrorSpan style={{ color: '#f74a4a' }}>
              パスワードが一致しません
            </ErrorSpan>
          )}
        <CommonSeccondaryButton
          onClick={handleCreateUser}
          disabled={!isFormValid}
        >
          登録する
        </CommonSeccondaryButton>
        <CommonOutlineButton
          style={{ marginTop: '15px' }}
          onClick={closePopupCreateAdminUserForm}
        >
          キャンセル
        </CommonOutlineButton>
      </PopupContainerSmallComponent>
    </>
  )
}

export default UserCreateForm
