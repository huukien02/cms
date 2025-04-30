import { useRouter } from 'next/router'
import React, { ReactNode, useEffect, useState } from 'react'
import Styled from 'styled-components'
import { Header } from '@/components/elements/Header'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useAppContext } from '@/components/state/AppContext'

const Container = Styled.div`
  height: 100vh;
`

const Main = Styled.main`
  display: flex;
  margin: 122px auto 0;
  max-width: 300px;
  text-align: center;
`

const Content = Styled.section`
  width: calc(100vw - 180px);
`

interface CardComponentProps {
  children: ReactNode
}

const HeaderMainLayout: React.FC<CardComponentProps> = ({ children }) => {
  const { user, setUser } = useAppContext()
  const router = useRouter()

  useEffect(() => {
    const fetchUserInfo = async () => {}

    fetchUserInfo()
  }, [])

  return (
    <Container>
      <Header user={user} />
      <Main>
        <Content>
          <>{children}</>
        </Content>
      </Main>
    </Container>
  )
}

export default HeaderMainLayout
