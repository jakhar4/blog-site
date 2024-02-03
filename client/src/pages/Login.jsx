import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/userContext.js";

const LoginPage = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState('')
  const Navigate = useNavigate();
  const {setCurrentUser} = useContext(UserContext);
  
  const changeInputHandler = (e) => {
    setUserData(prevState => {
      return {...prevState, [e.target.name]:e.target.value}
    })
  }
  
  const loginUser = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/login`, userData)
      const user = response.data;
      console.log(user)
      setCurrentUser(user)
      if(!user){
        setError("Try again didn't able to login")
      }
      Navigate('/')

    } catch (err) {
      if(err){
        setError(err.response.data.message)
      }
    }
  }



  return (
    <section className="login">
      <div className="container">
        <h2>Sign In</h2>
        <form className="form login__form" onSubmit={loginUser}>
          {error && <p className="form__error-message"> {error} </p>}
          <input
            type="text"
            name="email"
            placeholder="Email address"
            onChange={changeInputHandler}
            value={userData.email}
            autoFocus
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={changeInputHandler}
            value={userData.password}
          />
          <button type="submit" className="btn primary">Log in</button>
        </form>
        <small>Don't have an account? <Link to='/register'>Sign Up</Link></small>
      </div>
    </section>
  );
};

export default LoginPage;
