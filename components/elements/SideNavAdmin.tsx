import React, { useState } from 'react'
import Link from 'next/link'
import Styled from 'styled-components'
import { useRouter } from 'next/router'
import { useAppContext } from '@/components/state/AppContext'
import { Url } from 'next/dist/shared/lib/router/router'
import { USER_TYPE } from '@/common/auth'

interface sideNavItem {
  name: string
  link: string
  logo: string
  logoWhite: string
  type?: string
}

const SideNavs: sideNavItem[] = [
  {
    name: '事業管理',
    link: '/system-admin/organization',
    logo: '/image/logo/plan@2x.png',
    logoWhite: '/image/logo/plan_white@2x.png',
    type: USER_TYPE.SYSTEM_ADMIN,
  },
  {
    name: '管理ユーザー管理',
    link: '/system-admin/system-users',
    logo: '/image/logo/plan@2x.png',
    logoWhite: '/image/logo/plan_white@2x.png',
    type: USER_TYPE.SYSTEM_ADMIN,
  },
  {
    name: 'ログアウト',
    link: 'logout',
    logo: '/image/logo/user@2x.png',
    logoWhite: '/image/logo/user_white@2x.png',
  },
]

const Section = Styled.section`
  width: 180px;
  height: calc(100vh - 72px);
  background: #FFFFFF 0% 0% no-repeat padding-box;
  opacity: 1;
  position: fixed;
`

const Title = Styled.div`
  margin-top: 16px;
  padding-left: 10px;
  background: #4b79f7 0% 0% no-repeat padding-box;
  color: #fff;
  height: 40px;
  line-height: 40px;
  margin-bottom: 70px;
`

const SideNavContent = Styled.div`
  margin-top: 16px;
  height: 40px;
  padding-left: 10px;
  &.active {
    background: #E6791A 0% 0% no-repeat padding-box;
    color: #fff;
  }
`
const SideNavContentText = Styled.p`
  height: 40px;
  line-height: 40px;
`

const Span = Styled.span`
  display: flex;
  align-items: center;
`

interface sideNavItem {
  name: string
  link: string
  logo: string
  logoWhite: string
}

const SideNavAdmin = ({ user }: { user: any }) => {
  const router = useRouter()
  const { isLogoutPopup, setIsLogoutPopup } = useAppContext()
  const { hashedId, setHashedId } = useAppContext()

  const handleLogout = () => {
    setIsLogoutPopup(true)
  }

  const handleClick = (link: string) => () => {
    router.push(link)
    setHashedId('')
  }

  return (
    <Section>
      {user &&
        SideNavs.map((sideNavItem) => {
          const isActive = router.pathname.startsWith(sideNavItem.link)
          if (sideNavItem.type && sideNavItem.type != user.user_type)
            return null

          return (
            <SideNavContent
              key={sideNavItem.name}
              className={isActive ? 'active' : ''}
            >
              <SideNavContentText>
                {sideNavItem.name === 'ログアウト' ? (
                  <Span tabIndex={0} onClick={handleLogout}>
                    {sideNavItem.name}
                  </Span>
                ) : (
                  <button onClick={handleClick(sideNavItem.link)}>
                    <Span>{sideNavItem.name}</Span>
                  </button>
                )}
              </SideNavContentText>
            </SideNavContent>
          )
        })}
    </Section>
  )
}

export default SideNavAdmin
