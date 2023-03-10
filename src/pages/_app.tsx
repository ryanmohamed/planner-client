import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Navbar from '../../component/Navbar/Navbar'
import { FirebaseAppProvider } from '../../context/FirebaseAppProvider'
import { FirebaseUserProvider } from '../../context/FirebaseUserProvider'

export default function App({ Component, pageProps }: AppProps) {
  return <>
    <FirebaseAppProvider>
      <FirebaseUserProvider>
        <Navbar />
        <Component {...pageProps} />
      </FirebaseUserProvider>
    </FirebaseAppProvider>
  </>
}
