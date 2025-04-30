import React, { ReactNode, ButtonHTMLAttributes } from 'react'
import Styled from 'styled-components'

const CommonPopupP = Styled.p`
  color: #000;
  // font-size: 20px;
  margin-bottom: 16px;
`

interface CommonPopupTextProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

const CommonPopupText: React.FC<CommonPopupTextProps> = ({ children }) => {
  return <CommonPopupP>{children}</CommonPopupP>
}

export default CommonPopupText
