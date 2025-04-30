import React, { ReactNode, ButtonHTMLAttributes } from 'react'
import styled from 'styled-components'

const Button = styled.button`
  width: 244px;
`

interface CommonSeccondaryButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

const CommonSeccondaryButton: React.FC<CommonSeccondaryButtonProps> = ({
  children,
  ...props
}) => {
  return (
    <Button className="btn btn-secondary" {...props}>
      {children}
    </Button>
  )
}

export default CommonSeccondaryButton
