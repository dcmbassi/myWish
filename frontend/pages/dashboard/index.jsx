import { useRouter } from "next/router"
import { useEffect } from "react"
import { useAuth } from "../../context/authContext"

const Dashboard = () => {
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) router.push('/login')
  }, [user])
  
  return (
    <>
      <h1>Dashboard</h1>
      {user && (<p>Welcome, {user.firstName} {user.lastName}</p>)}
      <hr />
      <button onClick={() =>logout()}>Log out</button>
    </>
  )
}

export default Dashboard