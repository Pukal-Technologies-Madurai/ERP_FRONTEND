import React, { useState } from 'react';
import './login.css';
import CryptoJS from 'crypto-js';
import { api } from '../../host'


function Login({ setLogin, setLoading, toast }) {
    const [userPass, setUserPass] = useState({
        UserName: '',
        Password: ''
    })

    const doLogin = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const passHash = CryptoJS.AES.encrypt(userPass.Password, 'ly4@&gr$vnh905RyB>?%#@-(KSMT').toString();
            const request = await fetch(`${api}login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    UserName: userPass.UserName,
                    Password: passHash
                })
            })

            const response = await request.json();

            if (response.success) {
                localStorage.setItem('user', JSON.stringify(response?.data[0]));
                setLogin();
            } else {
                toast(response.message, 3)
            }

        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <div className='main'>
                <div className='cntr'>
                    <div>
                        <h2 style={{ textAlign: 'center' }}>👋 Welcome Back</h2>
                        <p style={{ textAlign: 'center' }}>Sign in to your account to continue</p>
                        <div className='logform'><br />
                            <div style={{ fontSize: '23px' }}><h2 className='hedundr'>Sig</h2>n In</div>

                            <br /><br />
                            <form onSubmit={doLogin}>
                                User ID
                                <input
                                    type='text'
                                    className='loginpt'
                                    value={userPass.UserName}
                                    onChange={e => setUserPass({ ...userPass, UserName: e.target.value })}
                                    required
                                    autoFocus='ture'
                                />
                                Password
                                <input
                                    type='password'
                                    className='loginpt'
                                    value={userPass.Password}
                                    onChange={e => setUserPass({ ...userPass, Password: e.target.value })}
                                    required
                                />
                                <br />
                                <button className='logsbmt' type='submit'>
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

export default Login;