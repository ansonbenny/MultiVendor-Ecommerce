import { userAxios } from '@/Config/Server'
import React, { useEffect, useState } from 'react'
import Xicon from '@/Assets/Xicon'

function Modal({ Address, setUpdate, setUserLogged }) {
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        number: '',
        pin: '',
        locality: '',
        address: '',
        city: '',
        state: ''
    })

    useEffect(() => {
        if (Address.name && !Address.new) {
            setFormData(Address)
        } else {
            setFormData({
                name: '',
                number: '',
                pin: '',
                locality: '',
                address: '',
                city: '',
                state: ''
            })
        }
    }, [Address])

    const formHandle = (e) => {
        e.preventDefault()
        if (formData.pin.length === 6) {
            if (formData.number.length === 10) {
                if (!Address.new) {
                    userAxios((server) => {
                        server.put('/users/editAddress', formData).then((res) => {
                            if (res.data.login) {
                                setUserLogged({ status: false })
                                localStorage.removeItem('token')
                            } else {
                                setUpdate(update => !update)
                                alert("Updated")
                            }
                        }).catch(() => {
                            alert("Error")
                        })
                    })
                } else {
                    userAxios((server) => {
                        server.post('/users/addAddress', formData).then((res) => {
                            if (res.data.login) {
                                setUserLogged({ status: false })
                                localStorage.removeItem('token')
                            } else {
                                setUpdate(update => !update)
                                setFormData({
                                    name: '',
                                    number: '',
                                    pin: '',
                                    locality: '',
                                    address: '',
                                    city: '',
                                    state: ''
                                })
                                alert("Done")
                            }
                        }).catch(() => {
                            alert("Error")
                        })
                    })
                }
            } else {
                alert("Number Must 10 Digit")
            }
        } else {
            alert("PinCode Must 6 Digit")
        }
    }
    return (
        <div className="modal fade" id="addressModal" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-body">
                        <div style={{ textAlign: 'right' }} className="pb-2" >
                            <button type="button" data-for="exit" data-bs-dismiss="modal">
                                <Xicon color={'#333'} />
                            </button>
                        </div>

                        <div>
                            <form onSubmit={formHandle}>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <input type="text" value={formData.name} onInput={(e) => {
                                            setFormData({
                                                ...formData,
                                                name: e.target.value
                                            })
                                        }} placeholder='Name' required />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <input type="number" value={formData.number} onInput={(e) => {
                                            setFormData({
                                                ...formData,
                                                number: e.target.value
                                            })
                                        }} placeholder='10-digit mobile number' required />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <input type="number" value={formData.pin} onInput={(e) => {
                                            setFormData({
                                                ...formData,
                                                pin: e.target.value
                                            })
                                        }} placeholder='Pincode' required />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <input type="text" value={formData.locality} onInput={(e) => {
                                            setFormData({
                                                ...formData,
                                                locality: e.target.value
                                            })
                                        }} placeholder='Locality' required />
                                    </div>
                                    <div className="col-12 mb-3">
                                        <textarea value={formData.address} onInput={(e) => {
                                            setFormData({
                                                ...formData,
                                                address: e.target.value
                                            })
                                        }} placeholder='Address (Area and Street)' cols="30" rows="10" required></textarea>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <input value={formData.city} onInput={(e) => {
                                            setFormData({
                                                ...formData,
                                                city: e.target.value
                                            })
                                        }} type="text" placeholder='City/District/Town' required />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <select value={formData.state} onChange={(e) => {
                                            setFormData({
                                                ...formData,
                                                state: e.target.value
                                            })
                                        }}>
                                            <option value="Andhra Pradesh">Andhra Pradesh</option>
                                            <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                                            <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                                            <option value="Assam">Assam</option>
                                            <option value="Bihar">Bihar</option>
                                            <option value="Chandigarh">Chandigarh</option>
                                            <option value="Chhattisgarh">Chhattisgarh</option>
                                            <option value="Dadar and Nagar Haveli">Dadar and Nagar Haveli</option>
                                            <option value="Daman and Diu">Daman and Diu</option>
                                            <option value="Delhi">Delhi</option>
                                            <option value="Lakshadweep">Lakshadweep</option>
                                            <option value="Puducherry">Puducherry</option>
                                            <option value="Goa">Goa</option>
                                            <option value="Gujarat">Gujarat</option>
                                            <option value="Haryana">Haryana</option>
                                            <option value="Himachal Pradesh">Himachal Pradesh</option>
                                            <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                                            <option value="Jharkhand">Jharkhand</option>
                                            <option value="Karnataka">Karnataka</option>
                                            <option value="Kerala">Kerala</option>
                                            <option value="Madhya Pradesh">Madhya Pradesh</option>
                                            <option value="Maharashtra">Maharashtra</option>
                                            <option value="Manipur">Manipur</option>
                                            <option value="Meghalaya">Meghalaya</option>
                                            <option value="Mizoram">Mizoram</option>
                                            <option value="Nagaland">Nagaland</option>
                                            <option value="Odisha">Odisha</option>
                                            <option value="Punjab">Punjab</option>
                                            <option value="Rajasthan">Rajasthan</option>
                                            <option value="Sikkim">Sikkim</option>
                                            <option value="Tamil Nadu">Tamil Nadu</option>
                                            <option value="Telangana">Telangana</option>
                                            <option value="Tripura">Tripura</option>
                                            <option value="Uttar Pradesh">Uttar Pradesh</option>
                                            <option value="Uttarakhand">Uttarakhand</option>
                                            <option value="West Bengal">West Bengal</option>
                                        </select>
                                    </div>

                                    <div className="col-12">
                                        <button type='submit'>Save</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal