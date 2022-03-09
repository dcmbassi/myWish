import { useState, useEffect } from "react";

const PREFIX = 'genie-next-client'

const useLocalStorage = (key, initialValue) => {
    const prefixedKey = PREFIX + key

    const [value, setValue] = useState(() => {
        let jsonValue
        if (typeof window !== 'undefined') {
            jsonValue = localStorage.getItem(prefixedKey)
            if (jsonValue) return jsonValue
            if (typeof initialValue === 'function') return initialValue()
            else return initialValue
        }
    })

    const clearValue = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(prefixedKey)
        }
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(prefixedKey, JSON.stringify(value))
        }
    }, [prefixedKey, value])

    return [value, setValue, clearValue]
}

export default useLocalStorage