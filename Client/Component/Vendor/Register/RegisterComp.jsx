import { useRouter } from 'next/router'
import React from 'react'
import { useState, useEffect } from 'react'
import Server from '../../../Config/Server'

function RegisterComp() {
    useEffect(() => {
        document.body.style.background = '#080710'
    }, [])

    const navigate = useRouter()

    const [formData, setFormData] = useState({
        adharName: '',
        adharNumber: '',
        email: '',
        number: '',
        panNumber: '',
        gstin: '',
        locality: '',
        pinCode: '',
        address: '',
        city: '',
        state: 'Andhra Pradesh',
        bankAccOwner: '',
        bankName: '',
        bankAccNumber: '',
        bankIFSC: '',
        bankBranchName: '',
        bankBranchNumber: '',
    })

    const numberLengthCheck = () => {
        if (formData.adharNumber.length !== 12) {
            alert("Adhar Number Must 12 Digit")
            return false
        } else if (formData.number.length !== 10) {
            alert("Mobile Number Must 10 Digit")
            return false
        } else if (formData.panNumber.length !== 10) {
            alert("Pan Card Number Must 10 Digit")
            return false
        } else if (formData.pinCode.length !== 6) {
            alert("Pin Code Number Must 6 Digit")
            return false
        } else {
            return true
        }
    }

    const formHandle = (e) => {
        e.preventDefault()
        if (numberLengthCheck()) {
            console.log("ready")
            Server.post('/vendor/register', formData).then((res) => {
                if (res.data.found) {
                    alert('Vendor Already Found')
                } else {
                    alert('Vendor Successfully Requested')
                    navigate.push('/vendor/login')
                }
            }).catch((err) => {
                alert('Error')
            })
        }

    }
    return (
        <div className='RegisterComp'>
            <div className="background">
                <div className="shape" type="top"></div>
                <div className="shape" type="bottom"></div>

                <div className="registerForm">
                    <div className="inner">
                        <h3 type="title">Register Here</h3>
                        <form onSubmit={formHandle}>
                            <h6>User Details</h6>
                            <div aria-label='user-details'>
                                <div>
                                    <label>Name In Adhar Card</label>
                                    <input type="text" placeholder='Enter Name'
                                        value={formData.adharName} onInput={(e) => {
                                            setFormData({
                                                ...formData,
                                                adharName: e.target.value
                                            })
                                        }} required />
                                </div>
                                <div className='pt-3'>
                                    <label>Adhar Number</label>
                                    <input type="number" placeholder='Enter Adhar Number'
                                        value={formData.adharNumber} onInput={(e) => {
                                            setFormData({
                                                ...formData,
                                                adharNumber: e.target.value
                                            })
                                        }} required />
                                </div>
                                <div className='pt-3'>
                                    <label>Email</label>
                                    <input type="email" placeholder='Enter Email'
                                        value={formData.email} onInput={(e) => {
                                            setFormData({
                                                ...formData,
                                                email: e.target.value
                                            })
                                        }} required />
                                </div>
                                <div className='pt-3'>
                                    <label>Number</label>
                                    <input type="number" placeholder='Enter Number'
                                        value={formData.number} onInput={(e) => {
                                            setFormData({
                                                ...formData,
                                                number: e.target.value
                                            })
                                        }} required />
                                </div>
                                <div className='pt-3'>
                                    <label>Pan Card Number</label>
                                    <input type="text" placeholder='Enter Pan Number'
                                        value={formData.panNumber} onInput={(e) => {
                                            setFormData({
                                                ...formData,
                                                panNumber: e.target.value
                                            })
                                        }} required />
                                </div>
                                <div className='pt-3'>
                                    <label>GSTIN Number</label>
                                    <input type="text" placeholder='Enter GSTIN / Not Mandatory'
                                        value={formData.gstin} onInput={(e) => {
                                            setFormData({
                                                ...formData,
                                                gstin: e.target.value
                                            })
                                        }} />
                                </div>
                            </div>

                            <h6 className='pt-3'>Address</h6>

                            <div aria-label='address'>
                                <div>
                                    <label>Locality</label>
                                    <input type="text" placeholder='Enter Locality'
                                        value={formData.locality} onInput={(e) => {
                                            setFormData({
                                                ...formData,
                                                locality: e.target.value
                                            })
                                        }} required />
                                </div>
                                <div className='pt-3'>
                                    <label>Pin Code</label>
                                    <input type="number" placeholder='Enter Pin Code'
                                        value={formData.pinCode} onInput={(e) => {
                                            setFormData({
                                                ...formData,
                                                pinCode: e.target.value
                                            })
                                        }} required />
                                </div>
                                <div className='pt-3'>
                                    <label>Address</label>
                                    <textarea placeholder='Enter Address'
                                        value={formData.address} onInput={(e) => {
                                            setFormData({
                                                ...formData,
                                                address: e.target.value
                                            })
                                        }} required />
                                </div>
                                <div className='pt-3'>
                                    <label>City/District/Town</label>
                                    <input type="text" placeholder='Enter City/District/Town'
                                        value={formData.city} onInput={(e) => {
                                            setFormData({
                                                ...formData,
                                                city: e.target.value
                                            })
                                        }} required />
                                </div>
                                <div className="pt-3">
                                    <label>State</label>
                                    <select value={formData.state} onInput={(e) => {
                                        setFormData({
                                            ...formData,
                                            state: e.target.value
                                        })
                                    }} >
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
                            </div>

                            <h6 className='pt-3'>Account details</h6>

                            <div aria-label='account-details'>
                                <div>
                                    <label>Account Owner Name</label>
                                    <input type="text" placeholder='Enter Account Owner Name'
                                        value={formData.bankAccOwner} onInput={(e) => {
                                            setFormData({
                                                ...formData,
                                                bankAccOwner: e.target.value
                                            })
                                        }} required />
                                </div>
                                <div className='pt-3'>
                                    <label>Bank Name</label>
                                    <input type="text" placeholder='Enter Bank Name'
                                        value={formData.bankName} onInput={(e) => {
                                            setFormData({
                                                ...formData,
                                                bankName: e.target.value
                                            })
                                        }} required />
                                </div>
                                <div className='pt-3'>
                                    <label>Account Number</label>
                                    <input type="number" placeholder='Enter Account Number'
                                        value={formData.bankAccNumber} onInput={(e) => {
                                            setFormData({
                                                ...formData,
                                                bankAccNumber: e.target.value
                                            })
                                        }} required />
                                </div>
                                <div className='pt-3'>
                                    <label>IFSC</label>
                                    <input type="text" placeholder='Enter IFSC'
                                        value={formData.bankIFSC} onInput={(e) => {
                                            setFormData({
                                                ...formData,
                                                bankIFSC: e.target.value
                                            })
                                        }} required />
                                </div>
                                <div className='pt-3'>
                                    <label>Branch Name</label>
                                    <input type="text" placeholder='Enter Branch Name'
                                        value={formData.bankBranchName} onInput={(e) => {
                                            setFormData({
                                                ...formData,
                                                bankBranchName: e.target.value
                                            })
                                        }} required />
                                </div>
                                <div className='pt-3'>
                                    <label>Branch Number</label>
                                    <input type="number" placeholder='Enter Branch Number'
                                        value={formData.bankBranchNumber} onInput={(e) => {
                                            setFormData({
                                                ...formData,
                                                bankBranchNumber: e.target.value
                                            })
                                        }} required />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button type='submit'>Register</button>
                            </div>
                        </form>
                        <button data-for="register" >Already a member ? <span onClick={() => {
                            navigate.push('/vendor/login')
                        }}>Login</span></button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterComp