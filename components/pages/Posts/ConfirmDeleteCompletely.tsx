import React from 'react'
import PopupBackgroundComponent from '@/components/common/PopupBackground'
import PopupContainerSmallComponent from '@/components/common/PopupContainerSmall'
import CloseButton from '@/components/common/Button/CloseButton'
import CommonPopupH2 from '@/components/common/CommonPopupH2'
import CommonPopupText from '@/components/common/CommonPopupText'
import CommonSeccondaryButton from '@/components/common/Button/SecondaryButton'
import CommonOutlineButton from '@/components/common/Button/OutlineButton'

interface ConfirmDeleteCompletelyPopupProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmButtonText: string
}

const ConfirmDeleteCompletelyPopup: React.FC<
  ConfirmDeleteCompletelyPopupProps
> = ({ isOpen, onClose, onConfirm, title, message, confirmButtonText }) => {
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
            <CommonPopupText>{message}</CommonPopupText>
            <CommonSeccondaryButton onClick={onConfirm}>
              {confirmButtonText}
            </CommonSeccondaryButton>
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

export default ConfirmDeleteCompletelyPopup
