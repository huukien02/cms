import { useEffect, useState } from 'react'
import Styled from 'styled-components'
import axios from 'axios'
import Cookies from 'js-cookie'
import CardComponent from '@/components/common/Card'
import { useRouter } from 'next/router'
import PopupBackgroundComponent from '@/components/common/PopupBackground'
import PopupContainerSmallComponent from '@/components/common/PopupContainerSmall'
import CloseButton from '@/components/common/Button/CloseButton'
import { User } from '@/types'
import CommonAccentButton from '@/components/common/Button/AccentButton'
import CommonOutlineButton from '@/components/common/Button/OutlineButton'
import CommonPopupH2 from '@/components/common/CommonPopupH2'
import CommonOutlineAccentButton from '@/components/common/Button/OutlineAccentButton'
import CompletedPopup from '@/components/common/CompletedPopup'
import FileDetailComponent from '@/components/pages/Users/UserDetail'
import axiosInstance from '@/libs/axiosInstance'
import useCheckLoginUrl from '@/components/hooks/useCheckLoginUrl'

const H2 = Styled.h2`
  color: #353538;
  font-size: 20px;
  margin-bottom: 16px;
`

const FileDetails = Styled.div`
  margin: 20px;
`

const H1 = Styled.h1`
  border-bottom: 1px solid #000;
  margin-bottom: 30px;
  padding-bottom: 30px;
`

const MyPage = () => {
  const router = useRouter()
  const loginUrl = useCheckLoginUrl()
  const { user_id } = router.query
  const [user, setUser] = useState<User | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [isPopupOpenConfirm, setIsPopupOpenConfirm] = useState(false)
  const [isPopupOpenSuccessDeactive, setIsPopupOpenSuccessDeactive] =
    useState(false)
  const [isPopupOpenSuccessActive, setIsPopupOpenSuccessActive] =
    useState(false)
  const [status, setStatus] = useState({
    isActive: false,
    isAuto: false,
    isStopped: false,
  })
  const [userId, setUserId] = useState<string>('')

  useEffect(() => {
    let localUserId = localStorage.getItem('userId')
    if (typeof user_id === 'string') {
      localStorage.setItem('userId', user_id)
      localUserId = user_id
    }
    if (localUserId) {
      setUserId(localUserId)
    }

    fetchUserInfo()
  }, [user_id])

  const fetchUserInfo = async () => {
    if (user_id) {
      try {
        const response = await axiosInstance.get<{ data: User }>(
          `/cms/1.0/users/${user_id}/info`,
        )

        const data = response.data.data
        console.log(data)
        setUser(data)
        setSelectedFiles(
          Array.isArray(data.hashed_id) ? data.hashed_id : [data.hashed_id],
        )

        if (data.deleted_at !== null) {
          setStatus({ ...status, isAuto: true })
        } else if (data.email_verified_at !== null && data.deactivation === 0) {
          setStatus({ ...status, isActive: true })
        } else if (data.email_verified_at !== null && data.deactivation === 1) {
          setStatus({ ...status, isStopped: true })
        } else {
          setStatus({ ...status, isAuto: true })
        }
        getStatusText(data)
      } catch (error) {
        console.error('Error fetching user info:', error)
      }
    }
  }

  const updateDeactivation = async () => {
    try {
      const requestBody = {
        deactivation: user?.deactivation === 0 ? 1 : 0,
        hashed_ids: selectedFiles,
      }

      const response = await axiosInstance.patch(
        `/cms/1.0/users/deactivation`,
        requestBody,
      )

      fetchUserInfo()
      closePopupConfirm()
      console.log(user?.deactivation)
      if (user?.deactivation === 0) {
        openPopupSuccessDeactive()
      } else if (user?.deactivation === 1) {
        openPopupSuccessActive()
      }

      console.log(response)
      if (response.status === 503) {
        router.push('/maintenance.html')
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 500) {
        router.push('/500')
      }
    }
  }

  const getStatusText = (user: User) => {
    if (
      user.email_verified_at === null &&
      user.deactivation === 0 &&
      user.deleted_at === null
    ) {
      return '仮登録'
    } else if (
      user.email_verified_at !== null &&
      user.deactivation === 0 &&
      user.deleted_at === null
    ) {
      return '本登録(有効)'
    } else if (
      user.email_verified_at !== null &&
      user.deactivation === 1 &&
      user.deleted_at === null
    ) {
      return '本登録(停止)'
    } else if (user.deleted_at !== null) {
      return '退会'
    }
    return 'Unknown Status'
  }

  const openPopupConfirm = () => {
    setIsPopupOpenConfirm(true)
  }

  const closePopupConfirm = () => {
    setIsPopupOpenConfirm(false)
  }

  const openPopupSuccessActive = () => {
    setIsPopupOpenSuccessActive(true)
  }

  const closePopupSuccessActive = () => {
    setIsPopupOpenSuccessActive(false)
  }

  const openPopupSuccessDeactive = () => {
    setIsPopupOpenSuccessDeactive(true)
  }

  const closePopupSuccessDeactive = () => {
    setIsPopupOpenSuccessDeactive(false)
  }

  const goBack = () => {
    router.push(`${loginUrl}/users`)
  }

  return (
    <>
      <CardComponent>
        <H1>ユーザ管理_ユーザ一覧_詳細</H1>
        <FileDetails>
          <H2>プロフィール</H2>
          {user && (
            <FileDetailComponent
              user={user}
              status={status}
              openPopupConfirm={openPopupConfirm}
              statusText={getStatusText(user)}
            />
          )}
        </FileDetails>
        <CommonOutlineButton onClick={goBack}>戻る</CommonOutlineButton>
      </CardComponent>

      {isPopupOpenConfirm && (
        <>
          <PopupBackgroundComponent onClick={closePopupConfirm}>
            <></>
          </PopupBackgroundComponent>
          <PopupContainerSmallComponent>
            <CloseButton onClick={closePopupConfirm}></CloseButton>
            <CommonPopupH2>
              ユーザステータスを
              <br />
              {user && user.deactivation === 0 ? '無効' : '有効'}
              に変更しますか？
            </CommonPopupH2>
            <CommonAccentButton onClick={updateDeactivation}>
              {user && user.deactivation === 0
                ? '無効に変更する'
                : '有効に変更する'}
            </CommonAccentButton>
            <CommonOutlineButton
              onClick={closePopupConfirm}
              style={{ marginTop: '15px' }}
            >
              キャンセル
            </CommonOutlineButton>
          </PopupContainerSmallComponent>
        </>
      )}

      <CompletedPopup
        isOpen={isPopupOpenSuccessActive}
        onClose={closePopupSuccessActive}
        title="有効に変更しました。"
      />

      <CompletedPopup
        isOpen={isPopupOpenSuccessDeactive}
        onClose={closePopupSuccessDeactive}
        title="無効に変更しました。"
      />
    </>
  )
}

export default MyPage
