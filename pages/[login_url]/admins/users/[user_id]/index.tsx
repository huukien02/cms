import { useEffect, useState } from 'react'
import Styled from 'styled-components'
import axios from 'axios'
import Cookies from 'js-cookie'
import Link from 'next/link'
import CardComponent from '@/components/common/Card'
import CommonSubmitButtonSimple from '@/components/common/Button/ButtonSimple'
import { useRouter } from 'next/router'
import axiosInstance from '@/libs/axiosInstance'

interface UserInfo {
  last_name: string
  first_name: string
  company: string
  affiliation: string
  email: string
  birthday: string
  started_at: string
  hashed_id: string
}

const UserInfoContainer = Styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin:
`

const Container = Styled.div`
  margin: 47px 184px;
`

const H2 = Styled.h2`
  color: #353538;
  font-size: 20px;
  margin-bottom: 16px;
`

const P1 = Styled.p`
  color: #353538;
  font-size: 14px;
  margin-bottom: 11px;
`

const P2 = Styled.p`
  color: #353538;
  font-size: 12px;
  margin-bottom: 10px;
`

const P3 = Styled.p`
  color: #353538;
  font-size: 12px;
  margin-bottom: 17px;
`

const P4 = Styled.p`
  color: #353538;
  font-size: 12px;
  margin-bottom: 27px;
`

const Image1 = Styled.img`
  width: 12.3px;
  margin-right: 5px;
  vertical-align: text-bottom;
`

const Image2 = Styled.img`
  width: 12.6px;
  margin-right: 5px;
  vertical-align: text-bottom;
`

const Image3 = Styled.img`
  width: 11.3px;
  margin-right: 5px;
  vertical-align: text-bottom;
`

const MyPage = () => {
  const router = useRouter()
  const { user_id } = router.query
  const [user, setUser] = useState<UserInfo | null>(null)

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (user_id) {
        try {
          const response = await axiosInstance.get<{ data: UserInfo }>(
            `/cms/1.0/users/${user_id}/info`,
          )

          const data = response.data.data
          console.log(data)
          setUser(data)
        } catch (error) {
          console.error('Error fetching user info:', error)
        }
      }
    }

    fetchUserInfo()
  }, [user_id])

  return (
    <>
      <CardComponent>
        <Container>
          {user && (
            <UserInfoContainer>
              <H2>{user.last_name + '  ' + user.first_name}</H2>
              <P1>
                <Image1 src="/image/logo/building@2x.png" alt="" />
                {user.company + '  ' + user.affiliation}
              </P1>
              <P2>
                <Image2 src="/image/logo/mail@2x.png" alt="" />
                {user.email}
              </P2>
              <P3>
                <Image3 src="/image/logo/calender@2x.png" alt="" />
                Birthday: {user.birthday}
              </P3>
              <P4>
                利用開始日 {user.started_at} 利用者ID {user.hashed_id}
              </P4>
              <CommonSubmitButtonSimple>
                <Link href="/users/update">プロフィール編集</Link>
              </CommonSubmitButtonSimple>
            </UserInfoContainer>
          )}
        </Container>
      </CardComponent>
    </>
  )
}

export default MyPage
