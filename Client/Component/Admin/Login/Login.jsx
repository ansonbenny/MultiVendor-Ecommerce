import Eye from '@/Assets/Eye'
import EyeHide from '@/Assets/EyeHide'
import Server from '@/Config/Server'
import { useRouter } from 'next/router'
import React, { useRef, useState } from 'react'

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const passRef = useRef()
    const [passShow, setPassShow] = useState(false)

    const navigate = useRouter()

    const formHandle = (e) => {
        e.preventDefault()
        Server.post('/admin/login', formData).then((res) => {
            if (res.data.admin) {
                localStorage.setItem('adminToken', res.data.admin)
                navigate.push('/admin/dashboard')
            } else {
                alert("Email Or Password Wrong")
            }
        }).catch(() => {
            alert("Error")
        })
    }

    return (
        <div>
            <div className='Login'>
                <form onSubmit={formHandle} >
                    <h4>Login</h4>
                    <div className="row">
                        <div className="col-12">
                            <label>Email</label>
                            <input type="email" value={formData.email} onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    email: e.target.value
                                })
                            }} required />
                        </div>
                        <div className="col-12">
                            <label>Password</label>
                            <div className="passGrid">
                                <input type="password" value={formData.password} onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        password: e.target.value
                                    })
                                }} ref={passRef} required />
                                {
                                    passShow ? <button type='button' data-for="pass" onClick={() => {
                                        setPassShow(false)
                                        passRef.current.type = "password"
                                    }}> <EyeHide color={'#ffffff'} /> </button>
                                        : <button type='button' data-for="pass" onClick={() => {
                                            setPassShow(true)
                                            passRef.current.type = "text"
                                        }}> <Eye color={'#ffffff'} /> </button>
                                }
                            </div>
                        </div>
                        <div className="col-12">
                            <button type='submit'>
                                Login
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login