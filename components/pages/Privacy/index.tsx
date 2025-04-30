import { useState, useEffect } from 'react'
import { PrivacyContent } from '@/types'
import { useRouter } from 'next/router'
import axios from 'axios'
import Cookies from 'js-cookie'
import Styled from 'styled-components'
import PopupBackgroundComponent from '@/components/common/PopupBackground'
import PopupContainerSmallComponent from '@/components/common/PopupContainerSmall'
import CloseButton from '@/components/common/Button/CloseButton'
import CardComponent from '@/components/common/Card'
import CommonPrimaryButton from '@/components/common/Button/PrimaryButton'
import PopupContainerComponent from '@/components/common/PopupContainer'
import CommonOutlineButton from '@/components/common/Button/OutlineButton'
import CommonPopupH2 from '@/components/common/CommonPopupH2'
import axiosInstance from '@/libs/axiosInstance'

const Textarea = Styled.textarea`
  width: 100%;
  height: calc( 100vh - 300px);
  border: 1px solid #000;
`

const ButtonContainer = Styled.div`
  margin-top: 20px;
  display: flex;
  flex-flow: column;
  align-items: center;
`

const PopupText = Styled.p`
  font-size: 16px;
  margin-bottom: 16px;
`

const Content = Styled.div`
  margin-top: 23px;
  color: #585858;
  font-size: 15px;
  line-height: 28px;
`

const PrivacyIndex = () => {
  const [privacy, setPrivacy] = useState<PrivacyContent | null>(null)
  const router = useRouter()
  const [selectedContent, setSelectedContent] = useState<string>('')
  const [isPopupPrivacyUpdateConfirm, setIsPopupPrivacyUpdateConfirm] =
    useState(false)
  const [isPopupPrivacyUpdateComplete, setIsPopupPrivacyUpdateComplete] =
    useState(false)

  useEffect(() => {
    fetchPrivacy()
  }, [])

  const fetchPrivacy = async () => {
    try {
      const response = await axiosInstance.get(`/cms/1.0/privacy`)
      const data = response.data.data
      setPrivacy(data)
      setSelectedContent(data.content)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
    }
  }

  const putPrivacy = async () => {
    try {
      const requestBody = {
        content: selectedContent,
      }

      const response = await axiosInstance.put(`/cms/1.0/privacy`, requestBody)
      const data = response.data.data
      setPrivacy(data)
      closePopupPrivacyUpdateConfirm()
      openPopupPrivacyUpdateComplete()
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
    }
  }

  const openPopupPrivacyUpdateConfirm = () => {
    setIsPopupPrivacyUpdateConfirm(true)
  }

  const closePopupPrivacyUpdateConfirm = () => {
    setIsPopupPrivacyUpdateConfirm(false)
  }

  const openPopupPrivacyUpdateComplete = () => {
    setIsPopupPrivacyUpdateComplete(true)
  }

  const closePopupPrivacyUpdateComplete = () => {
    setIsPopupPrivacyUpdateComplete(false)
  }

  if (!privacy) {
    return <div>Loading...!!</div>
  }

  return (
    <>
      <CardComponent>
        <Textarea
          value={selectedContent}
          onChange={(e) => setSelectedContent(e.target.value)}
        />
        <ButtonContainer>
          <CommonPrimaryButton onClick={openPopupPrivacyUpdateConfirm}>
            保存
          </CommonPrimaryButton>
        </ButtonContainer>
      </CardComponent>

      {isPopupPrivacyUpdateConfirm && (
        <>
          <PopupBackgroundComponent onClick={closePopupPrivacyUpdateConfirm}>
            <></>
          </PopupBackgroundComponent>
          <PopupContainerComponent>
            <CloseButton onClick={closePopupPrivacyUpdateConfirm}></CloseButton>
            <PopupText>プライバシーポリシーを保存しますか？</PopupText>
            <Content
              dangerouslySetInnerHTML={{ __html: selectedContent }}
            ></Content>
            <ButtonContainer>
              <CommonPrimaryButton onClick={putPrivacy}>
                保存する
              </CommonPrimaryButton>
              <CommonOutlineButton
                style={{ marginTop: '15px' }}
                onClick={closePopupPrivacyUpdateConfirm}
              >
                キャンセル
              </CommonOutlineButton>
            </ButtonContainer>
          </PopupContainerComponent>
        </>
      )}

      {isPopupPrivacyUpdateComplete && (
        <>
          <PopupBackgroundComponent onClick={closePopupPrivacyUpdateComplete}>
            <></>
          </PopupBackgroundComponent>
          <PopupContainerSmallComponent>
            <CloseButton
              onClick={closePopupPrivacyUpdateComplete}
            ></CloseButton>
            <CommonPopupH2>保存しました。</CommonPopupH2>
          </PopupContainerSmallComponent>
        </>
      )}
    </>
  )
}

export default PrivacyIndex
