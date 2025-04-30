import { useEffect, useState } from 'react'
import Styled from 'styled-components'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import 'react-datepicker/dist/react-datepicker.css'
import CardComponent from '@/components/common/Card'
import { Notice } from '@/types'
import PopupBackgroundComponent from '@/components/common/PopupBackground'
import PopupContainerSmallComponent from '@/components/common/PopupContainerSmall'
import CloseButton from '@/components/common/Button/CloseButton'
import CommonOutlineButton from '@/components/common/Button/OutlineButton'
import CommonSeccondaryButton from '@/components/common/Button/SecondaryButton'
import CommonPopupH2 from '@/components/common/CommonPopupH2'
import { useAppContext } from '@/components/state/AppContext'
import CommonOutlinePrimaryButton from '@/components/common/Button/OutlinePrimaryButton'
import CommonOutlineSecondaryButton from '@/components/common/Button/OutlineSecondaryButton'
import axiosInstance from '@/libs/axiosInstance'
import useCheckLoginUrl from '@/components/hooks/useCheckLoginUrl'

const UpdateUserInfo = Styled.div`
  display: flex;
  flex-direction: column;
`

const FormContainer = Styled.div`
  margin-top: 50px;
  margin-bottom: 30px;
`

const Label = Styled.label`
  color: #353538;
  font-size: 14px;
`

const NameTd = Styled.td`
  display: flex;
  gap: 11px;
  align-items: baseline;
`

const ButtonContainer = Styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
`

const Table = Styled.table`
  text-align: left;
  margin: 0 auto 100px;
`

const Th = Styled.th`
  width: 100px;
`

const Tr = Styled.tr`
  vertical-align: baseline;
  height: 58px;
`

const PopupText = Styled.p`
  font-size: 16px;
  margin-bottom: 16px;
`

const UpdateNoticesPage = () => {
  const router = useRouter()
  const { id } = router.query
  const loginUrl = useCheckLoginUrl()

  const [notice, setNotice] = useState<Notice | null>(null)
  const [isPopupNoticeDeleteConfirm, setIsPopupNoticeDeleteConfirm] =
    useState(false)
  const [isPopupNoticeDeleteComplete, setIsPopupNoticeDeleteComplete] =
    useState(false)

  useEffect(() => {
    if (id) {
      fetchNoticesData()
    }
  }, [id])

  const fetchNoticesData = async () => {
    try {
      const response = await axiosInstance.get(`/cms/1.0/notices/${id}`)

      if (response.status === 200) {
        const res = response.data.data
        console.log(res)
        setNotice(res)
      } else {
        console.error('Error fetching user info:', response)
      }
    } catch (error) {
      console.error('Error fetching user info:', error)
    }
  }

  const handleUpdate = () => {
    router.push(`${loginUrl}/notices/detail/update?id=${id}`)
  }

  const handleCancel = () => {
    router.push(`${loginUrl}/notices`)
  }

  const handleDelete = async () => {
    try {
      const response = await axiosInstance.delete(`/cms/1.0/notices/${id}`)
      console.log(response)
      if (response.status === 200) {
        closePopupNoticeDeleteConfirm()
        openPopupNoticeDeleteComplete()
      } else {
        console.error('Error:', response)
      }
    } catch (error) {
      return
    }
  }

  const openPopupNoticeDeleteConfirm = () => {
    setIsPopupNoticeDeleteConfirm(true)
  }

  const closePopupNoticeDeleteConfirm = () => {
    setIsPopupNoticeDeleteConfirm(false)
  }

  const openPopupNoticeDeleteComplete = () => {
    setIsPopupNoticeDeleteComplete(true)
  }

  const closePopupNoticeDeleteComplete = () => {
    setIsPopupNoticeDeleteComplete(false)
    router.push(`${loginUrl}/notices`)
  }

  const { showUpdateNoticeSuccessPopup, setShowUpdateNoticeSuccessPopup } =
    useAppContext()

  const closePopupNoticeUpdateComplete = () => {
    setShowUpdateNoticeSuccessPopup(false)
  }

  return (
    <>
      <CardComponent>
        <FormContainer>
          <UpdateUserInfo>
            {notice && (
              <Table>
                <tbody>
                  <Tr>
                    <Th>タイトル</Th>
                    <td>
                      <Label>{notice?.title || ''}</Label>
                    </td>
                  </Tr>
                  <Tr>
                    <Th>内容</Th>
                    <td
                      dangerouslySetInnerHTML={{
                        __html: notice?.content || '',
                      }}
                    ></td>
                  </Tr>
                  <Tr>
                    <Th>公開期間</Th>
                    <NameTd>
                      <Label>
                        {notice.from_date
                          ? notice.from_date.toLocaleString()
                          : '-'}
                      </Label>
                      <span>~</span>
                      <Label>
                        {notice.to_date ? notice.to_date.toLocaleString() : '-'}
                      </Label>
                    </NameTd>
                  </Tr>
                </tbody>
              </Table>
            )}
            <ButtonContainer>
              <CommonOutlineButton type="button" onClick={handleCancel}>
                戻る
              </CommonOutlineButton>
              <CommonOutlinePrimaryButton type="button" onClick={handleUpdate}>
                編集する
              </CommonOutlinePrimaryButton>

              <CommonOutlineSecondaryButton
                type="button"
                onClick={openPopupNoticeDeleteConfirm}
              >
                削除する
              </CommonOutlineSecondaryButton>
            </ButtonContainer>
          </UpdateUserInfo>
        </FormContainer>
      </CardComponent>

      {isPopupNoticeDeleteConfirm && (
        <>
          <PopupBackgroundComponent onClick={closePopupNoticeDeleteConfirm}>
            <></>
          </PopupBackgroundComponent>
          <PopupContainerSmallComponent>
            <CloseButton onClick={closePopupNoticeDeleteConfirm}></CloseButton>
            <CommonPopupH2>お知らせを削除しますか？</CommonPopupH2>
            <CommonSeccondaryButton onClick={handleDelete}>
              削除する
            </CommonSeccondaryButton>
            <CommonOutlineButton
              style={{ marginTop: '15px' }}
              onClick={closePopupNoticeDeleteConfirm}
            >
              キャンセル
            </CommonOutlineButton>
          </PopupContainerSmallComponent>
        </>
      )}

      {isPopupNoticeDeleteComplete && (
        <>
          <PopupBackgroundComponent onClick={closePopupNoticeDeleteComplete}>
            <></>
          </PopupBackgroundComponent>
          <PopupContainerSmallComponent>
            <CloseButton onClick={closePopupNoticeDeleteComplete}></CloseButton>
            <PopupText>削除しました。</PopupText>
          </PopupContainerSmallComponent>
        </>
      )}

      {showUpdateNoticeSuccessPopup && (
        <>
          <PopupBackgroundComponent onClick={closePopupNoticeUpdateComplete}>
            <></>
          </PopupBackgroundComponent>
          <PopupContainerSmallComponent>
            <CloseButton onClick={closePopupNoticeUpdateComplete}></CloseButton>
            <CommonPopupH2>保存しました。</CommonPopupH2>
          </PopupContainerSmallComponent>
        </>
      )}
    </>
  )
}

export default UpdateNoticesPage
