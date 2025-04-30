const formatDate = (base_date: string) => {
  try {
    const date = new Date(base_date)
    if (isNaN(date.getTime())) {
      return 'Invalid Date'
    }

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid Date'
  }
}

export default formatDate
