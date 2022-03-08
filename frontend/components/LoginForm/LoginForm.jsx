import { useState } from "react"
import { useRouter } from "next/router";
import { useAuth } from "../../context/authContext"

const LoginForm = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const router = useRouter()
    const {user, login} = useAuth()

    const handleLogin = (e) => {
        e.preventDefault()

        if (email && password) {
            login(email, password)
            setEmail('')
            setPassword('')
            router.push('/dashboard')
        }
    }

    return (
        <form onSubmit={handleLogin}>
            <div className="form-group">
                <input type="text" name="email" placeholder="Your email address" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
                <input type="password" name="password" placeholder="Your password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button type="submit">Log in</button>
        </form>
    )
}

export default LoginForm