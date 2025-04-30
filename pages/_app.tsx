import '@/styles/globals.css'
import '../public/styles/styles.css'
import { AppProps } from 'next/app'
import Head from 'next/head'
import LoginLayout from '@/components/LoginLayout'
import MainLayout from '@/components/MainLayout'
import HeaderMainLayout from '@/components/HeaderMainLayout'
import { AppProvider } from '@/components/state/AppContext'
import MainLayoutAdmin from '@/components/MainLayoutAdmin'

export default function App({ Component, pageProps, router }: AppProps) {
  const isAdminLoginPage = router.pathname === '/system-admins-login'
  const isLoginPage = router.asPath.includes('/login')
  const isSystemAdminRoute = router.asPath.includes('/system-admin')
  const is404Error = router.pathname.startsWith('/404')
  const is500Error = router.pathname.startsWith('/500')

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>{'ロケトラ'}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon/favicon.ico" />
      </Head>

      {isAdminLoginPage ? (
        <AppProvider>
          <LoginLayout>
            <Component {...pageProps} />
          </LoginLayout>
        </AppProvider>
      ) : isLoginPage ? (
        <AppProvider>
          <LoginLayout>
            <Component {...pageProps} />
          </LoginLayout>
        </AppProvider>
      ) : is404Error || is500Error ? (
        <AppProvider>
          <HeaderMainLayout>
            <Component {...pageProps} />
          </HeaderMainLayout>
        </AppProvider>
      ) : (
        <AppProvider>
          {isSystemAdminRoute ? (
            <MainLayoutAdmin>
              <Component {...pageProps} />
            </MainLayoutAdmin>
          ) : (
            <MainLayout>
              <Component {...pageProps} />
            </MainLayout>
          )}
        </AppProvider>
      )}
    </>
  )
}
