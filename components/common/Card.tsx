import React, { ReactNode } from 'react'
import styled from 'styled-components'

const Card = styled.div`
  background-color: #fff;
  border-radius: 5px;
  padding: 1rem;
  position: relative;
  overflow: hidden;
  overflow: auto;
`

interface CardComponentProps {
  children: ReactNode
}

const CardComponent: React.FC<CardComponentProps> = ({ children }) => {
  return <Card className="shadow-xl card bg-base-100">{children}</Card>
}

export default CardComponent
