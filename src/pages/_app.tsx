import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { FirebaseAppProvider } from '../../context/FirebaseAppProvider'
import { FirebaseUserProvider } from '../../context/FirebaseUserProvider'

export default function App({ Component, pageProps }: AppProps) {
  return <>
    <FirebaseAppProvider>
      <FirebaseUserProvider>
        <Component {...pageProps} />
      </FirebaseUserProvider>
    </FirebaseAppProvider>
  </>
}
