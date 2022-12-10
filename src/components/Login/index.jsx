import React from "react";
import './style.css';
import Api from "../../Api";

const Login = ({ onRecieve }) => {
    const handleFacebookLogin = async () => {
        let result = await Api.fbPopup();
        if (result) {
            onRecieve(result.user);
        } else {
            alert('erro');
        }
    }

    return (
        <div className="login">
            <button onClick={handleFacebookLogin}>Logar com Facebook</button>
        </div>
    );
}

export default Login;