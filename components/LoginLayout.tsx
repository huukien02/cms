import React, { ReactNode } from 'react'
import Styled from 'styled-components'
const Container = Styled.div`
  height: calc(100vh - 39px);
`

const Main = Styled.main`
  margin: 39px auto 0;
  max-width: 327px;
  text-align: center;
`

const Content = Styled.section`
`

interface CardComponentProps {
  children: ReactNode
}

const LoginLayout: React.FC<CardComponentProps> = ({ children }) => {
  return (
    <Container>
      <Main>
        <Content>{children}</Content>
      </Main>
    </Container>
  )
}

export default LoginLayout
