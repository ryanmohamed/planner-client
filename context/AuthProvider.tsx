// import { getAuth } from "firebase/auth"
// import React, { useState, createContext, useEffect } from "react"

// const AuthContext = createContext({})

// export const AuthProvider = ({children} : any) => {
//     const [ auth, setAuth ] = useState(getAuth(app))

//     const authStateChanged = async (state : any) => {
//         console.log(state?.auth, "berserk")
//         setAuth(state?.auth)
//     }

//     useEffect(() => {
//         const unsubscribe = auth.onAuthStateChanged(authStateChanged)
//         return () => unsubscribe()
//     }, [])

//     return (
//         <AuthContext.Provider value={{ auth, setAuth }}>
//             {children}
//         </AuthContext.Provider>
//     )
// }

// export default AuthContext
