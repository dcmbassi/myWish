import { createContext, useContext, useState } from "react";
import axios from 'axios'
import useLocalStorage from "../utils/useLocalStorage";

const loginURL = 'http://localhost:5000/api/users/login'
const checkURL = 'http://localhost:5000/api/users/check'

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

    const logout = () => {
        setIsLoggedIn(false)
        clearStoredUser()
        setUser(null)
    }

    const checkStoredUser = async () => {
        if (storedUser._id && !user) {

            const restoredUser = {id: storedUser._id, firstName: storedUser.firstName, lastName: storedUser.lastName, email: storedUser.email}
            const {data} = await axios.post(checkURL, {}, {headers:  {'Authorization': `Bearer ${storedUser.token}`}})
            if (data._id === restoredUser.id) {
                setUser(restoredUser)
                setIsLoggedIn(true)
                return true
            } else return false
        }
    }

    const value = {
        user,
        login,
        logout,
        checkStoredUser,
        loading,
        isLoggedIn,
    }

    return (
        <authContext.Provider value={value}>
            {children}
        </authContext.Provider>
    )
}