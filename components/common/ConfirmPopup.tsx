import React from 'react'
import PopupBackgroundComponent from '@/components/common/PopupBackground'
import PopupContainerSmallComponent from '@/components/common/PopupContainerSmall'
import CloseButton from '@/components/common/Button/CloseButton'
import CommonPopupH2 from '@/components/common/CommonPopupH2'
import CommonAccentButton from '@/components/common/Button/AccentButton'
import CommonOutlineButton from '@/components/common/Button/OutlineButton'

interface ConfirmPopupProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  confirmButtonText: string
}

const ConfirmPopup: React.FC<ConfirmPopupProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  confirmButtonText,
}) => {
  return (
    <>
      {isOpen && (
        <>
          <PopupBackgroundComponent onClick={onClose}>
            <></>
          </PopupBackgroundComponent>
          <PopupContainerSmallComponent>
            <CloseButton onClick={onClose}></CloseButton>
            <CommonPopupH2>{title}</CommonPopupH2>
            <CommonAccentButton onClick={onConfirm}>
              {confirmButtonText}
            </CommonAccentButton>
            <CommonOutlineButton
              style={{ marginTop: '15px' }}
              onClick={onClose}
            >
              キャンセル
            </CommonOutlineButton>
          </PopupContainerSmallComponent>
        </>
      )}
    </>
  )
}

export default ConfirmPopup
