import { useEffect } from 'react'
import { useContext } from 'react'
import { useState } from 'react'
import { useRef } from 'react'
import { userAxios } from '../../../Config/Server'
import ContentControl from '../../../ContentControl/ContentControl'

function Modal({ order, setReturnModal, returnModal, setLogError, setUpdate }) {
    const modalRef = useRef()

    const [reason, setReason] = useState('Product isn’t matching with the product description')

    const { setUserLogged, setLoginModal } = useContext(ContentControl)

    useEffect(() => {
        if (returnModal.btn === true) {
            setReturnModal({ ...returnModal, btn: false })
        } else {
            window.addEventListener('click', closePopUpBody);
            function closePopUpBody(event) {
                if (!modalRef.current?.contains(event.target)) {
                    setReturnModal({ ...returnModal, active: false })
                }
            }
            return () => window.removeEventListener('click', closePopUpBody)
        }
    })

    const formHandle = (e) => {
        e.preventDefault()
        userAxios((server) => {
            server.post('/users/returnOrder', {
                secretOrderId: order.secretOrderId,
                reason: reason,
                name: order.details.name
            }).then((res) => {
                if (res.data.login) {
                    setUserLogged({ status: false })
                    localStorage.removeItem('token')
                    setLogError(true)
                    setLoginModal(loginModal => ({
                        ...loginModal,
                        btn: true,
                        member: true,
                        active: true
                    }))
                } else {

                    setUpdate(update => !update)

                    alert("Return Requested")

                    setReturnModal({
                        ...returnModal,
                        active: false
                    })
                }
            }).catch(() => {
                alert("Error")
            })
        })
    }

    return (
        <div className="ReturnModal">
            <div className="Item" ref={modalRef} >
                <div className="Main">
                    <div className="ExitBtn">
                        <button type="button" onClick={() => {
                            setReturnModal({
                                ...returnModal,
                                active: false
                            })
                        }}>
                            <i className='fa-solid fa-x'></i>
                        </button>
                    </div>

                    <form onSubmit={formHandle}>
                        <div className='pb-1'>
                            <label className='text-small UserBlackMain'>Return Reason</label>
                            <select value={reason} onChange={(e) => {
                                setReason(e.target.value)
                            }} required>
                                <option
                                    value="Product isn’t matching with the product description">
                                    Product isn’t matching with the product description
                                </option>
                                <option
                                    value="Product/packaging is damaged or defective">
                                    Product/packaging is damaged or defective
                                </option>
                                <option
                                    value="Freebies or combo products are missing">
                                    Freebies or combo products are missing
                                </option>
                                <option
                                    value="Product is fake, used or expired">
                                    Product is fake, used or expired
                                </option>
                            </select>
                        </div>
                        <button type='submit' className='submit'>
                            Return
                        </button>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default Modal