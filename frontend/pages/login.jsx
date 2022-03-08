
const Login = () => {
    return (
        <>
            <h1>Login Form</h1>
            <form>
                <div className="form-group">
                    <input type="text" name="email" id="email" placeholder="Your email address" />
                </div>
                <div className="form-group">
                    <input type="password" name="password" id="password" placeholder="Your password" />
                </div>
                <button type="submit">Log in</button>
            </form>
        </>
    )
}

export default Login