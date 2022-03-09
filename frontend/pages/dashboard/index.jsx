import { useAuth } from "../../context/authContext"

const index = () => {
  const {user} = useAuth()
  return (
    <>
        <h1>Dashboard</h1>
        <p>{`Welcome, ${user.firstName} ${user.lastName}`}</p>
    </>
  )
}

export default index