import React from 'react'
import PopupBackgroundComponent from './common/PopupBackground'
import CloseButton from '@/components/common/Button/CloseButton'
import PopupContainerSmallComponent from './common/PopupContainerSmall'
import CommonSubmitOutlineButton from './common/Button/OutlineButton'
import CommonSubmitSeccondaryButton from './common/Button/SecondaryButton'
import CommonPopupH2 from './common/CommonPopupH2'

interface LoginPopupProps {
  onClose: () => void
  handleClickLogout: () => void
}

const LogoutPopup: React.FC<LoginPopupProps> = ({
  onClose,
  handleClickLogout,
}) => {
  return (
    <>
      <PopupBackgroundComponent onClick={onClose}>
        <></>
      </PopupBackgroundComponent>
      <PopupContainerSmallComponent>
        <CloseButton onClick={onClose}></CloseButton>
        <CommonPopupH2>ログアウトしますか？</CommonPopupH2>
        <CommonSubmitSeccondaryButton onClick={handleClickLogout}>
          ログアウトする
        </CommonSubmitSeccondaryButton>
        <CommonSubmitOutlineButton
          onClick={onClose}
          style={{ marginTop: '15px' }}
        >
          キャンセル
        </CommonSubmitOutlineButton>
      </PopupContainerSmallComponent>
    </>
  )
}

export default LogoutPopup
