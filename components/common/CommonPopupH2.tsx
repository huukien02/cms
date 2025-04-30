import React, { ReactNode, ButtonHTMLAttributes } from 'react'
import Styled from 'styled-components'

const H2 = Styled.h2`
  color: #000;
  font-size: 20px;
  margin-bottom: 16px;
`

interface CommonPopupH2Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

const CommonPopupH2: React.FC<CommonPopupH2Props> = ({ children }) => {
  return <H2>{children}</H2>
}

export default CommonPopupH2
