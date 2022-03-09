import { createContext, useContext, useState } from "react";
import axios from 'axios'

const loginURL = 'http://localhost:5000/api/users/login'

const authContext = createContext()

export const useAuth = () => useContext(authContext)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [loading, setLoading] = useState(false)

    const login = async (email, password) => {
        setLoading(true)
        /* try {
            const {data} = await axios.post(loginURL, { email, password })
            const fetchedUser = {id: data._id, firstName: data.firstName, lastName: data.lastName, email: data.email}
            setUser(fetchedUser)
            setIsLoggedIn(true)
            setLoading(false)
        } catch (error) {
            console.log(error)
        } */
        return axios.post(loginURL, {email, password})
        .then(res => {
            setLoading(false)
            const {data} = res
            setUser({id: data._id, firstName: data.firstName, lastName: data.lastName, email: data.email})
            setIsLoggedIn(true)
        })
        .catch(error => console.log(error))

    }

    const value = {
        user,
        login,
        loading,
        isLoggedIn
    }

    return (
        <authContext.Provider value={value}>
            {children}
        </authContext.Provider>
    )
}