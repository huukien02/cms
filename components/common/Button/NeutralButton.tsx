import React, { ReactNode, ButtonHTMLAttributes } from 'react'
import styled from 'styled-components'

const Button = styled.button`
  width: 244px;
`

interface CommonSubmitNeutralButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

const CommonSubmitNeutralButton: React.FC<CommonSubmitNeutralButtonProps> = ({
  children,
  ...props
}) => {
  return (
    <Button className="btn btn-neutral" {...props}>
      {children}
    </Button>
  )
}

export default CommonSubmitNeutralButton
