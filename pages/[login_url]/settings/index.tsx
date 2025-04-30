import React, { useState } from 'react'
import { NextPage } from 'next'
import Styled from 'styled-components'
import RuleIndex from '@/components/pages/Rules'
import PrivacyIndex from '@/components/pages/Privacy'
import Link from 'next/link'
import { useRouter } from 'next/router'

const TabContainer = Styled.div`
  display: flex;
  justify-content: start;
  padding: 10px;
  border-bottom: 1px solid #dadadd;
  margin-bottom: 30px;
  padding-bottom: 0px;
`

const TabButton = Styled.button`
  padding: 12px;
  color: #dadadd;
  font-family: "HiraginoKakuGothicProN-W6";
  border: none;
  cursor: pointer;

  &.active {
    border-bottom: 2px solid #4a79f7;
    color: #4e4e52;
  }
`

enum Tab {
  Rule = 'Rule',
  Privacy = 'Privacy',
  Version = 'version',
}

interface NavLinkProps {
  href: string
  children: React.ReactNode
}

const NavLink: React.FC<NavLinkProps> = ({ href, children }) => {
  const router = useRouter()
  const isActive = router.asPath === href

  return (
    <Link href={href} className={isActive ? 'active' : ''}>
      {children}
    </Link>
  )
}

const LegalPage: NextPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Rule)

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab)
  }

  return (
    <>
      <h1>設定</h1>
      <TabContainer>
        <TabButton
          className={activeTab === Tab.Rule ? 'active' : ''}
          onClick={() => handleTabChange(Tab.Rule)}
        >
          利用規約
        </TabButton>
        <TabButton
          className={activeTab === Tab.Privacy ? 'active' : ''}
          onClick={() => handleTabChange(Tab.Privacy)}
        >
          プライバシーポリシー
        </TabButton>
        {/* <TabButton
          className={activeTab === Tab.Version ? 'active' : ''}
          onClick={() => handleTabChange(Tab.Version)}
        >
          バージョン管理
        </TabButton> */}
      </TabContainer>
      {activeTab === Tab.Rule && <RuleIndex />}
      {activeTab === Tab.Privacy && <PrivacyIndex />}
      {/* {activeTab === Tab.Version && <VersionIndex />} */}
    </>
  )
}

export default LegalPage
