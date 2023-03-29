import '@/styles/globals.css'
import Navbar from '../../component/Navbar/Navbar'
import { FirebaseAppProvider } from '../../context/FirebaseAppProvider'
import { FirebaseUserProvider } from '../../context/FirebaseUserProvider'

import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { FirebaseFirestoreProvider } from '../../context/FirebaseFirestoreProvider'

import '@smastrom/react-rating/style.css';

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
        <FirebaseFirestoreProvider>
        <Navbar />
        { Component.getLayout ? getLayout(<Component {...pageProps} />) : <Component {...pageProps} /> }
        </FirebaseFirestoreProvider>
      </FirebaseUserProvider>
    </FirebaseAppProvider>
  </>
}

export default App