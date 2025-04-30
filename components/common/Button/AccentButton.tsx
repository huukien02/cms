import React, { ReactNode, ButtonHTMLAttributes } from 'react'
import styled from 'styled-components'

const Button = styled.button`
  width: 244px;
`

interface CommonAccentButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

const CommonAccentButton: React.FC<CommonAccentButtonProps> = ({
  children,
  ...props
}) => {
  return (
    <Button className="btn btn-accent" {...props}>
      {children}
    </Button>
  )
}

export default CommonAccentButton
