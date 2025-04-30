import axios from 'axios'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import apiConfig from '@/apiConfig'
import { File, Report } from '@/types'
import Styled from 'styled-components'
import CardComponent from '@/components/common/Card'
import Link from 'next/link'
import CommonOutlineButton from '@/components/common/Button/OutlineButton'
import ReportListTable from '@/components/pages/Posts/ReportListTable'
import CommonOutlineSecondaryButton from '@/components/common/Button/OutlineSecondaryButton'
import CommonOutlineAccentButton from '@/components/common/Button/OutlineAccentButton'
import CommonOutlineWarningButton from '@/components/common/Button/OutlineWarningButton'
import ConfirmDeleteCompletelyPopup from '@/components/pages/Posts/ConfirmDeleteCompletely'
import ConfirmPopup from '@/components/common/ConfirmPopup'
import CompletedPopup from '@/components/common/CompletedPopup'
import axiosInstance from '@/libs/axiosInstance'
import useCheckLoginUrl from '@/components/hooks/useCheckLoginUrl'

const FileDetails = Styled.div`
  margin: 20px;
`

const FileDetail = Styled.div`
  margin: 10px 0 30px;
`

const H1 = Styled.h1`
  border-bottom: 1px solid #000;
  margin-bottom: 30px;
  padding-bottom: 30px;
`

const H2 = Styled.h2`
  font-size: 25px;
`

const Table = Styled.table`
  text-align: left;
  word-break: break-all;
`

const Tr = Styled.tr`
  vertical-align: baseline;
  height: 58px;
`

const Th = Styled.th`
  width: 200px;
`

const Td = Styled.td`
`

const ButtonContainer = Styled.div`
  display: flex;
  gap: 20px;
    justify-content: center;
`

