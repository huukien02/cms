import React, { ReactNode } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  height: auto;
  border-radius: 8px;
  background-color: #fff;
  border: 0;
  position: fixed;
  z-index: 1000;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  width: 700px;
  height: calc(100% - 20px);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 50px;
  overflow: auto;
`

interface PopupContainerComponentProps {
  children: ReactNode
}

const PopupContainerComponent: React.FC<PopupContainerComponentProps> = ({
  children,
}) => {
  return <Container>{children}</Container>
}

export default PopupContainerComponent
