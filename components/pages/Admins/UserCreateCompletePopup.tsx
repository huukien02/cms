import React from 'react'
import PopupBackgroundComponent from '@/components/common/PopupBackground'
import PopupContainerSmallComponent from '@/components/common/PopupContainerSmall'
import CloseButton from '@/components/common/Button/CloseButton'
import CommonPopupH2 from '@/components/common/CommonPopupH2'

interface UserCreationCompletePopupProps {
  closePopup: () => void
}

const UserCreationCompletePopup: React.FC<UserCreationCompletePopupProps> = ({
  closePopup,
}) => {
  return (
    <>
      <PopupBackgroundComponent onClick={closePopup}>
        <></>
      </PopupBackgroundComponent>
      <PopupContainerSmallComponent>
        <CloseButton onClick={closePopup}></CloseButton>
        <CommonPopupH2>登録完了しました。</CommonPopupH2>
      </PopupContainerSmallComponent>
    </>
  )
}

export default UserCreationCompletePopup