const FilePage = () => {
  const router = useRouter()
    const loginUrl = useCheckLoginUrl()
  const { user_id, folder_id, file_id, extension } = router.query
  const [file, setFile] = useState<File | null>(null)
  const [reportAiReport, setReportAiReport] = useState<Report[] | null>(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [stopShared, setStopShared] = useState(0)
  const [
    isStopShareStatusConfirmPopupOpen,
    setIsStopShareStatusConfirmPopupOpen,
  ] = useState(false)
  const [
    isStopShareStatusCompletedPopupOpen,
    setIsStopShareStatusCompletedPopupOpen,
  ] = useState(false)
  const [
    isStashReverseCompletedPopupOpen,
    setIsStashReverseCompletedPopupOpen,
  ] = useState(false)
  const [reportStatus, setReportStatus] = useState(0)
  const [isReportStatusConfirmPopupOpen, setIsReportStatusConfirmPopupOpen] =
    useState(false)
  const [
    isReportStatusCompletedPopupOpen,
    setIsReportStatusCompletedPopupOpen,
  ] = useState(false)
  const [aiReportStatus, setAiReportStatus] = useState(0)
  const [
    isAiReportStatusConfirmPopupOpen,
    setIsAiReportStatusConfirmPopupOpen,
  ] = useState(false)
  const [
    isAiReportStatusCompletedPopupOpen,
    setIsAiReportStatusCompletedPopupOpen,
  ] = useState(false)

  useEffect(() => {
    fetchFile()
    if (file_id) {
      setSelectedFiles(Array.isArray(file_id) ? file_id : [file_id])
    }
  }, [user_id, folder_id, file_id, extension])

  const fetchFile = async () => {
    try {
      if (user_id && folder_id && file_id) {
        const response = await axiosInstance.get(
          `/cms/1.0/users/${user_id}/posts/folders/${folder_id}/files/${file_id}`,
        )
        const data = response.data.data
        console.log(data)
        setStopShared(data.stop_shared)
        setReportStatus(data.report_status)
        setAiReportStatus(data.ai_report_status)
        setFile(data)
        console.log(data.report_ai_report)
        setReportAiReport(data.report_ai_report)
      }
    } catch (error) {
      console.error('Error fetching file:', error)
    }
  }

  const patchSelectedFilesStashReverse = async () => {
    try {
      const requestBody = {
        stash: 0,
        file_ids: selectedFiles,
      }

      const response = await axiosInstance.patch(
        `/cms/1.0/posts/files/stash`,
        requestBody,
      )

      if (response.status === 503) {
        router.push('/maintenance.html')
      }

      await fetchFile()
      closeStopShareStatusConfirmPopup()
      openStashReversePopupComplete()
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 500) {
        router.push('/500')
      }
    }
  }

  const patchSelectedFilesStashCompletely = async () => {
    try {
      const requestBody = {
        stash: 2,
        file_ids: selectedFiles,
      }

      const response = await axiosInstance.patch(
        `/cms/1.0/posts/files/stash`,
        requestBody,
      )

      if (response.status === 503) {
        router.push('/maintenance.html')
      }

      closePopup()
      router.push(`${loginUrl}/posts/users?hashed_id=${user_id}`)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 500) {
        router.push('/500')
      }
    }
  }

  const patchSelectedFileStopShared = async () => {
    try {
      const requestBody = {
        stop_shared: stopShared ? 0 : 1,
        file_ids: selectedFiles,
      }

      const response = await axiosInstance.patch(
        `/cms/1.0/posts/files/stop_shared`,
        requestBody,
      )

      if (response.status === 503) {
        router.push('/maintenance.html')
      }

      await fetchFile()
      closeStopShareStatusConfirmPopup()
      openStopShareStatusPopupComplete()
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 500) {
        router.push('/500')
      }
    }
  }

  const patchSelectedFileReportStatus = async () => {
    try {
      const requestBody = {
        report_status: 2,
        file_ids: selectedFiles,
      }

      const response = await axiosInstance.patch(
        `/cms/1.0/posts/files/report_status`,
        requestBody,
      )

      if (response.status === 503) {
        router.push('/maintenance.html')
      }

      await fetchFile()
      closeReportStatusConfirmPopup()
      openReportStatusPopupComplete()
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 500) {
        router.push('/500')
      }
    }
  }

  const patchSelectedFileAiReportStatus = async () => {
    try {
      const requestBody = {
        ai_report_status: 2,
        file_ids: selectedFiles,
      }

      const response = await axiosInstance.patch(
        `/cms/1.0/posts/files/ai_report_status`,
        requestBody,
      )

      if (response.status === 503) {
        router.push('/maintenance.html')
      }

      await fetchFile()
      closeAiReportStatusConfirmPopup()
      openAiReportStatusPopupComplete()
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 500) {
        router.push('/500')
      }
    }
  }

  const openPopup = () => {
    setIsPopupOpen(true)
  }

  const closePopup = () => {
    setIsPopupOpen(false)
  }

  const openStopShareStatusPopupConfirm = () => {
    setIsStopShareStatusConfirmPopupOpen(true)
  }

  const closeStopShareStatusConfirmPopup = () => {
    setIsStopShareStatusConfirmPopupOpen(false)
  }

  const openStopShareStatusPopupComplete = () => {
    setIsStopShareStatusCompletedPopupOpen(true)
  }

  const closeStopShareStatusCompletedPopup = () => {
    setIsStopShareStatusCompletedPopupOpen(false)
  }

  const openStashReversePopupComplete = () => {
    setIsStashReverseCompletedPopupOpen(true)
  }

  const closeStashReverseCompletedPopup = () => {
    setIsStashReverseCompletedPopupOpen(false)
  }

  const openReportStatusPopupConfirm = () => {
    setIsReportStatusConfirmPopupOpen(true)
  }

  const closeReportStatusConfirmPopup = () => {
    setIsReportStatusConfirmPopupOpen(false)
  }

  const openReportStatusPopupComplete = () => {
    setIsReportStatusCompletedPopupOpen(true)
  }

  const closeReportStatusCompletedPopup = () => {
    setIsReportStatusCompletedPopupOpen(false)
  }

  const openAiReportStatusPopupConfirm = () => {
    setIsAiReportStatusConfirmPopupOpen(true)
  }

  const closeAiReportStatusConfirmPopup = () => {
    setIsAiReportStatusConfirmPopupOpen(false)
  }

  const openAiReportStatusPopupComplete = () => {
    setIsAiReportStatusCompletedPopupOpen(true)
  }

  const closeAiReportStatusCompletedPopup = () => {
    setIsAiReportStatusCompletedPopupOpen(false)
  }

  const goBack = () => {
    router.push(`${loginUrl}/posts`)
  }

  if (!file) {
    return null
  }

  return (
    <>
      <CardComponent>
        <H1>ユーザ管理_写真一覧_詳細</H1>
        <FileDetails>
          <H2>ファイル情報</H2>
          <FileDetail>
            <img
              src={`${apiConfig.baseStorageUrl}/${folder_id}/${file_id}.${extension}`}
              alt=""
            />
          </FileDetail>
          <FileDetail>
            <div
              className="border-b border-gray-200 shadow"
              style={{ overflow: 'auto' }}
            >
              <Table className="w-full table-auto divide-y divide-gray-300">
                <tbody className="divide-y divide-gray-300 bg-white">
                  <Tr>
                    <Th className="bg-gray-50 px-6 py-2 text-xs text-gray-500">
                      フォルダID
                    </Th>
                    <Td className="px-6 py-4">{file.folder_id}</Td>
                  </Tr>
                  <Tr>
                    <Th className="bg-gray-50 px-6 py-2 text-xs text-gray-500">
                      フォルダ名
                    </Th>
                    <Td className="px-6 py-4">{file.file_name}</Td>
                  </Tr>
                  <Tr>
                    <Th className="bg-gray-50 px-6 py-2 text-xs text-gray-500">
                      ファイルID
                    </Th>
                    <Td className="px-6 py-4">{file.file_id}</Td>
                  </Tr>
                  <Tr>
                    <Th className="bg-gray-50 px-6 py-2 text-xs text-gray-500">
                      アップロード時間
                    </Th>
                    <Td className="px-6 py-4">{file.created_at}</Td>
                  </Tr>
                  <Tr>
                    <Th className="bg-gray-50 px-6 py-2 text-xs text-gray-500">
                      更新時間
                    </Th>
                    <Td className="px-6 py-4">{file.updated_at}</Td>
                  </Tr>
                  <Tr>
                    <Th className="bg-gray-50 px-6 py-2 text-xs text-gray-500">
                      フォルダURL
                    </Th>
                    <Td className="px-6 py-4">
                      <Link
                        href={`${apiConfig.baseUrl}/show/${file.folder_share_key}`}
                      >{`${apiConfig.baseUrl}/show/${file.folder_share_key}`}</Link>
                    </Td>
                  </Tr>
                  <Tr>
                    <Th className="bg-gray-50 px-6 py-2 text-xs text-gray-500">
                      ファイルURL
                    </Th>
                    <Td className="px-6 py-4">
                      <Link
                        href={`${apiConfig.baseUrl}/show/file/${file.file_share_key}`}
                      >{`${apiConfig.baseUrl}/show/file/${file.file_share_key}`}</Link>
                    </Td>
                  </Tr>
                  <Tr>
                    <Th className="bg-gray-50 px-6 py-2 text-xs text-gray-500">
                      ステータス
                    </Th>
                    <Td className="px-6 py-4">
                      {stopShared
                        ? '共有不可'
                        : file.stash === 0
                          ? '通常'
                          : file.stash === 1
                            ? 'ゴミ箱'
                            : file.stash === 2
                              ? '消去'
                              : ''}
                    </Td>
                  </Tr>
                  <Tr>
                    <Th className="bg-gray-50 px-6 py-2 text-xs text-gray-500">
                      通報ステータス
                    </Th>
                    <Td className="px-6 py-4">
                      {file.report_status === 0 && file.ai_report_status === 0
                        ? '通報なし'
                        : file.report_status === 1 ||
                            file.ai_report_status === 1
                          ? '通報中'
                          : file.report_status === 2 ||
                              file.ai_report_status === 2
                            ? '通報解除'
                            : ''}
                    </Td>
                  </Tr>
                </tbody>
              </Table>
            </div>
          </FileDetail>
          <H2>写真情報</H2>
          <FileDetail>
            <div
              className="border-b border-gray-200 shadow"
              style={{ overflow: 'auto' }}
            >
              <Table className="w-full table-auto divide-y divide-gray-300">
                <tbody className="divide-y divide-gray-300 bg-white">
                  <Tr>
                    <Th className="bg-gray-50 px-6 py-2 text-xs text-gray-500">
                      撮影日時
                    </Th>
                    <Td className="px-6 py-4">{file.shooting_datetime}</Td>
                  </Tr>
                  <Tr>
                    <Th className="bg-gray-50 px-6 py-2 text-xs text-gray-500">
                      撮影地点
                    </Th>
                    <Td className="px-6 py-4">{file.address}</Td>
                  </Tr>
                  <Tr>
                    <Th className="bg-gray-50 px-6 py-2 text-xs text-gray-500">
                      GPS
                    </Th>
                    <Td className="px-6 py-4">
                      {parseFloat(file.shooting_place_lat) +
                        ',  ' +
                        parseFloat(file.shooting_place_long)}
                    </Td>
                  </Tr>
                  <Tr>
                    <Th className="bg-gray-50 px-6 py-2 text-xs text-gray-500">
                      撮影端末UUID
                    </Th>
                    <Td className="px-6 py-4">{file.device_uuid}</Td>
                  </Tr>
                </tbody>
              </Table>
            </div>
          </FileDetail>
          <FileDetail>
            <div
              className="border-b border-gray-200 shadow"
              style={{ overflow: 'auto' }}
            >
              <Table className="table-auto divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <Th className="px-6 py-2 text-xs text-gray-500">No.</Th>
                    <Th className="px-6 py-2 text-xs text-gray-500">検出元</Th>
                    <Th className="px-6 py-2 text-xs text-gray-500">
                      検出・報告日
                    </Th>
                    <Th className="px-6 py-2 text-xs text-gray-500">
                      ステータス遷移日
                    </Th>
                    <Th className="px-6 py-2 text-xs text-gray-500">
                      ステータス
                    </Th>
                    <Th className="px-6 py-2 text-xs text-gray-500">
                      メールアドレス
                    </Th>
                    <Th className="px-6 py-2 text-xs text-gray-500">
                      通報者名
                    </Th>
                    <Th className="px-6 py-2 text-xs text-gray-500">
                      通報内容
                    </Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300 bg-white">
                  {reportAiReport &&
                    reportAiReport.map((report, index) => (
                      <ReportListTable
                        key={report.id}
                        rowNumber={index + 1}
                        report={report}
                        report_status={file.report_status}
                        ai_report_status={aiReportStatus}
                      />
                    ))}
                </tbody>
              </Table>
            </div>
          </FileDetail>
          <ButtonContainer>
            <CommonOutlineButton type="button" onClick={goBack}>
              戻る
            </CommonOutlineButton>
            <CommonOutlineSecondaryButton
              disabled={file.stash === 2}
              onClick={openPopup}
            >
              削除
            </CommonOutlineSecondaryButton>
            <CommonOutlineWarningButton
              disabled={
                file.ai_report_status === 0 || file.ai_report_status === 2
              }
              onClick={openAiReportStatusPopupConfirm}
            >
              AI通報解除
            </CommonOutlineWarningButton>
            <CommonOutlineWarningButton
              disabled={reportStatus === 0 || reportStatus === 2}
              onClick={openReportStatusPopupConfirm}
            >
              通報解除
            </CommonOutlineWarningButton>
            <CommonOutlineAccentButton
              onClick={openStopShareStatusPopupConfirm}
              disabled={file.stash === 2}
            >
              {file.stash === 1
                ? '元に戻す'
                : stopShared
                  ? '共有再開'
                  : '共有停止'}
            </CommonOutlineAccentButton>
          </ButtonContainer>
        </FileDetails>
      </CardComponent>

      <ConfirmDeleteCompletelyPopup
        isOpen={isPopupOpen}
        onClose={closePopup}
        onConfirm={patchSelectedFilesStashCompletely}
        title="削除した写真は復元することはできません"
        message="本当に削除しますか？"
        confirmButtonText="完全に削除する"
      />

      <ConfirmPopup
        isOpen={isStopShareStatusConfirmPopupOpen}
        onClose={closeStopShareStatusConfirmPopup}
        onConfirm={
          file.stash === 1
            ? patchSelectedFilesStashReverse
            : patchSelectedFileStopShared
        }
        title={
          file.stash === 1
            ? '写真を元に戻しますか？'
            : stopShared
              ? '写真の共有を再開しますか？'
              : '写真の共有を停止しますか？'
        }
        confirmButtonText={
          file.stash === 1
            ? '元に戻す'
            : stopShared
              ? '再開する'
              : '停止する'
        }
      />

      <CompletedPopup
        isOpen={isStashReverseCompletedPopupOpen}
        onClose={closeStashReverseCompletedPopup}
        title="元に戻しました"
      />

      <CompletedPopup
        isOpen={isStopShareStatusCompletedPopupOpen}
        onClose={closeStopShareStatusCompletedPopup}
        title={stopShared ? '共有を停止しました' : '共有を再開しました'}
      />

      <ConfirmPopup
        isOpen={isReportStatusConfirmPopupOpen}
        onClose={closeReportStatusConfirmPopup}
        onConfirm={patchSelectedFileReportStatus}
        title="通報を解除しますか？"
        confirmButtonText="解除する"
      />

      <CompletedPopup
        isOpen={isReportStatusCompletedPopupOpen}
        onClose={closeReportStatusCompletedPopup}
        title="通報を解除しました"
      />

      <ConfirmPopup
        isOpen={isAiReportStatusConfirmPopupOpen}
        onClose={closeAiReportStatusConfirmPopup}
        onConfirm={patchSelectedFileAiReportStatus}
        title="AI通報を解除しますか？"
        confirmButtonText="解除する"
      />

      <CompletedPopup
        isOpen={isAiReportStatusCompletedPopupOpen}
        onClose={closeAiReportStatusCompletedPopup}
        title="AI通報を解除しました"
      />
    </>
  )
}

export default FilePage
