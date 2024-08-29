import React, { useState } from "react";
import api from "../../API";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./LoginPage.css";
import CircularProgress from "@mui/material/CircularProgress";
import CryptoJS from 'crypto-js';

function LoginPage({ setLoginTrue }) {
  const [userID, setUserID] = useState('');
  const [password, setpassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getLogin = async () => {
    setIsLoading(true);
    const passHash = CryptoJS.AES.encrypt(password, "ly4@&gr$vnh905RyB>?%#@-(KSMT").toString();

    fetch(`${api}authorization/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: userID, password: passHash }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const user = data.user;
          const session = data.sessionInfo;

          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("session", JSON.stringify(session));

          setLoginTrue()
        } else {
          toast.error(data.message);
        }
      })
      .catch((e) => { console.log(e) })
      .finally(() => setIsLoading(false))
  };

  const dologin = (e) => {
    e.preventDefault();
    getLogin();
  }


  return (
    <div>
      <ToastContainer />
      <div className='main'>
        <div className='cntr'>
          <div>
            <h2 style={{ textAlign: 'center' }}>👋 Welcome Back</h2>
            <p style={{ textAlign: 'center' }}>Sign in to your account to continue</p>
            <div className='logform'><br />
              <div style={{ fontSize: '23px' }}><h2 className='hedundr'>Sig</h2>n In</div>

              <br /><br />
              <form>
                User ID
                <input type='text' className='loginpt' value={userID} onChange={(e) => { setUserID(e.target.value) }} required autoFocus='ture' />
                Password
                <input type='password' className='loginpt' value={password} onChange={(e) => { setpassword(e.target.value) }} required /><br />
                <button className='logsbmt' type='submit' onClick={dologin}>
                  {isLoading && (
                    <div className="overlay">
                      <CircularProgress className="spinner" />
                    </div>
                  )}
                  Sign In
                </button>
              </form><br />
              <p className='para'>By Signing in you agree to the Terms of Service and Privacy Policy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
