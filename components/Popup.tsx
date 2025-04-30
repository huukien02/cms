import React, { ReactNode } from 'react'
interface PopupProps {
  isOpen: boolean
  onClose: () => void
  title: string
  content: ReactNode
}
export default function Popup({ isOpen, onClose, title, content }: PopupProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-xl text-gray-500 hover:text-red-500"
          >
            &times;
          </button>
        </div>
        <div className="text-gray-700">{content}</div>
      </div>
    </div>
  )
}
