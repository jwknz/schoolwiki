import React from 'react'
import { GoogleLogin } from 'react-google-login'

function Login(props) {

    const onSuccess = (res) => {
        props.change(true)
        console.log("Login Successful - User: ", res.profileObj)
    }

    const onFailure = (res) => {
        props.change(false)
        console.log(`Login didn't work - ${res}`)
    }

    return (
        <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            buttonText={"Login"}
            onSuccess={onSuccess}
            onFailure={onFailure}
            cookiePolicy={"single_host_origin"}
            isSignedIn={true}
        />
    )
}

export default Login