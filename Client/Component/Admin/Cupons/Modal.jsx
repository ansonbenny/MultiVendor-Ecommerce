import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useRef } from 'react'
import { adminAxios } from '../../../Config/Server'

function Modal({ setMainModal, MainModal, getCupons, logOut }) {
    let modalRef = useRef()

    const [error, setError] = useState(false)

    const [details, setDetails] = useState({
        code: '',
        min: 0,
        discount: 0,
    })

    useEffect(() => {
        if (MainModal.btn === true) {
            setMainModal({ ...MainModal, btn: false })
        } else {

            function modalEvent(event) {
                if (!modalRef.current?.contains(event.target)) {
                    setMainModal({
                        ...MainModal,
                        active: false,
                        btn: false
                    })
                }
            }
            window.addEventListener('click', modalEvent)

            return () => window.removeEventListener('click', modalEvent)
        }
    })

    const cuponForm = (e) => {
        e.preventDefault()
        if (!error) {
            adminAxios((server) => {
                server.post('/admin/addCupon', details).then((res) => {
                    if (res.data.login) {
                        logOut()
                    } else {
                        alert("Added")
                        setMainModal({
                            ...MainModal,
                            active: false,
                            btn: false
                        })
                        getCupons()
                    }
                }).catch(() => {
                    alert("Error")
                })
            })
        }
    }
    return (
        <div className='Modal'>
            <div className='inner'>
                <div className="innerMain" ref={modalRef}>
                    <div className='ExitDiv'>
                        <button onClick={() => {
                            setMainModal({
                                ...MainModal,
                                btn: false,
                                active: false,
                            })
                        }}>CLOSE</button>
                    </div>
                    <div className="row">
                        <form onSubmit={cuponForm}>
                            <div className="col-12" style={{ marginBottom: '20px' }}>
                                <label>Cupon Code</label>
                                <br />
                                <input value={details.code} style={{ marginBottom: '0' }} onInput={(e) => {
                                    setDetails({
                                        ...details,
                                        code: e.target.value
                                    })

                                    if (e.target.value.length < 5 && e.target.value.length !== 0) {
                                        setError(true)
                                    } else {
                                        setError(false)
                                    }
                                }} type="text" required />
                                {
                                    error && <label className='text-small' style={{ color: 'red' }}>
                                        <small>Code must 5 character</small>
                                    </label>
                                }
                            </div>

                            <div className="col-12">
                                <label>Starting Price</label>
                                <br />
                                <input value={details.min} onInput={(e) => {
                                    setDetails({
                                        ...details,
                                        min: e.target.value
                                    })
                                }} type="number" required />
                            </div>

                            <div className="col-12">
                                <label>Discount Percentage</label>
                                <br />
                                <input value={details.discount} onInput={(e) => {
                                    setDetails({
                                        ...details,
                                        discount: e.target.value
                                    })
                                }} type="number" required />
                            </div>

                            <div className="col-12">
                                <button className='submitBnt'>Add</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal