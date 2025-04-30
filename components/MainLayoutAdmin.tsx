import { useRouter } from 'next/router'
import React, { ReactNode, useEffect, useState } from 'react'
import Styled from 'styled-components'
import Cookies from 'js-cookie'
import { useAppContext } from '@/components/state/AppContext'
import LogoutPopup from './LogoutPopup'
import { HeaderAdmin } from './elements/HeaderAdmin'
import SideNavAdmin from './elements/SideNavAdmin'
import { TOKEN_SYSTEM_USER, USER_TYPE } from '@/common/auth'
import { axiosInstanceSystemAdmin } from '@/libs'

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

type User = {
  email: string
  name: string
  user_type: 'system_admin' | 'user' | 'other'
}
interface CardComponentProps {
  children: ReactNode
}

const MainLayoutAdmin: React.FC<CardComponentProps> = ({ children }) => {
  const token_system_user = Cookies.get(TOKEN_SYSTEM_USER)
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const { isLogoutPopup, setIsLogoutPopup } = useAppContext()

  const closeLogoutPopup = () => {
    setIsLogoutPopup(false)
  }

  useEffect(() => {
      const fetchUserInfo = async () => {
        try {
          const response = await axiosInstanceSystemAdmin.get(
            `/api/system_admin/1.0/auth/profile`
          )
          const data = response.data.data
          setUser(data.user)
        } catch (error) {
          router.push('/system-admins-login')
          console.error('Error fetching user info:', error)
        }
      }

      fetchUserInfo()
  }, [token_system_user])

  const handleClickLogout = async () => {
    try {
      const response = await axiosInstanceSystemAdmin.post(
        `api/system_admin/1.0/auth/logout`,
      )
      if(response) {
        Cookies.remove(TOKEN_SYSTEM_USER)
        Cookies.remove('user_type')
        router.push('/system-admins-login')
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
      <HeaderAdmin user={user} />
      <Main>
        {renderSideNav && <SideNavAdmin user={user} />}
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

export default MainLayoutAdmin
