import React from 'react'
import { useRef, useContext } from 'react'
import { useState, useEffect } from 'react'
import EyeIcon from '../../../Assets/Eye'
import EyeHideIcon from '../../../Assets/EyeHide'
import Server from '../../../Config/Server'
import ContentControl from '../../../ContentControl/ContentControl'

function Login({ LoginModal, setLoginModal }) {

    const { setUserLogged } = useContext(ContentControl)

    const [showBtnSign, setShowBtnSign] = useState(true)
    const [showBtnLogin, setShowBtnLogin] = useState(true)
    const [showBtnForgot, setShowBtnForgot] = useState(true)

    const passRef = useRef(null)
    const modalRef = useRef()
    const errPassRef = useRef()
    const extraErrorRef = useRef()


    const [otpSend, setOtpSend] = useState({
        status: false,
        btn: 'Sent otp'
    })

    const [SignUpData, setSignUpData] = useState({
        name: '',
        email: '',
        password: '',
        number: '',
        otp: ''
    })

    const [LoginData, setLoginData] = useState({
        email: '',
        password: ''
    })

    const [ForgotData, setForgotData] = useState({
        email: '',
        password: '',
        otp: ''
    })

    const [extraError, setExtraError] = useState('')

    useEffect(() => {
        if (LoginModal.btn === true) {
            setLoginModal({ ...LoginModal, btn: false })
        } else {
            window.addEventListener('click', closePopUpBody);
            function closePopUpBody(event) {
                if (!modalRef.current?.contains(event.target)) {
                    setLoginModal({ ...LoginModal, active: false })
                }
            }
            return () => window.removeEventListener('click', closePopUpBody)
        }
    })

    function SignUpForm(e) {
        e.preventDefault();
        if (SignUpData.password.length >= 8) {

            if (otpSend.status) {
                Server.post('/users/signup', SignUpData).then((response) => {
                    if (response.data.found) {
                        extraErrorRef.current.style.display = 'block'
                        setExtraError("User already found")
                    } else {
                        if (response.data.resent) {
                            extraErrorRef.current.style.display = 'none'
                            setOtpSend(obj => ({
                                ...obj,
                                status: false,
                                btn: 'Sent otp'
                            }))
                        } else {
                            if (response.data.status) {
                                if (response.data.user) {
                                    alert('SignUp Successful')
                                    extraErrorRef.current.style.display = 'none'
                                    setLoginModal(obj => ({
                                        ...obj,
                                        btn: true,
                                        active: true,
                                        member: true
                                    }))
                                } else {
                                    extraErrorRef.current.style.display = 'block'
                                    setExtraError("User Creation Failed")
                                }
                            } else {
                                extraErrorRef.current.style.display = 'block'
                                setExtraError("Wrong OTP")
                            }
                        }
                    }
                }).catch((err) => {
                    extraErrorRef.current.style.display = 'block'
                    setExtraError("Facing An Error")
                })
            } else {
                Server.post('/users/sentOtpSignUp', SignUpData).then((response) => {
                    if (response.data.found === true) {
                        extraErrorRef.current.style.display = 'block'
                        setExtraError("User Already Found")
                    } else {
                        if (response.data.mail) {
                            extraErrorRef.current.style.display = 'none'
                            setOtpSend(obj => ({
                                ...obj,
                                status: true,
                                btn: 'Signup'
                            }))
                        } else {
                            extraErrorRef.current.style.display = 'block'
                            setExtraError("Otp Snt Failed")
                        }
                    }
                }).catch((err) => {
                    extraErrorRef.current.style.display = 'block'
                    setExtraError("Facing An Error")
                })
            }

        } else {
            extraErrorRef.current.style.display = 'none'
        }
    }

    function LoginForm(e) {
        e.preventDefault();
        if (LoginData.password.length >= 8) {
            Server.post('/users/login', LoginData).then((response) => {
                if (response.data.user) {

                    localStorage.setItem('token', response.data.user)

                    Server.get('/users/getUserData', {
                        headers: {
                            'x-access-token': response.data.user
                        }
                    }).then((res) => {
                        if (res.data.status) {
                            setUserLogged(res.data)
                            setLoginModal({ ...LoginModal, active: false })
                            alert("Login successful")
                        } else {
                            extraErrorRef.current.style.display = 'block'
                            setExtraError('Wrong user data')
                            setUserLogged({ status: false })
                            localStorage.removeItem('token')
                        }
                    }).catch((err) => {
                        extraErrorRef.current.style.display = 'block'
                        setExtraError('Error to fetch user data')
                        setUserLogged({ status: false })
                        localStorage.removeItem('token')
                    })

                } else {
                    extraErrorRef.current.style.display = 'block'
                    setExtraError("Email or Password is wrong")
                }
            }).catch((err) => {
                extraErrorRef.current.style.display = 'block'
                setExtraError("Facing An Error")
            })
        } else {
            extraErrorRef.current.style.display = 'none'
        }
    }

    function ForgotForm(e) {
        e.preventDefault()
        if (ForgotData.password.length >= 8) {
            if (otpSend.status) {
                Server.put('/users/forgotPassword', ForgotData).then((res) => {
                    if (res.data.resent) {
                        setOtpSend({
                            status: false,
                            btn: 'Sent otp'
                        })

                        setForgotData({
                            ...ForgotData,
                            otp: ''
                        })
                        extraErrorRef.current.style.display = 'none'
                    } else {
                        if (res.data.status) {
                            extraErrorRef.current.style.display = 'none'
                            alert("Done")
                            setLoginModal({
                                ...LoginModal,
                                active: true,
                                forgot: false,
                                btn: true,
                                member: true
                            })

                            setOtpSend({
                                ...otpSend,
                                status: false,
                                btn: 'sent otp'
                            })
                        } else {
                            extraErrorRef.current.style.display = 'block'
                            setExtraError("Wrong OTP")
                        }
                    }
                }).catch(() => {
                    extraErrorRef.current.style.display = 'block'
                    setExtraError("Error")
                })
            } else {
                Server.post('/users/sentOtpForgot', ForgotData).then((res) => {
                    if (res.data.found) {
                        if (res.data.mail) {
                            setOtpSend({
                                status: true,
                                btn: 'Forgot'
                            })
                            extraErrorRef.current.style.display = 'none'
                        } else {
                            extraErrorRef.current.style.display = 'block'
                            setExtraError("Otp Sent Failed")
                        }
                    } else {
                        extraErrorRef.current.style.display = 'block'
                        setExtraError("User not found")
                    }
                }).catch(() => {
                    extraErrorRef.current.style.display = 'block'
                    setExtraError("Error")
                })
            }
        }
    }

    return (
        <div className='Login'>
            <div className="Item" ref={modalRef}>
                <div className="Main">

                    {
                        LoginModal.member ? (
                            <div id="Login" className='row'>
                                <div className="col-12">
                                    <h3 className='text-center font-bold UserBlackMain'>
                                        {
                                            LoginModal.forgot ? 'Forgot Password'
                                                : 'Login'
                                        }
                                    </h3>
                                </div>
                                <label ref={extraErrorRef} className="text-center"
                                    style={{ color: 'red', fontSize: 'small', display: 'none' }}>
                                    {extraError}
                                </label>

                                {
                                    LoginModal.forgot ? (
                                        <form onSubmit={ForgotForm}>
                                            <div className='col-12 mt-3'>
                                                <label>Email</label>
                                                <br />
                                                <input type="email" value={ForgotData.email} onInput={(e) => {
                                                    setForgotData({
                                                        ...ForgotData,
                                                        email: e.target.value
                                                    })
                                                }} required />
                                            </div>

                                            <div className='col-12 mt-3'>
                                                <label>New Password</label>
                                                <br />
                                                <div className="passwdDiv">
                                                    <input className='passInput' value={ForgotData.password} required ref={passRef}
                                                        type="password" onInput={(e) => {
                                                            if (e.target.value.length < 8 && e.target.value.length > 0) {
                                                                errPassRef.current.style.display = 'block'
                                                                extraErrorRef.current.style.display = 'none'
                                                            } else {
                                                                errPassRef.current.style.display = 'none'
                                                            }

                                                            setForgotData({
                                                                ...ForgotData,
                                                                password: e.target.value
                                                            })
                                                        }}
                                                    />
                                                    {
                                                        showBtnForgot ? (
                                                            <button className='showHide'
                                                                type='button' onClick={() => {
                                                                    if (passRef.current.type === "password") {
                                                                        passRef.current.type = "text"
                                                                    }

                                                                    setLoginModal({
                                                                        ...LoginModal,
                                                                        member: true,
                                                                        active: true,
                                                                        btn: true
                                                                    })

                                                                    setShowBtnForgot(false)
                                                                }}>

                                                                <EyeIcon color={'#333'} />
                                                            </button>
                                                        ) : (
                                                            <button className='showHide'
                                                                type='button' onClick={() => {
                                                                    if (passRef.current.type !== "password") {
                                                                        passRef.current.type = "password"
                                                                    }

                                                                    setLoginData({
                                                                        email: '',
                                                                        password: ''
                                                                    })

                                                                    setLoginModal({
                                                                        ...LoginModal,
                                                                        member: true,
                                                                        active: true,
                                                                        btn: true
                                                                    })

                                                                    setShowBtnForgot(true)
                                                                }}>
                                                                <EyeHideIcon color={'#333'} />
                                                            </button>
                                                        )
                                                    }
                                                </div>

                                                <label ref={errPassRef}
                                                    style={{ color: 'red', fontSize: 'small', display: 'none' }}>
                                                    Password Minimum 8 Character
                                                </label>
                                            </div>

                                            {
                                                otpSend.status && (
                                                    <div className='col-12 mt-3'>
                                                        <label>Enter Otp</label> <br />
                                                        <input value={ForgotData.otp} onInput={(e) => {
                                                            setForgotData({
                                                                ...ForgotData,
                                                                otp: e.target.value
                                                            })
                                                        }} type="number" required />
                                                        <label onClick={() => {
                                                            Server.post('/users/resentOtpForgot', ForgotData).then((res) => {
                                                                extraErrorRef.current.style.display = 'block'
                                                                setExtraError("Otp Resent Success")
                                                            }).catch(() => {
                                                                extraErrorRef.current.style.display = 'block'
                                                                setExtraError("Otp Resent Failed")
                                                            })
                                                        }} className='resent'>Resent Otp</label>
                                                    </div>
                                                )
                                            }

                                            <div className="col-12 mt-4">
                                                {
                                                    !otpSend.status ? <button type='submit' className='loginBtn'>{otpSend.btn}</button>
                                                        : <button type='submit' className='loginBtn'>{otpSend.btn}</button>
                                                }

                                                <button type='button' className='notMember'>
                                                    If you remember password ? <span onClick={() => {
                                                        setSignUpData({
                                                            ...SignUpData,
                                                            email: '',
                                                            name: '',
                                                            number: '',
                                                            otp: '',
                                                            password: ''
                                                        })

                                                        setOtpSend({
                                                            ...otpSend,
                                                            status: false,
                                                            btn: 'sent otp'
                                                        })

                                                        setLoginData({
                                                            ...LoginData,
                                                            email: '',
                                                            password: ''
                                                        })

                                                        setLoginModal({
                                                            ...LoginModal,
                                                            member: true,
                                                            forgot: false,
                                                            active: true,
                                                            btn: true
                                                        })
                                                        setShowBtnForgot(true)
                                                        setShowBtnLogin(true)
                                                        setShowBtnSign(true)
                                                        passRef.current.type = "password"
                                                        errPassRef.current.style.display = 'none'
                                                        extraErrorRef.current.style.display = 'none'
                                                    }}>Login now</span></button>
                                            </div>
                                        </form>
                                    ) : (
                                        <form onSubmit={LoginForm}>
                                            <div className='col-12 mt-3'>
                                                <label>Email</label>
                                                <br />
                                                <input value={LoginData.email} onInput={(e) => {
                                                    setLoginData({
                                                        ...LoginData,
                                                        email: e.target.value
                                                    })
                                                }} type="email" required />
                                            </div>
                                            <div className='col-12 mt-3'>
                                                <label>Password</label>
                                                <br />
                                                <div className="passwdDiv">
                                                    <input className='passInput' value={LoginData.password} required ref={passRef}
                                                        type="password" onInput={(e) => {
                                                            if (e.target.value.length < 8 && e.target.value.length > 0) {
                                                                errPassRef.current.style.display = 'block'
                                                                extraErrorRef.current.style.display = 'none'
                                                            } else {
                                                                errPassRef.current.style.display = 'none'
                                                            }

                                                            setLoginData({
                                                                ...LoginData,
                                                                password: e.target.value
                                                            })
                                                        }}
                                                    />
                                                    {
                                                        showBtnLogin ? (
                                                            <button className='showHide'
                                                                type='button' onClick={() => {
                                                                    if (passRef.current.type === "password") {
                                                                        passRef.current.type = "text"
                                                                    }

                                                                    setLoginModal({
                                                                        ...LoginModal,
                                                                        member: true,
                                                                        active: true,
                                                                        btn: true
                                                                    })

                                                                    setShowBtnLogin(false)
                                                                }}>

                                                                <EyeIcon color={'#333'} />
                                                            </button>
                                                        ) : (
                                                            <button className='showHide'
                                                                type='button' onClick={() => {
                                                                    if (passRef.current.type !== "password") {
                                                                        passRef.current.type = "password"
                                                                    }

                                                                    setLoginModal({
                                                                        ...LoginModal,
                                                                        member: true,
                                                                        active: true,
                                                                        btn: true
                                                                    })

                                                                    setShowBtnLogin(true)
                                                                }}>
                                                                <EyeHideIcon color={'#333'} />
                                                            </button>
                                                        )
                                                    }
                                                </div>
                                                <label ref={errPassRef}
                                                    style={{ color: 'red', fontSize: 'small', display: 'none' }}>
                                                    Password Minimum 8 Character
                                                </label>
                                                <button className='forgotBtn' type='button' onClick={() => {
                                                    setLoginModal({
                                                        ...LoginModal,
                                                        member: true,
                                                        forgot: true,
                                                        active: true,
                                                        btn: true
                                                    })

                                                    setForgotData({
                                                        ...ForgotData,
                                                        email: '',
                                                        password: '',
                                                        otp: ''
                                                    })

                                                    setLoginData({
                                                        ...LoginData,
                                                        email: '',
                                                        password: ''
                                                    })

                                                    setShowBtnForgot(true)
                                                    setShowBtnLogin(true)
                                                    setShowBtnSign(true)
                                                    passRef.current.type = "password"

                                                    errPassRef.current.style.display = 'none'
                                                    extraErrorRef.current.style.display = 'none'
                                                }}>Forgot Password ?</button>
                                            </div>
                                            <div className="col-12 mt-4">
                                                <button type='submit' className='loginBtn'>Login</button>

                                                <button type='button' className='notMember'>
                                                    Not a member ? <span onClick={() => {
                                                        setSignUpData({
                                                            ...SignUpData,
                                                            email: '',
                                                            name: '',
                                                            number: '',
                                                            otp: '',
                                                            password: ''
                                                        })

                                                        setOtpSend({
                                                            ...otpSend,
                                                            status: false,
                                                            btn: 'sent otp'
                                                        })

                                                        setLoginModal({
                                                            ...LoginModal,
                                                            member: false,
                                                            active: true,
                                                            btn: true
                                                        })

                                                        setShowBtnForgot(true)
                                                        setShowBtnLogin(true)
                                                        setShowBtnSign(true)
                                                        passRef.current.type = "password"
                                                        extraErrorRef.current.style.display = 'none'
                                                    }}>Signup now</span></button>
                                            </div>
                                        </form>
                                    )
                                }
                            </div>
                        ) : (
                            <div id="SignUp" className='row'>
                                <form onSubmit={SignUpForm}>
                                    <div className="col-12">
                                        <h3 className='text-center font-bold UserBlackMain'>SignUp</h3>
                                    </div>
                                    <label ref={extraErrorRef} className="text-center"
                                        style={{ color: 'red', fontSize: 'small', display: 'none' }}>
                                        {extraError}
                                    </label>
                                    <div className='col-12 mt-3'>
                                        <label>Name</label>
                                        <br />
                                        <input value={SignUpData.name} onInput={(e) => {
                                            setSignUpData({
                                                ...SignUpData,
                                                name: e.target.value
                                            })
                                        }} type="text" required />
                                    </div>
                                    <div className='col-12 mt-3'>
                                        <label>Phone</label>
                                        <br />
                                        <input value={SignUpData.number} onInput={(e) => {
                                            setSignUpData({
                                                ...SignUpData,
                                                number: e.target.value
                                            })
                                        }} type="number" required />
                                    </div>
                                    <div className='col-12 mt-3'>
                                        <label>Email</label>
                                        <br />
                                        <input value={SignUpData.email} onInput={(e) => {
                                            setSignUpData({
                                                ...SignUpData,
                                                email: e.target.value
                                            })
                                        }} type="email" required />
                                    </div>
                                    <div className='col-12 mt-3'>
                                        <label>Password</label>
                                        <br />
                                        <div className="passwdDiv">
                                            <input className='passInput' ref={passRef}
                                                type="password" required onInput={(e) => {
                                                    if (e.target.value.length < 8 && e.target.value.length > 0) {
                                                        errPassRef.current.style.display = 'block'
                                                        extraErrorRef.current.style.display = 'none'
                                                    } else {
                                                        errPassRef.current.style.display = 'none'
                                                    }

                                                    setSignUpData({
                                                        ...SignUpData,
                                                        password: e.target.value
                                                    })
                                                }}
                                            />
                                            {
                                                showBtnSign ? (
                                                    <button className='showHide'
                                                        type='button' onClick={() => {
                                                            if (passRef.current.type === "password") {
                                                                passRef.current.type = "text"
                                                            }

                                                            setLoginModal({
                                                                ...LoginModal,
                                                                member: false,
                                                                active: true,
                                                                btn: true
                                                            })

                                                            setShowBtnSign(false)
                                                        }}>
                                                        <EyeIcon color={'#333'} />
                                                    </button>
                                                ) : (
                                                    <button className='showHide'
                                                        type='button' onClick={() => {
                                                            if (passRef.current.type !== "password") {
                                                                passRef.current.type = "password"
                                                            }

                                                            setLoginModal({
                                                                ...LoginModal,
                                                                member: false,
                                                                active: true,
                                                                btn: true
                                                            })

                                                            setShowBtnSign(true)
                                                        }}>
                                                        <EyeHideIcon color={'#333'} />
                                                    </button>
                                                )
                                            }
                                        </div>
                                        <label ref={errPassRef}
                                            style={{ color: 'red', fontSize: 'small', display: 'none' }}>
                                            Password Minimum 8 Character
                                        </label>
                                    </div>
                                    {
                                        otpSend.status && (
                                            <div className='col-12 mt-3'>
                                                <label>Enter Otp</label> <br />
                                                <input value={SignUpData.otp} onInput={(e) => {
                                                    setSignUpData({
                                                        ...SignUpData,
                                                        otp: e.target.value
                                                    })
                                                }} type="number" required />
                                                <label onClick={() => {
                                                    Server.post('/users/resentOtpSignUp', SignUpData).then((res) => {
                                                        extraErrorRef.current.style.display = 'block'
                                                        setExtraError("Otp Resent Success")
                                                    }).catch(() => {
                                                        extraErrorRef.current.style.display = 'block'
                                                        setExtraError("Otp Resent Failed")
                                                    })
                                                }} className='resent'>Resent Otp</label>
                                            </div>
                                        )
                                    }
                                    <div className="col-12 mt-4">
                                        <button type='submit' className='loginBtn'>{otpSend.btn}</button>

                                        <button type='button' className='Member'>
                                            Already a member ? <span onClick={() => {
                                                setLoginData({
                                                    ...LoginData,
                                                    email: '',
                                                    password: ''
                                                })
                                                setLoginModal({
                                                    ...LoginModal,
                                                    member: true,
                                                    active: true,
                                                    btn: true
                                                })

                                                setShowBtnForgot(true)
                                                setShowBtnLogin(true)
                                                setShowBtnSign(true)
                                                passRef.current.type = "password"
                                                extraErrorRef.current.style.display = 'none'
                                            }}>Login now</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )
                    }

                </div>
            </div>
        </div>
    )
}

export default Login