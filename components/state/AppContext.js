import React, { createContext, useContext, useState } from 'react'

const AppContext = createContext()

export const useAppContext = () => useContext(AppContext)

export const AppProvider = ({ children }) => {
  const [isLogoutPopup, setIsLogoutPopup] = useState(false)
  const [showUpdateNoticeSuccessPopup, setShowUpdateNoticeSuccessPopup] =
    useState(false)
  const [hashedId, setHashedId] = useState('')
  const [checkedItems, setCheckedItems] = useState('')
  const [ticketTotal, setTicketTotal] = useState('')

  return (
    <AppContext.Provider
      value={{
        isLogoutPopup,
        setIsLogoutPopup,
        showUpdateNoticeSuccessPopup,
        setShowUpdateNoticeSuccessPopup,
        hashedId,
        setHashedId,
        checkedItems,
        setCheckedItems,
        ticketTotal,
        setTicketTotal,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
