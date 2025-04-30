import React, { ReactNode } from 'react'
import styled from 'styled-components'

const PopupBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.26);
`

interface PopupBackgroundComponentProps {
  children: ReactNode
  onClick: () => void
}

const PopupBackgroundComponent: React.FC<PopupBackgroundComponentProps> = ({
  children,
  onClick,
}) => {
  return <PopupBackground onClick={onClick}>{children}</PopupBackground>
}

export default PopupBackgroundComponent
