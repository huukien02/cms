import Button from '@/components/Button'
import Checkbox from '@/components/common/Checkbox'
import Image from 'next/image'
import React from 'react'
import styled from 'styled-components'

const Input = styled.input<{ hasError: boolean }>`
  width: 100%;
  height: 40px;
  border-radius: 5px;
  border: 1px solid #dadadd;
  margin-bottom: 8px;
  padding-left: 10px;
  ${(props) =>
    props.hasError &&
    `
    color: red;
    border-color: red;
  `}
`

const AccountInfo = styled.div`
  display: flex;
  align-items: center;
  width: 90%;
`

const AccountNumber = styled.p`
  color: #a0a0a0;
`

const ActionGroup = styled.div`
  display: flex;
  gap: 10px;
`

interface NoteItemProps {
  index: number
  itemName: string
  isPullDownNote: string
  listNote: string[]
  onChange: (
    index: number,
    data: { f_name?: string; f_type?: string; f_options?: string[] },
  ) => void
  onDelete: () => void
}

export default function NoteItem({
  index,
  itemName,
  isPullDownNote,
  listNote,
  onChange,
  onDelete,
}: NoteItemProps) {
  const handleInputChange = (optionIndex: number, value: string) => {
    const updatedList = [...listNote]
    updatedList[optionIndex] = value
    onChange(index, { f_options: updatedList })
  }

  const handleAddOption = () => {
    onChange(index, { f_options: [...listNote, ''] })
  }

  const handleDeleteOption = (optionIndex: number) => {
    const updatedList = listNote.filter((_, i) => i !== optionIndex)
    onChange(index, { f_options: updatedList })
  }

  return (
    <div className="flex w-full gap-[20px]">
      <div className="flex w-[90%] flex-col gap-[10px] border-r border-[#DADADD] pr-[20px]">
        <div className="flex items-start">
          <p className="w-[100px] text-[14px] font-[600] text-[#2A323C]">
            項目名
          </p>
          <Input
            className="input input-bordered w-full !bg-[#FFFFFF]"
            type="text"
            value={itemName}
            onChange={(e) => onChange(index, { f_name: e.target.value })}
            maxLength={255}
            hasError={false}
            placeholder="入力してください"
          />
        </div>
        <div className="flex items-start">
          <p className="w-[100px] text-[14px] font-[600] text-[#2A323C]">
            項目種類
          </p>
          <div className="flex gap-[10px]">
            <Checkbox
              onChange={() => onChange(index, { f_type: 'text' })}
              checked={isPullDownNote == 'text'}
              label="テキスト入力"
            />
            <Checkbox
              onChange={() => onChange(index, { f_type: 'pulldown' })}
              checked={isPullDownNote == 'pulldown'}
              label="プルダウン"
            />
          </div>
        </div>

        {isPullDownNote == 'pulldown' && (
          <div className="flex flex-col gap-[15px]">
            {listNote && listNote.length > 0 ? (
              listNote.map((note, optionIndex) => (
                <div key={optionIndex} className="flex items-start gap-[15px]">
                  <AccountInfo>
                    <AccountNumber>{optionIndex + 1}</AccountNumber>
                    <Input
                      className="input input-bordered ml-[10px] w-full !bg-[#FFFFFF]"
                      type="text"
                      value={note}
                      onChange={(e) =>
                        handleInputChange(optionIndex, e.target.value)
                      }
                      maxLength={255}
                      hasError={false}
                      placeholder=""
                    />
                  </AccountInfo>
                  <ActionGroup>
                    <Button
                      w="w-[40px]"
                      h="h-[40px]"
                      borderColor="border-[#D926A9]"
                      onClick={() => handleDeleteOption(optionIndex)}
                    >
                      <Image
                        src="/image/icons/ic-delete.png"
                        alt="Delete Icon"
                        width={24}
                        height={24}
                      />
                    </Button>
                    <Button
                      w="w-[40px]"
                      h="h-[40px]"
                      borderColor="border-[#1FB2A6]"
                      onClick={handleAddOption}
                    >
                      <Image
                        src="/image/icons/ic-plus.png"
                        alt="Add Icon"
                        width={24}
                        height={24}
                      />
                    </Button>
                  </ActionGroup>
                </div>
              ))
            ) : (
              <Button
                w="w-[40px]"
                h="h-[40px]"
                borderColor="border-[#1FB2A6]"
                onClick={handleAddOption}
              >
                <Image
                  src="/image/icons/ic-plus.png"
                  alt="Add Icon"
                  width={24}
                  height={24}
                />
              </Button>
            )}
          </div>
        )}
      </div>
      <div>
        <Button
          w="w-[64px]"
          h="h-[40px]"
          color="text-[#D926A9]"
          borderColor="border-[#D926A9]"
          onClick={onDelete}
        >
          削除
        </Button>
      </div>
    </div>
  )
}
