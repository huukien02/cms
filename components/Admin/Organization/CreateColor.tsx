import Button from '@/components/Button'
import {
  generateSecondaryColors,
  hexToRgb,
  hsbToRgb,
  hslToRgb,
  rgbToHex,
  rgbToHsb,
} from '@/lib/utils'
import { useEffect, useState } from 'react'
import { set } from 'react-hook-form'
import Styled from 'styled-components'

const BoxInputColor = Styled.div`
  width: 250px;
  display: flex;
  flex-direction: column;
`

const Input = Styled.input<{ hasError: boolean }>`
  width: 100%;
  height: 40px;
  border-radius: 5px;
  border: 1px solid #DADADD;
  margin-bottom: 8px;
  padding-left: 10px;
  ${(props) =>
    props.hasError &&
    `
    color: red;
    border-color: red;
  `}
`
interface ThemeFormValue {
  primary_color: string
  secondary_color: string
  tertiary_color: string
}

interface ThemeModalProps {
  setValue: React.Dispatch<React.SetStateAction<ThemeFormValue>>
  value: ThemeFormValue
  isOpen: boolean
  onClose: () => void
}

export const CreateColor: React.FC<ThemeModalProps> = ({
  setValue,
  value,
  isOpen,
  onClose,
}) => {
  const [isModalColor, setIsModalColor] = useState(false)
  const [isModalSecondColor, setIsModalSecondColor] = useState(false)
  const [isModalTertiaryColor, setIsModalTertiaryColor] = useState(false)

  const [isCustomColor, setIsCustomColor] = useState(false)

  const [hue, setHue] = useState(220)
  const [saturation, setSaturation] = useState(78)
  const [brightness, setBrightness] = useState(100)

  const [hexSecond, setHexSecond] = useState('#000000')
  const [hueSecond, setHueSecond] = useState(238)
  const [saturationSecond, setSaturationSecond] = useState(55)
  const [brightnessSecond, setBrightnessSecond] = useState(100)

  const [hexTertiary, setHexTertiary] = useState('#000000')
  const [hueTertiary, setHueTertiary] = useState(238)
  const [saturationTertiary, setSaturationTertiary] = useState(5)
  const [brightnessTertiary, setBrightnessTertiary] = useState(95)

  useEffect(() => {
    const { r, g, b } = hsbToRgb(hue, saturation, brightness)
    const hex = rgbToHex(r, g, b)
    const result = generateSecondaryColors(hex)
    if (result) {
      const { secondaryColor, tertiaryColor } = result
      setValue({
        ...value,
        primary_color: hex,
        secondary_color: secondaryColor,
        tertiary_color: tertiaryColor,
      })

      setHueSecond(hue)
      setHexSecond(secondaryColor)

      setHueTertiary(hue)
      setHexTertiary(tertiaryColor)
    }
  }, [hue, saturation, brightness, isCustomColor])

  useEffect(() => {
    const { r, g, b } = hsbToRgb(hueSecond, saturationSecond, brightnessSecond)
    const hexSecond = rgbToHex(r, g, b)
    setHexSecond(hexSecond)
  }, [hueSecond, saturationSecond, brightnessSecond])

  useEffect(() => {
    const { r, g, b } = hsbToRgb(
      hueTertiary,
      saturationTertiary,
      brightnessTertiary,
    )
    const hexTertiary = rgbToHex(r, g, b)
    setHexTertiary(hexTertiary)
  }, [hueTertiary, saturationTertiary, brightnessTertiary])

  useEffect(() => {
    if (isCustomColor) {
      setValue({
        ...value,
        secondary_color: hexSecond,
        tertiary_color: hexTertiary,
      })
    }
  }, [isCustomColor, hexSecond, hexTertiary])

  const handleConfirm = () => {
    onClose()
  }

  if (!isOpen) return null
  return (
    <div className="z-100 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative h-[620px] w-[480px] rounded-lg bg-white p-6">
        {/* Close Button */}
        <button
          className="absolute right-4 top-[-5px] text-[30px] text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        {/* Modal Header */}
        <h2 className="mb-4 text-center text-lg font-bold text-gray-800">
          カラーテーマの設定
        </h2>
        {/* Theme Selection */}
        <div className="mb-4 flex items-center justify-between">
          <label className="mb-2 block  text-sm font-bold text-gray-700">
            メインカラー
          </label>
          <button
            onClick={() => setIsCustomColor(!isCustomColor)}
            className="rounded border border-gray-300 px-2 text-[12px] text-gray-700"
            style={{
              backgroundColor: !isCustomColor ? 'white' : 'black',
              color: !isCustomColor ? 'black' : 'white',
            }}
          >
            詳細設定
          </button>
        </div>
        {/* Color Preview */}
        <div className="relative flex flex-col gap-5">
          <div
            className="flex flex-col gap-[10px] rounded-[10px]  p-[20px]"
            style={{
              backgroundColor: value.tertiary_color
                ? value.tertiary_color
                : '#E3EBF2',
            }}
          >
            {/* hexTertiary */}
            <p className="text-[12px]">メインカラー</p>
            <div>
              <BoxInputColor>
                <div className="align-center flex justify-center gap-[10px]">
                  <div
                    className="!h-[40px] min-w-[40px] cursor-pointer rounded border"
                    style={{ backgroundColor: value.primary_color ?? '' }}
                  />
                  <Input
                    className="input input-bordered w-[100px] !bg-[#FFFFFF]"
                    type="text"
                    placeholder="#4CAA9C"
                    value={value.primary_color ?? ''}
                    onClick={() => {
                      setIsModalColor(!isModalColor)
                      setIsModalSecondColor(false)
                      setIsModalTertiaryColor(false)
                    }}
                    hasError={false}
                  />
                </div>
              </BoxInputColor>
            </div>
            <p className="text-[12px]">
              ボタンやアイコンなど、アプリのメインカラーとして使用します
            </p>
          </div>
          {isModalColor && (
            <div className="absolute left-[50%] top-[150%] z-50 w-[320px] translate-x-[-50%]  translate-y-[-50%] space-y-4 rounded-lg bg-white p-4 shadow-lg">
              {/* HUE */}
              <div className="space-y-1">
                <label
                  htmlFor="hue-slider"
                  className="block text-sm font-medium text-gray-700"
                >
                  色相 (H)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    id="hue-slider"
                    type="range"
                    min="0"
                    max="360"
                    value={hue}
                    onChange={(e) => setHue(parseInt(e.target.value))}
                    className="thumb-white h-3 w-full appearance-none rounded-lg bg-gradient-to-r from-red-500 via-blue-500 via-green-500 via-yellow-500 to-pink-500"
                    style={{
                      background:
                        'linear-gradient(to right, #FF0000, #FF9900, #FFFF00, #00FF00, #00FFFF, #0000FF, #9900FF, #FF00FF, #FF0000)',
                    }}
                  />
                  <span className="w-12 text-right">{hue}°</span>
                </div>
              </div>

              {/* SATURATION */}
              <div className="space-y-1">
                <label
                  htmlFor="saturation-slider"
                  className="block text-sm font-medium text-gray-700"
                >
                  彩度 (S)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    id="saturation-slider"
                    type="range"
                    min="0"
                    max="100"
                    value={saturation}
                    onChange={(e) => setSaturation(parseInt(e.target.value))}
                    className="thumb-white h-3 w-full appearance-none rounded-lg"
                    style={{
                      background: `linear-gradient(to right, rgb(204,204,204), ${hslToRgb(hue, 100, 50)})`,
                    }}
                  />
                  <span className="w-12 text-right">{saturation}%</span>
                </div>
              </div>

              {/* BRIGHTNESS */}
              <div className="space-y-1">
                <label
                  htmlFor="brightness-slider"
                  className="block text-sm font-medium text-gray-700"
                >
                  明度 (B)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    id="brightness-slider"
                    type="range"
                    min="0"
                    max="100"
                    value={brightness}
                    onChange={(e) => setBrightness(parseInt(e.target.value))}
                    className="thumb-white h-3 w-full appearance-none rounded-lg"
                    style={{
                      background: `linear-gradient(to right, rgb(0,0,0), ${hslToRgb(hue, saturation, 50)})`,
                    }}
                  />
                  <span className="w-12 text-right">{brightness}%</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {!isCustomColor && (
          <div className="mt-[10px] flex gap-5 text-[12px] text-[#666666]">
            <div className="flex items-center gap-2">
              <button
                className="h-[15px] w-[15px] rounded-[2px] bg-[#377BFF]"
                style={{ backgroundColor: value.secondary_color ?? '' }}
              ></button>
              <p className="text-[12px]">
                サブカラー {value.secondary_color.toLocaleUpperCase()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="h-[15px] w-[15px] rounded-[2px] bg-[#377BFF]"
                style={{ backgroundColor: value.tertiary_color ?? '' }}
              ></button>
              <p className="text-[12px]">
                背景色 {value.tertiary_color.toLocaleUpperCase()}
              </p>
            </div>
          </div>
        )}

        {/* Custom second Color */}
        {isCustomColor && (
          <div>
            <div className="relative mt-[20px] flex justify-between gap-[5px]">
              <BoxInputColor>
                <div className="align-center flex justify-center gap-[10px]">
                  <div
                    className="!h-[40px] min-w-[40px] cursor-pointer rounded border"
                    style={{ backgroundColor: hexSecond ?? '' }}
                  />
                  <Input
                    className="input input-bordered !w-[200px] !bg-[#FFFFFF]"
                    type="text"
                    placeholder="#4CAA9C"
                    value={hexSecond ?? ''}
                    onClick={() => {
                      setIsModalSecondColor(!isModalSecondColor)
                      setIsModalColor(false)
                      setIsModalTertiaryColor(false)
                    }}
                    hasError={false}
                  />
                </div>
              </BoxInputColor>
              <span className="text-[12px]">
                メインカラーを補完する役割で使用します
              </span>
              {isModalSecondColor && (
                <div className="absolute left-[50%] top-[50px] z-50 w-[320px] translate-x-[-50%] space-y-4 rounded-lg bg-white p-4 shadow-lg">
                  {/* HUE */}
                  <div className="space-y-1">
                    <label
                      htmlFor="hue-slider"
                      className="block text-sm font-medium text-gray-700"
                    >
                      色相 (H)
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        id="hue-slider"
                        type="range"
                        min="0"
                        max="360"
                        value={hueSecond}
                        onChange={(e) => setHueSecond(parseInt(e.target.value))}
                        className="thumb-white h-3 w-full appearance-none rounded-lg bg-gradient-to-r from-red-500 via-blue-500 via-green-500 via-yellow-500 to-pink-500"
                        style={{
                          background:
                            'linear-gradient(to right, #FF0000, #FF9900, #FFFF00, #00FF00, #00FFFF, #0000FF, #9900FF, #FF00FF, #FF0000)',
                        }}
                      />
                      <span className="w-12 text-right">{hueSecond}°</span>
                    </div>
                  </div>

                  {/* SATURATION */}
                  <div className="space-y-1">
                    <label
                      htmlFor="saturation-slider"
                      className="block text-sm font-medium text-gray-700"
                    >
                      彩度 (S)
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        id="saturation-slider"
                        type="range"
                        min="0"
                        max="100"
                        value={saturationSecond}
                        onChange={(e) =>
                          setSaturationSecond(parseInt(e.target.value))
                        }
                        className="thumb-white h-3 w-full appearance-none rounded-lg"
                        style={{
                          background: `linear-gradient(to right, rgb(204,204,204), ${hslToRgb(hueSecond, 100, 50)})`,
                        }}
                      />
                      <span className="w-12 text-right">
                        {saturationSecond}%
                      </span>
                    </div>
                  </div>

                  {/* BRIGHTNESS */}
                  <div className="space-y-1">
                    <label
                      htmlFor="brightness-slider"
                      className="block text-sm font-medium text-gray-700"
                    >
                      明度 (B)
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        id="brightness-slider"
                        type="range"
                        min="0"
                        max="100"
                        value={brightnessSecond}
                        onChange={(e) =>
                          setBrightnessSecond(parseInt(e.target.value))
                        }
                        className="thumb-white h-3 w-full appearance-none rounded-lg"
                        style={{
                          background: `linear-gradient(to right, rgb(0,0,0), ${hslToRgb(hueSecond, saturationSecond, 50)})`,
                        }}
                      />
                      <span className="w-12 text-right">
                        {brightnessSecond}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="relative mt-[20px] flex gap-[5px]">
              <BoxInputColor>
                <div className="align-center flex justify-center gap-[10px]">
                  <div
                    className="!h-[40px] min-w-[40px] cursor-pointer rounded border"
                    style={{ backgroundColor: hexTertiary ?? '' }}
                  />
                  <Input
                    className="input input-bordered !bg-[#FFFFFF]"
                    type="text"
                    placeholder="#4CAA9C"
                    value={hexTertiary ?? ''}
                    onClick={() => {
                      setIsModalTertiaryColor(!isModalTertiaryColor)
                      setIsModalSecondColor(false)
                      setIsModalColor(false)
                    }}
                    hasError={false}
                  />
                </div>
              </BoxInputColor>
              <span className="text-[12px]">
                背景や非活性ボタンに使用します
              </span>
              {isModalTertiaryColor && (
                <div className="absolute left-[50%] top-[50px] z-50 w-[320px] translate-x-[-50%] space-y-4 rounded-lg bg-white p-4 shadow-lg">
                  {/* HUE */}
                  <div className="space-y-1">
                    <label
                      htmlFor="hue-slider"
                      className="block text-sm font-medium text-gray-700"
                    >
                      色相 (H)
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        id="hue-slider"
                        type="range"
                        min="0"
                        max="360"
                        value={hueTertiary}
                        onChange={(e) =>
                          setHueTertiary(parseInt(e.target.value))
                        }
                        className="thumb-white h-3 w-full appearance-none rounded-lg bg-gradient-to-r from-red-500 via-blue-500 via-green-500 via-yellow-500 to-pink-500"
                        style={{
                          background:
                            'linear-gradient(to right, #FF0000, #FF9900, #FFFF00, #00FF00, #00FFFF, #0000FF, #9900FF, #FF00FF, #FF0000)',
                        }}
                      />
                      <span className="w-12 text-right">{hueSecond}°</span>
                    </div>
                  </div>

                  {/* SATURATION */}
                  <div className="space-y-1">
                    <label
                      htmlFor="saturation-slider"
                      className="block text-sm font-medium text-gray-700"
                    >
                      彩度 (S)
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        id="saturation-slider"
                        type="range"
                        min="0"
                        max="100"
                        value={saturationTertiary}
                        onChange={(e) =>
                          setSaturationTertiary(parseInt(e.target.value))
                        }
                        className="thumb-white h-3 w-full appearance-none rounded-lg"
                        style={{
                          background: `linear-gradient(to right, rgb(204,204,204), ${hslToRgb(hueTertiary, 100, 50)})`,
                        }}
                      />
                      <span className="w-12 text-right">
                        {saturationTertiary}%
                      </span>
                    </div>
                  </div>

                  {/* BRIGHTNESS */}
                  <div className="space-y-1">
                    <label
                      htmlFor="brightness-slider"
                      className="block text-sm font-medium text-gray-700"
                    >
                      明度 (B)
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        id="brightness-slider"
                        type="range"
                        min="0"
                        max="100"
                        value={brightnessTertiary}
                        onChange={(e) =>
                          setBrightnessTertiary(parseInt(e.target.value))
                        }
                        className="thumb-white h-3 w-full appearance-none rounded-lg"
                        style={{
                          background: `linear-gradient(to right, rgb(0,0,0), ${hslToRgb(hueTertiary, saturationTertiary, 50)})`,
                        }}
                      />
                      <span className="w-12 text-right">
                        {brightnessTertiary}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-[100px] flex w-full flex-col items-center justify-center gap-[10px]">
          <button
            className="h-[45px] w-[220px] rounded-[8px] border px-[10px] text-[14px] font-[600] text-white"
            style={{ backgroundColor: value.primary_color || '#4B79F7' }}
            onClick={handleConfirm}
          >
            設定を保存
          </button>
          <Button
            w="w-[220px]"
            h="h-[45px]"
            color={'text-[gray]'}
            borderColor={'text-[#FFFFFF]'}
            onClick={onClose}
          >
            キャンセル
          </Button>
        </div>
      </div>
    </div>
  )
}
