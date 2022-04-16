import { createContext, useContext, useState } from "react";
import axios from 'axios'
import useLocalStorage from "../utils/useLocalStorage";

const loginURL = '/api/auth/login'
const logoutURL = '/api/auth/logout'
const refreshURL = '/api/auth/refresh'


const authContext = createContext()

export const useAuth = () => useContext(authContext)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [tokenLife, setTokenLife] = useState(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [loading, setLoading] = useState(false)
    const [storedUser, setStoredUser, clearStoredUser] = useLocalStorage('user')

    // Use localStorage the way it's usually done
    const login = async (email, password) => {
        setLoading(true)
        try {
            const {data} = await axios.post(loginURL, { email, password })
            const fetchedUser = {id: data._id, firstName: data.firstName, lastName: data.lastName, email: data.email}
            setToken(data.token)
            setTokenLife(data.tokenLife)
            console.log(data.tokenLife)
            setUser(fetchedUser)
            setStoredUser(data)
            setIsLoggedIn(true)
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    // Revert to a regular logout pattern
    const logout = async () => {
        await axios.post(logoutURL, {}, {headers: {Authorization: `Bearer ${token}`}})
        clearState()
    }

    const refreshAccess = async () => {
        try {
            const {data} = await axios.post(refreshURL, {}, {
                withCredentials: true,
                headers: {
                    'Access-Control-Allow-Origin': 'localhost:3000',
                    'Content-Type': 'application/json',
                }
            
            })
            const fetchedUser = {id: data._id, firstName: data.firstName, lastName: data.lastName, email: data.email}
            setToken(data.token)
            setTokenLife(data.tokenLife)
            setUser(fetchedUser)
            setStoredUser(data)
            setIsLoggedIn(true)

            // Silent refresh
            setTimeout(() => {
                refreshAccess()
            }, tokenLife - 500);
        } catch (error) {
            console.log(error)
        }
    }

    const clearState = () => {
        setUser(null)
        setToken(null)
        setTokenLife(null)
        setIsLoggedIn(false)
    }


    const value = {
        user,
        login,
        logout,
        refreshAccess,
        loading,
        isLoggedIn,
    }

    return (
        <authContext.Provider value={value}>
            {children}
        </authContext.Provider>
    )
}