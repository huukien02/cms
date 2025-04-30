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
  width: 382px;
  height: auto;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 32px;
  text-align: center;
`

interface PopupContainerSmallComponentProps {
  children: ReactNode
}

const PopupContainerSmallComponent: React.FC<
  PopupContainerSmallComponentProps
> = ({ children }) => {
  return <Container className="modal-box">{children}</Container>
}

export default PopupContainerSmallComponent
