import { useRouter } from 'next/router'
import React, { ReactNode, useEffect, useState } from 'react'
import Styled from 'styled-components'
import { Header } from '@/components/elements/Header'
import SideNav from '@/components/elements/SideNav'
import Cookies from 'js-cookie'
import { useAppContext } from '@/components/state/AppContext'
import LogoutPopup from './LogoutPopup'
import { axiosInstance } from '@/libs'
import { TOKEN_ORG_USER } from '@/common/auth'
import useCheckLoginUrl from './hooks/useCheckLoginUrl'

const Container = Styled.div`
  background: #F2F2F2 0% 0% no-repeat padding-box;
`

const Main = Styled.main`
  margin: 4.5rem auto 0;
`

const Content = Styled.section`
margin-left: 180px;
padding: 2rem;
width: calc(100vw - 180px);
height: auto;
min-height: calc( 100vh - 42px);
`

interface CardComponentProps {
  children: ReactNode
}

const MainLayout: React.FC<CardComponentProps> = ({ children }) => {
  const router = useRouter()
  const loginUrl = useCheckLoginUrl()

  const [user, setUser] = useState(null)
  const { isLogoutPopup, setIsLogoutPopup } = useAppContext()

  const closeLogoutPopup = () => {
    setIsLogoutPopup(false)
  }

  useEffect(() => {
    fetchUserInfo()
  }, [])


  const fetchUserInfo = async () => {
    try {
      const response = await axiosInstance.get(
        `/cms/1.0/admins/${loginUrl}/info`,
      )
      const data = response.data.data
      setUser(data)
    } catch (error) {
      await router.push(`${loginUrl}/login`)
      console.error('Error fetching user info:', error)
    }
  }

  const handleClickLogout = async () => {
    try {
      const response = await axiosInstance.post(`/cms/1.0/admins/logout`)
      if (response) {
        await router.push(`/${loginUrl}/login`)
        Cookies.remove(TOKEN_ORG_USER)
        Cookies.remove('user_type')
        Cookies.remove('login_url')
        closeLogoutPopup()
      }
    } catch (error) {
      console.error('Error fetching user info:', error)
    }
  }

  const isErrorPage = router.pathname === '/500' || router.pathname === '/404'
  const renderSideNav = !isErrorPage

  return (
    <Container>
      <Header user={user} />
      <Main>
        {renderSideNav && <SideNav />}
        <Content>
          <>{children}</>
        </Content>
        {isLogoutPopup && (
          <LogoutPopup
            onClose={closeLogoutPopup}
            handleClickLogout={handleClickLogout}
          />
        )}
      </Main>
    </Container>
  )
}

export default MainLayout
