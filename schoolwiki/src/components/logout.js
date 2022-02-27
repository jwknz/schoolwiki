import React from 'react'
import { GoogleLogout } from 'react-google-login'

function Logout(props) {

    const onSuccess = (res) => {
        props.change(false)
        console.log(`Logout Successful`)
    }

    const onFailure = () => {
        console.log("Hello")
    }

    return (
        <GoogleLogout
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            buttonText={`Logout`}
            onSuccess={onSuccess}
            onFailure={onFailure}
        />
    )
}

export default Logout