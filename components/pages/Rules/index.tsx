import { useState, useEffect } from 'react'
import { RuleContent } from '@/types'
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
const RuleIndex = () => {
  const [rule, setRule] = useState<RuleContent | null>(null)
  const router = useRouter()
  const [selectedContent, setSelectedContent] = useState<string>('')
  const [isPopupRuleUpdateConfirm, setIsPopupRuleUpdateConfirm] =
    useState(false)
  const [isPopupRuleUpdateComplete, setIsPopupRuleUpdateComplete] =
    useState(false)

  useEffect(() => {
    fetchRule()
  }, [])

  const fetchRule = async () => {
    try {
      const response = await axiosInstance.get(`/cms/1.0/rule`)
      const data = response.data.data
      setRule(data)
      setSelectedContent(data.content)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
    }
  }

  const putRule = async () => {
    try {
      const requestBody = {
        content: selectedContent,
      }

      const response = await axiosInstance.put(`/cms/1.0/rule`, requestBody)
      const data = response.data.data
      setRule(data)
      closePopupRuleUpdateConfirm()
      openPopupRuleUpdateComplete()
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
    }
  }

  const openPopupRuleUpdateConfirm = () => {
    setIsPopupRuleUpdateConfirm(true)
  }

  const closePopupRuleUpdateConfirm = () => {
    setIsPopupRuleUpdateConfirm(false)
  }

  const openPopupRuleUpdateComplete = () => {
    setIsPopupRuleUpdateComplete(true)
  }

  const closePopupRuleUpdateComplete = () => {
    setIsPopupRuleUpdateComplete(false)
  }

  if (!rule) {
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
          <CommonPrimaryButton onClick={openPopupRuleUpdateConfirm}>
            保存
          </CommonPrimaryButton>
        </ButtonContainer>
      </CardComponent>

      {isPopupRuleUpdateConfirm && (
        <>
          <PopupBackgroundComponent onClick={closePopupRuleUpdateConfirm}>
            <></>
          </PopupBackgroundComponent>
          <PopupContainerComponent>
            <CloseButton onClick={closePopupRuleUpdateConfirm}></CloseButton>
            <PopupText>利用規約を保存しますか？</PopupText>
            <Content
              dangerouslySetInnerHTML={{ __html: selectedContent }}
            ></Content>
            <ButtonContainer>
              <CommonPrimaryButton onClick={putRule}>
                保存する
              </CommonPrimaryButton>
              <CommonOutlineButton
                style={{ marginTop: '15px' }}
                onClick={closePopupRuleUpdateConfirm}
              >
                キャンセル
              </CommonOutlineButton>
            </ButtonContainer>
          </PopupContainerComponent>
        </>
      )}

      {isPopupRuleUpdateComplete && (
        <>
          <PopupBackgroundComponent onClick={closePopupRuleUpdateComplete}>
            <></>
          </PopupBackgroundComponent>
          <PopupContainerSmallComponent>
            <CloseButton onClick={closePopupRuleUpdateComplete}></CloseButton>
            <CommonPopupH2>保存しました。</CommonPopupH2>
          </PopupContainerSmallComponent>
        </>
      )}
    </>
  )
}

export default RuleIndex
