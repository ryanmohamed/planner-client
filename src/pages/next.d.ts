import type { NextComponentType, NextPageContext, NextLayoutComponentType, NextPage } from "next"
import type { AppProps } from 'next/app'
import { ReactNode } from "react"

// reates new types NextLayoutComponentType and AppLayoutProps that we can use in place of original types
declare module 'next' {
    type NextLayoutComponentType<P = {}> = NextComponentType<
        NextPageContext,
        any,
        P
    > & {
        getLayout?: (page: ReactNode) => ReactNode;
    }
}

declare module 'next/app' {
    type AppLayoutProps<P = {}> = AppProps & {
        Component: NextLayoutComponentType
    }
}