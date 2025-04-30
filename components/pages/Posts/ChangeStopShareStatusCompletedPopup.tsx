import React from 'react'
import PopupBackgroundComponent from '@/components/common/PopupBackground'
import PopupContainerSmallComponent from '@/components/common/PopupContainerSmall'
import CloseButton from '@/components/common/Button/CloseButton'
import CommonPopupH2 from '@/components/common/CommonPopupH2'

interface ChangeStopShareStatusCompletedPopupProps {
  isOpen: boolean
  onClose: () => void
  title: string
}

const ChangeStopShareStatusCompletedPopup: React.FC<
  ChangeStopShareStatusCompletedPopupProps
> = ({ isOpen, onClose, title }) => {
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
          </PopupContainerSmallComponent>
        </>
      )}
    </>
  )
}

export default ChangeStopShareStatusCompletedPopup
