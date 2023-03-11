import '@/styles/globals.css'
import Navbar from '../../component/Navbar/Navbar'
import { FirebaseAppProvider } from '../../context/FirebaseAppProvider'
import { FirebaseUserProvider } from '../../context/FirebaseUserProvider'

import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const App = ({Component, pageProps}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page: ReactNode) => page)
  return <>
    <FirebaseAppProvider>
      <FirebaseUserProvider>
        <Navbar />
          { Component.getLayout ? getLayout(<Component {...pageProps} />) : <Component {...pageProps} /> }
      </FirebaseUserProvider>
    </FirebaseAppProvider>
  </>
}

export default App