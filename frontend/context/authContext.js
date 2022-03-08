import { createContext, useContext, useState } from "react";

const authContext = createContext()

export const useAuth = () => useContext(authContext)

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState({})

    const login = (email, password) => {
        setUser({email, password})
    }

    const value = {
        user,
        login
    }

    return (
        <authContext.Provider value={value}>
            {children}
        </authContext.Provider>
    )
}