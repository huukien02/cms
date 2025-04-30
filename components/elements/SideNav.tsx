import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Styled from 'styled-components'
import { useRouter } from 'next/router'
import { useAppContext } from '@/components/state/AppContext'
import { Url } from 'next/dist/shared/lib/router/router'
import Cookies from 'js-cookie'
import useCheckLoginUrl from '../hooks/useCheckLoginUrl'

interface sideNavItem {
  name: string
  link: string
  logo: string
  logoWhite: string
}

const SideNavs: sideNavItem[] = [
  {
    name: 'チケット一覧',
    link: '/tickets',
    logo: '/image/logo/photo@2x.png',
    logoWhite: '/image/logo/photo_white@2x.png',
  },
  {
    name: 'ロット一覧',
    link: '/lots',
    logo: '/image/logo/photo@2x.png',
    logoWhite: '/image/logo/photo_white@2x.png',
  },
  {
    name: 'ロケトラ管理',
    link: '/posts',
    logo: '/image/logo/photo@2x.png',
    logoWhite: '/image/logo/photo_white@2x.png',
  },
  {
    name: 'アプリユーザ管理',
    link: '/users',
    logo: '/image/logo/user@2x.png',
    logoWhite: '/image/logo/user_white@2x.png',
  },
  {
    name: 'お知らせ管理',
    link: '/notices',
    logo: '/image/logo/notice@2x.png',
    logoWhite: '/image/logo/notice_white@2x.png',
  },
  {
    name: '管理ユーザ管理',
    link: '/admins/users',
    logo: '/image/logo/plan@2x.png',
    logoWhite: '/image/logo/plan_white@2x.png',
  },

  {
    name: '設定',
    link: '/settings',
    logo: '/image/logo/plan@2x.png',
    logoWhite: '/image/logo/plan_white@2x.png',
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
    background: #4b79f7 0% 0% no-repeat padding-box;
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

const SideNav = () => {
  const router = useRouter()
  const loginUrl = useCheckLoginUrl()
  const { setIsLogoutPopup, setHashedId } = useAppContext()


  const SideNavs: sideNavItem[] = [
    {
      name: 'ロケトラ管理',
      link: `/${loginUrl}/posts`,
      logo: '/image/logo/photo@2x.png',
      logoWhite: '/image/logo/photo_white@2x.png',
    },
    {
      name: 'アプリユーザ管理',
      link: `/${loginUrl}/users`,
      logo: '/image/logo/user@2x.png',
      logoWhite: '/image/logo/user_white@2x.png',
    },
    {
      name: 'お知らせ管理',
      link: `/${loginUrl}/notices`,
      logo: '/image/logo/notice@2x.png',
      logoWhite: '/image/logo/notice_white@2x.png',
    },
    {
      name: '管理ユーザ管理',
      link: `/${loginUrl}/admins/users`,
      logo: '/image/logo/plan@2x.png',
      logoWhite: '/image/logo/plan_white@2x.png',
    },
    {
      name: '事業設定',
      link: `/${loginUrl}/business-settings`,
      logo: '/image/logo/plan@2x.png',
      logoWhite: '/image/logo/plan_white@2x.png',
    },
    {
      name: '設定',
      link: `/${loginUrl}/settings`,
      logo: '/image/logo/plan@2x.png',
      logoWhite: '/image/logo/plan_white@2x.png',
    },
    {
      name: 'ログアウト',
      link: 'logout',
      logo: '/image/logo/user@2x.png',
      logoWhite: '/image/logo/user_white@2x.png',
    },
  ]

  const handleLogout = () => {
    setIsLogoutPopup(true)
  }
  const handleClick = (link: string) => () => {
    router.push(link)
    setHashedId('')
  }

  return (
    <Section>
      <Title>ロケトラCMS</Title>
      {SideNavs.map((sideNavItem) => {
        const isActive = router.asPath.startsWith(sideNavItem.link)

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

export default SideNav
