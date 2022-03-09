import { createContext, useContext, useState } from "react";
import axios from 'axios'
import useLocalStorage from "../utils/useLocalStorage";

const loginURL = 'http://localhost:5000/api/users/login'

const authContext = createContext()

export const useAuth = () => useContext(authContext)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [loading, setLoading] = useState(false)
    const [token, setToken, clearToken] = useLocalStorage('token')

    const login = async (email, password) => {
        setLoading(true)
        try {
            const {data} = await axios.post(loginURL, { email, password })
            const fetchedUser = {id: data._id, firstName: data.firstName, lastName: data.lastName, email: data.email}
            setUser(fetchedUser)
            setToken(data.token)
            setIsLoggedIn(true)
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    const value = {
        user,
        login,
        loading,
        isLoggedIn,
        token
    }

    return (
        <authContext.Provider value={value}>
            {children}
        </authContext.Provider>
    )
}