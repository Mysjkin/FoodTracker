import React, {useState} from "react";
import KeyIcon from "./resources/key_icon.svg";
import './style.scss';
import {useContext} from "react";
import {useHistory} from "react-router-dom";
import {AuthContext} from "./authentication/authProvider";
import {FirebaseLogin as Authenticate} from "./authentication/firebaseAuth";

export function Login(props) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const authContext = useContext(AuthContext);
  const history = useHistory();

  const onSubmit = (e, email, password) => {
    try {
      let credential = await Authenticate(email, password);
      authContext.setUser(credential);
      history.push("/");
    }
    catch(error) {
        console.log(error.message)
        alert(error.message);
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
                onClick={(e) => onSubmit(e, email, password)}>
            Sign In
        </button>
      </div>
    </div>
  );
}