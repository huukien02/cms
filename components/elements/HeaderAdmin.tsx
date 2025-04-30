import Link from 'next/link'
import Styled from 'styled-components'
import { useState } from 'react'
import { useRouter } from 'next/router'

const HeaderElement = Styled.header`
  background: #E6791A 0% 0% no-repeat padding-box;
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
   width: 160px;
   height: 100%;
`

const LogoCaption = Styled.figcaption`
  font-size: 14px;
  color: #ffffff;
`

const LeftContents = Styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 20px;
  padding-top: 10px;
  padding-bottom: 10px;
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

export const HeaderAdmin = ({ user }: { user: any }) => {
  const { basePath } = useRouter()

  return (
    <>
      <HeaderElement>
        <HeaderContent>
          <LeftContents>
            <Logo>
              <LogoImage
                src={`${basePath}/image/logo/text_logo@2x.png`}
                alt=""
              />
            </Logo>
            <LogoCaption>AdminCMS</LogoCaption>
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
