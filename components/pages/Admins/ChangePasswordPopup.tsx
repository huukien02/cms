import React, { ChangeEvent } from 'react'
import Styled from 'styled-components'
import PopupBackgroundComponent from '@/components/common/PopupBackground'
import PopupContainerSmallComponent from '@/components/common/PopupContainerSmall'
import CloseButton from '@/components/common/Button/CloseButton'
import CommonPopupH2 from '@/components/common/CommonPopupH2'
import CommonAccentButton from '@/components/common/Button/AccentButton'
import CommonOutlineButton from '@/components/common/Button/OutlineButton'
import Checkbox from '@/components/common/Checkbox'

const Table = Styled.table`
  width: 100%;
  margin-bottom: 15px;
  text-align: left;
`

const Th = Styled.th`
  whitespace-nowrap
`

const Td = Styled.td`
  width: 60%;
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
  password?: string
  confirm_password?: string
}

interface ChangePasswordPopupProps {
  showPassword: boolean
  toggleShowPassword: () => void
  isOpen: boolean
  adminId: string
  isNewPasswordValid: boolean
  newPassword: string
  confirmPassword: string
  closePopup: () => void
  changeNewPassword: (e: ChangeEvent<HTMLInputElement>) => void
  changeConfirmPassword: (e: ChangeEvent<HTMLInputElement>) => void
  adminUserChangePassword: (adminId: string) => void
  onInputBlur: (e: React.FocusEvent<HTMLInputElement>) => void
  validationErrors: FieldErrors
  isPasswordFormValid: boolean
}

const ChangePasswordPopup: React.FC<ChangePasswordPopupProps> = ({
  showPassword,
  toggleShowPassword,
  isOpen,
  adminId,
  isNewPasswordValid,
  newPassword,
  confirmPassword,
  closePopup,
  changeNewPassword,
  changeConfirmPassword,
  adminUserChangePassword,
  onInputBlur,
  validationErrors,
  isPasswordFormValid,
}) => {
  if (!isOpen) {
    return null
  }

  return (
    <>
      <PopupBackgroundComponent onClick={closePopup}>
        <></>
      </PopupBackgroundComponent>
      <PopupContainerSmallComponent>
        <CloseButton onClick={closePopup}></CloseButton>
        <CommonPopupH2>パスワード変更</CommonPopupH2>
        <Table>
          <tbody>
            <tr>
              <Th className="py-2 text-xs text-gray-500">新しいパスワード</Th>
              <Td>
                <Input
                  className="input input-bordered input-sm w-full max-w-xs"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="新しいパスワードを入力してください"
                  onChange={changeNewPassword}
                  onBlur={onInputBlur}
                  hasError={!!validationErrors.password}
                  maxLength={50}
                  value={newPassword}
                />
              </Td>
            </tr>
            <tr>
              <Th className="py-2 text-xs text-gray-500">
                新しいパスワード
                <br />
                (確認用)
              </Th>
              <Td>
                <Input
                  className="input input-bordered input-sm w-full max-w-xs"
                  name="confirm_password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="確認用パスワードを入力してください"
                  onChange={changeConfirmPassword}
                  onBlur={onInputBlur}
                  hasError={!!validationErrors.confirm_password}
                  maxLength={50}
                  value={confirmPassword}
                />
              </Td>
            </tr>
          </tbody>
        </Table>
        <CheckboxContainer>
          <Checkbox
            onChange={toggleShowPassword}
            checked={showPassword}
            label="パスワードを表示する"
          />
        </CheckboxContainer>
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
        {newPassword &&
          confirmPassword &&
          !isPasswordFormValid &&
          !isNewPasswordValid && (
            <ErrorSpan style={{ color: '#f74a4a' }}>
              パスワードが一致しません
            </ErrorSpan>
          )}
        <CommonAccentButton
          onClick={() => adminUserChangePassword(adminId)}
          disabled={!isNewPasswordValid}
        >
          変更する
        </CommonAccentButton>

        <CommonOutlineButton style={{ marginTop: '15px' }} onClick={closePopup}>
          キャンセル
        </CommonOutlineButton>
      </PopupContainerSmallComponent>
    </>
  )
}

export default ChangePasswordPopup
