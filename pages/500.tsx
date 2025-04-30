import Link from 'next/link'
import Styled from 'styled-components'

const Container = Styled.div`
  height: calc(100vh - 104px);
`

const Content = Styled.div`
  text-align: center;
  margin-top: 100px;
`
const Img = Styled.img`
  width: 40px;
  margin-bottom: 17px;
  display: inline;
`

const H1 = Styled.h1`
  color: #4a79f7;
  font-size: 62px;
  height: auto;
  line-height: 62px;
`

const H2 = Styled.h2`
  color: #4a79f7;
  font-size: 25px;
  margin-bottom: 41px;
`

const H3 = Styled.h3`
  color: #4a79f7;
  font-size: 20px;
`

const Custom500 = () => {
  return (
    <Container>
      <Content>
        <Img src="/image/logo/logo1@2x.png" alt="500" width={24} />
        <H1>500</H1>
        <H2>Internal Server Error</H2>
        <H3>エラーが発生しています</H3>
      </Content>
    </Container>
  )
}

export default Custom500
