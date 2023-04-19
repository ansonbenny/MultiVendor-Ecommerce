import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Server from '../../../Config/Server'

function LoginComp() {
    useEffect(() => {
        document.body.style.background = '#080710'
    },[])

    const navigate = useRouter()

    const [formData, setFormData] = useState({
        email: '',
        otp: ''
    })

    const [otpSent, setOtpSent] = useState(false)

    const formHandle = (e) => {
        e.preventDefault()
        if (otpSent) {
            Server.post('/vendor/login', formData).then((response) => {
                if (response.data.request) {
                    setOtpSent(false)
                    alert("Vendor Request Accepting Under Pending")
                } else {
                    if (response.data.resent) {
                        alert('Resent OTP')
                    } else {
                        if (response.data.status) {
                            localStorage.setItem('vendorToken', response.data.token)
                            document.body.style.background = 'transparent'
                            navigate.push('/vendor/dashboard')
                            alert("Done")
                        } else {
                            alert("Wrong OTP")
                        }
                    }
                }
            }).catch(() => {
                alert("Error")
            })
        } else {
            Server.post('/vendor/sentOtpLogin', formData).then((res) => {
                if (res.data.request) {
                    setOtpSent(false)
                    alert("Accepted Vendor Not Found")
                } else {
                    if (res.data.mail) {
                        setOtpSent(true)
                        alert("Otp Sent Successfully")
                    } else {
                        setOtpSent(false)
                        alert("Otp Sent Failed")
                    }
                }
            }).catch(() => {
                alert("Error")
            })
        }
    }

    return (
        <div className='LoginComp'>
            <div className="background">
                <div className="shape" type="top"></div>
                <div className="shape" type="bottom"></div>

                <div className="registerForm">
                    <div className="inner">
                        <h3 type="title">Login Here</h3>
                        <form onSubmit={formHandle}>
                            <div>
                                <label>Email</label>
                                <input type="email" value={formData.email} onInput={(e) => {
                                    setFormData({
                                        ...formData,
                                        email: e.target.value
                                    })
                                }} placeholder='Enter Email' required />
                            </div>
                            {
                                otpSent && <div className='pt-3'>
                                    <label>Otp</label>
                                    <input type="number" value={formData.otp} onInput={(e) => {
                                        setFormData({
                                            ...formData,
                                            otp: e.target.value
                                        })
                                    }} placeholder='Enter OTP' required />
                                    <button data-for="resent" type='button' onClick={() => {
                                        Server.post('/vendor/sentOtpLogin', formData).then((res) => {
                                            if (res.data.request) {
                                                setOtpSent(false)
                                                alert("Vendor Request Accepting Under Pending")
                                            } else {
                                                if (res.data.mail) {
                                                    alert("Otp Sent Successfully")
                                                } else {
                                                    alert("Otp Sent Failed")
                                                }
                                            }
                                        }).catch(() => {
                                            alert("Error")
                                        })
                                    }} >Resent</button>
                                </div>
                            }
                            <div className="pt-4">
                                {
                                    otpSent ? <button type='submit'>Login</button>
                                        : <button type='submit'>Sent Otp</button>
                                }
                            </div>
                        </form>
                        <button data-for="register" >Not a member ? <span onClick={() => {
                            document.body.style.background = 'transparent'
                            navigate.push('/vendor/register')
                        }}>Register</span></button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginComp