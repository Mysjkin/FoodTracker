import React, {useState} from "react";
import KeyIcon from "./resources/key_icon.svg";
import './style.scss';
import {useContext} from "react";
import {useHistory} from "react-router-dom";
import {AuthContext} from "./authentication/authProvider";
import {FirebaseSignup as Register} from "./authentication/firebaseAuth";

export function SignUp(props) {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const authContext = useContext(AuthContext);
  const history = useHistory();

  const onSubmit = (e, username, email, password) => {
    try {
        let credential = await Register(username, email, password);
        authContext.setUser(credential);
        history.push("/");
    }
    catch(error) {
        console.log(error.message)
        alert(error.message);
        setUsername("");
        setEmail("");
        setPassword("");
    };
  }

  return (
    <div className="base-container">
      <div className="content">
        <div className="image">
          <img src={KeyIcon} />
        </div>
        <div className="form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" 
                   name="username" 
                   placeholder="Username"
                   value={username}
                   onChange={(e) => setUsername(e.target.value)}/>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="text" 
                   name="email" 
                   placeholder="Email"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}/>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" 
                   name="password" 
                   placeholder="Password"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}/>
          </div>
        </div>
      </div>
      <div className="footer">
        <button type="button" 
                className="btn" 
                onClick={(e) => onSubmit(e, username, email, password)}>
          Sign Up
        </button>
      </div>
    </div>
  );
}