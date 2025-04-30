import CommonOutlineAccentButton from '@/components/common/Button/OutlineAccentButton'
import React from 'react'
import Styled from 'styled-components'
import { User } from '@/types'

const FileDetail = Styled.div`
  margin: 10px 0;
  position: relative;
`

const H1 = Styled.h1`
  border-bottom: 1px solid #000;
  margin-bottom: 30px;
  padding-bottom: 30px;
`

const Table = Styled.table`
  width: 100%;
  border-collapse: collapse;
`

const Tr = Styled.tr`
  height: 58px;
`

const Th = Styled.th`
  whitespace-nowrap
  border: 1px solid #000;
  padding: 8px;
`

const Td = Styled.td`
  whitespace-nowrap
  py-4
  border: 1px solid #000;
  padding: 8px;
`

const CommonSubmitButtonContainer = Styled.div`
  position: absolute;
  top: -60px;
  right: 0;
`

interface FileDetailProps {
  user: User
  status: any
  openPopupConfirm: () => void
  statusText: string
}

const FileDetailComponent: React.FC<FileDetailProps> = ({
  user,
  status,
  openPopupConfirm,
  statusText,
}) => (
  <FileDetail>
    <div
      className="border-b border-gray-200 shadow"
      style={{ overflow: 'auto' }}
    >
      <Table className="divide-y divide-gray-300 table-auto">
        <tbody className="bg-white divide-y divide-gray-300">
          <Tr>
            <Th className="py-2 px-6 text-xs text-gray-500 bg-gray-50">
              ユーザID
            </Th>
            <Td className="py-4 px-6">{user.hashed_id}</Td>
          </Tr>
          <Tr>
            <Th className="py-2 px-6 text-xs text-gray-500 bg-gray-50">
              メールアドレス
            </Th>
            <Td className="py-4 px-6">{user.email}</Td>
          </Tr>
          <Tr>
            <Th className="py-2 px-6 text-xs text-gray-500 bg-gray-50">氏名</Th>
            <Td className="py-4 px-6">
              {user.last_name + '  ' + user.first_name}
            </Td>
          </Tr>
          <Tr>
            <Th className="py-2 px-6 text-xs text-gray-500 bg-gray-50">
              会社名
            </Th>
            <Td className="py-4 px-6">{user.company}</Td>
          </Tr>
          <Tr>
            <Th className="py-2 px-6 text-xs text-gray-500 bg-gray-50">所属</Th>
            <Td className="py-4 px-6">{user.affiliation}</Td>
          </Tr>
          <Tr>
            <Th className="py-2 px-6 text-xs text-gray-500 bg-gray-50">
              利用開始日
            </Th>
            <Td className="py-4 px-6">{user.started_at}</Td>
          </Tr>
          <Tr>
            <Th className="py-2 px-6 text-xs text-gray-500 bg-gray-50">
              会員ステータス
            </Th>
            <Td className="py-4 px-6">{statusText}</Td>
          </Tr>
        </tbody>
      </Table>
    </div>
    {!status.isAuto && (
      <CommonSubmitButtonContainer>
        <CommonOutlineAccentButton onClick={openPopupConfirm}>
          {user.deactivation === 0 ? '無効に変更' : '有効に変更'}
        </CommonOutlineAccentButton>
      </CommonSubmitButtonContainer>
    )}
  </FileDetail>
)

export default FileDetailComponent
