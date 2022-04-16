import { createContext, useContext, useState } from "react";
import axios from 'axios'
import useLocalStorage from "../utils/useLocalStorage";

const loginURL = '/api/auth/login'
const logoutURL = '/api/auth/logout'


const authContext = createContext()

export const useAuth = () => useContext(authContext)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [loading, setLoading] = useState(false)
    const [storedUser, setStoredUser, clearStoredUser] = useLocalStorage('user')

    const login = async (email, password) => {
        setLoading(true)
        try {
            const {data} = await axios.post(loginURL, { email, password })
            const fetchedUser = {id: data._id, firstName: data.firstName, lastName: data.lastName, email: data.email}
            setUser(fetchedUser)
            setStoredUser(data)
            setIsLoggedIn(true)
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    const logout = async () => {
        await axios.post(logoutURL, {}, {headers: {Authorization: `Bearer ${token}`}})
        clearState()
    }
  
    const clearState = () => {
        setUser(null)
        setIsLoggedIn(false)
    }


    const value = {
        user,
        login,
        logout,
        loading,
        isLoggedIn,
    }

    return (
        <authContext.Provider value={value}>
            {children}
        </authContext.Provider>
    )
}