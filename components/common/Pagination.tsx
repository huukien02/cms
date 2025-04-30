import React from 'react'
import Styled from 'styled-components'

const PagingButton = Styled.button`
  background: none;
  border: none;
`

const PagingContainer = Styled.div`
  margin-top: 10px;
  text-align: center;
  span {
    margin: 0 5px;
  }
`

const Leader = Styled.span`
  vertical-align: text-bottom;
`

interface PaginationProps {
  currentPage: number
  lastPage: number
  onPageChange: (page: number) => void
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  lastPage,
  onPageChange,
}) => {
  if (lastPage === 1) {
    return null
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < lastPage) {
      onPageChange(currentPage + 1)
    }
  }

  const handlePageClick = (page: number) => {
    onPageChange(page)
  }

  const renderPageLinks = () => {
    const pageLinks = []

    if (lastPage < 5) {
      for (let i = 1; i <= lastPage; i++) {
        pageLinks.push(
          <span
            key={i}
            onClick={() => handlePageClick(i)}
            style={{
              cursor: 'pointer',
              textDecoration: currentPage === i ? 'underline' : 'none',
            }}
          >
            {i}
          </span>
        )
      }
    } else {
      pageLinks.push(
        <span
          key={1}
          onClick={() => handlePageClick(1)}
          style={{
            cursor: 'pointer',
            textDecoration: currentPage === 1 ? 'underline' : 'none',
          }}
        >
          1
        </span>
      )

      if (currentPage > 3) {
        pageLinks.push(ellipsis)
      }

      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        if (i > 1 && i < lastPage) {
          pageLinks.push(
            <span
              key={i}
              onClick={() => handlePageClick(i)}
              style={{
                cursor: 'pointer',
                textDecoration: currentPage === i ? 'underline' : 'none',
              }}
            >
              {i}
            </span>
          )
        }
      }

      if (currentPage < lastPage - 2) {
        pageLinks.push(ellipsis)
      }

      pageLinks.push(
        <span
          key={lastPage}
          onClick={() => handlePageClick(lastPage)}
          style={{
            cursor: 'pointer',
            textDecoration: currentPage === lastPage ? 'underline' : 'none',
          }}
        >
          {lastPage}
        </span>
      )
    }

    return pageLinks
  }

  const ellipsis = <Leader key="ellipsis">...</Leader>

  return (
    <PagingContainer>
      <PagingButton onClick={handlePrevPage} disabled={currentPage === 1}>
        ＜前へ
      </PagingButton>
      {renderPageLinks()}
      <PagingButton
        onClick={handleNextPage}
        disabled={currentPage === lastPage}
      >
        次へ＞
      </PagingButton>
    </PagingContainer>
  )
}

export default Pagination
