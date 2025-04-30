import Link from 'next/link'
import Styled from 'styled-components'
import { useState } from 'react'

const HeaderElement = Styled.header`
  background: #4b79f7 0% 0% no-repeat padding-box;
  height: 4.5rem;
  z-index: 100;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  a {
    color: #111;
  }
`

const HeaderContent = Styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  justify-content: space-between;
  margin: auto;
  // max-width: 72rem;
`
const Logo = Styled.figure`
  display: flex;
  height: 100%;
  margin: 0;
`

const LogoImage = Styled.img`
  height: 100%;
  width: auto;
  padding: 22px;
`

const LeftContents = Styled.div`
  display: flex;
`
const RightContents = Styled.ul`
  display: flex;
  justify-content: center;
  align-items: center;
`
const UserInfo = Styled.div`
  display: flex;
  align-items: center;
  color: white;
  font-weight: bold;
  margin-right: 20px;
`

const P = Styled.p`
  margin-right: 20px;
  color: #fff;
  a {
    color: #fafafc;
    font-size: 14px;
  }
`

const Button = Styled.button`
  background: none;
  border: none;
  color: #fafafc;
  font-size: 14px;
`

export const Header = ({ user }: { user: any }) => {
  return (
    <>
      <HeaderElement>
        <HeaderContent>
          <LeftContents>
            <Logo>
              <LogoImage src="/image/logo/text_logo@2x.png" alt="" />
            </Logo>
          </LeftContents>
          <RightContents>
            {user ? (
              <UserInfo>
                <Button>{user.admin_id}</Button>
              </UserInfo>
            ) : (
              <P>
                <Link href="/login">ログイン</Link>
              </P>
            )}
          </RightContents>
        </HeaderContent>
      </HeaderElement>
    </>
  )
}
