import { useState, useEffect } from 'react'
import Server, { userAxios } from '../../../Config/Server'
import { useContext } from 'react'
import Loading from '../../Loading/Loading'
import ContentControl from '../../../ContentControl/ContentControl'
import { useRouter } from 'next/router'
import Modal from './Modal'

function CheckoutComp({
    amount, setAmount,
    amountOrg, OrderType, setOrderType,
    setDiscount, discount, setLogError,
    setLoading, loading, razorpayKey,
    savedAddress
}) {

    const [cuponErr, setCuponErr] = useState(false)

    const [cupon, setCupon] = useState('')

    const [width, setWidth] = useState(500)

    const { userLogged, setUserLogged, setLoginModal } = useContext(ContentControl)

    const navigate = useRouter()

    const [orderDetails, setOrderDetails] = useState({
        name: '',
        number: '',
        pin: '',
        locality: '',
        address: '',
        city: '',
        state: 'Andhra Pradesh',
        order: OrderType,
        email: userLogged.email,
        payType: 'cod',
        discount: discount
    })

    useEffect(() => {
        setWidth(window.innerWidth)
    }, [])

    useEffect(() => {
        window.addEventListener('resize', () => {
            setWidth(window.innerWidth)
        })
    })

    useEffect(() => {
        setOrderDetails(orderDetails => ({
            ...orderDetails,
            totalAmount: amount.totalPrice,
            discount: discount
        }))
    }, [amount])

    const razorpay = (data) => {
        var options = {
            "key": razorpayKey,
            "amount": data.totalAmount,
            "currency": "INR",
            "name": "Aquariun",
            "description": "Test Transaction",
            "order_id": data.razOrderId,
            "handler": function (response) {
                response.userId = data.userId
                setLoading(true)
                Server.post('/users/order-item-razorpay', {
                    razorpayRes: response,
                    order: orderDetails
                }).then(() => {
                    setLoading(false)
                    setOrderType(type => ({
                        ...type,
                        order: false,
                        type: '',
                        exAction: true,
                        exActionData: {
                            failed: false,
                            success: true
                        }
                    }))
                    navigate.push('/ordersuccess') // done page
                }).catch((data) => {
                    setLoading(false)
                    if (data.data === 'payment') {
                        alert("Payment Failed")
                    } else {
                        setOrderType(type => ({
                            ...type,
                            order: false,
                            type: '',
                            exAction: true,
                            exActionData: {
                                failed: true,
                                success: false
                            }
                        }))
                        navigate.push('/orderfailed') // fail page
                    }
                })

            }, "modal": {
                "ondismiss": function () {
                    console.log("cancelled")
                }
            },
            "prefill": {
                "name": userLogged.name,
                "email": userLogged.email,
                "contact": userLogged.number
            },
            "notes": {
                "address": "Razorpay Corporate Office"
            }
        };
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        paymentObject.on('payment.failed', function (response) {
            console.log("Payment Failed")
        });
    }

    const checkoutForm = (e) => {
        e.preventDefault()

        if (orderDetails.pin.length === 6) {
            if (orderDetails.number.length === 10) {
                setLoading(true)
                Server.post('/users/checkPincode', {
                    pin: parseInt(orderDetails.pin)
                }).then((res) => {
                    if (res.data) {
                        if (orderDetails.payType === 'online') {
                            userAxios((server) => {
                                server.post('/users/createRazorpayPayment', {
                                    totalAmount: orderDetails.totalAmount
                                }).then((data) => {
                                    if (data.data.login) {
                                        setLoading(false)
                                        setUserLogged({ status: false })
                                        localStorage.removeItem('token')
                                        setLogError(true)
                                        setLoginModal(loginModal => ({
                                            ...loginModal,
                                            btn: true,
                                            member: true,
                                            active: true,
                                            forgot: false
                                        }))
                                    } else {
                                        setLoading(false)
                                        razorpay(data.data)
                                    }
                                }).catch(() => {
                                    alert("Error")
                                })
                            })
                        } else {
                            setLoading(true)
                            Server.post('/users/order-item-cod', {
                                userId: userLogged._id,
                                order: orderDetails
                            }).then(() => {
                                setLoading(false)
                                setOrderType(type => ({
                                    ...type,
                                    order: false,
                                    type: '',
                                    exAction: true,
                                    exActionData: {
                                        failed: false,
                                        success: true
                                    }
                                }))
                                navigate.push('/ordersuccess') // done page
                            }).catch((data) => {
                                setLoading(false)

                                setOrderType(type => ({
                                    ...type,
                                    order: false,
                                    type: '',
                                    exAction: true,
                                    exActionData: {
                                        failed: true,
                                        success: false
                                    }
                                }))
                                navigate.push('/orderfailed') // fail page
                            })
                        }
                    } else {
                        setLoading(false)
                        alert("Delivery not available your selected pincode")
                    }
                }).catch(() => {
                    setLoading(false)
                    alert("Error")
                })
            } else {
                alert("Pincode must 10 numbers")
            }
        } else {
            alert("Pincode must 6 numbers")
        }

    }

    return (
        <>
            {
                loading ? <Loading />
                    : (
                        <div className='CheckoutComp'>
                            {
                                savedAddress['saved'].length > 1 && (
                                    <Modal setOrderDetails={setOrderDetails} savedAddress={savedAddress} />
                                )
                            }

                            <form onSubmit={checkoutForm}>
                                <div className="container">
                                    {
                                        width > 767 && (
                                            <div className="desktop">

                                                <div className="leftDiv">
                                                    <div className='FormCard' style={{
                                                        paddingLeft: '2em', paddingRight: '2em',
                                                        paddingTop: '1.5em', paddingBottom: '1em'
                                                    }}>
                                                        {
                                                            savedAddress['saved'].length !== 0 && (
                                                                <div className="AddressCard">
                                                                    <div className='row'>
                                                                        <div className="col-9">
                                                                            <div>
                                                                                <h6 className='font-bold text-small'>{savedAddress['saved'][0].name} {savedAddress['saved'][0].number}</h6>
                                                                            </div>
                                                                            <div>
                                                                                <p className='text-small mb-1'>{savedAddress['saved'][0].address}, {savedAddress['saved'][0].locality}, {savedAddress['saved'][0].city}</p>
                                                                                <p className='text-small mb-1'>{savedAddress['saved'][0].state} - <span className='font-bold' >{savedAddress['saved'][0].pin}</span></p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-3" style={{ textAlign: 'right' }}>
                                                                            <div className="row">
                                                                                <div className="col-12">
                                                                                    <button type='button' data-for="select"
                                                                                        onClick={() => {
                                                                                            setOrderDetails({
                                                                                                ...orderDetails,
                                                                                                name: savedAddress['saved'][0].name,
                                                                                                number: savedAddress['saved'][0].number,
                                                                                                pin: savedAddress['saved'][0].pin,
                                                                                                locality: savedAddress['saved'][0].locality,
                                                                                                address: savedAddress['saved'][0].address,
                                                                                                city: savedAddress['saved'][0].city,
                                                                                                state: savedAddress['saved'][0].state
                                                                                            })
                                                                                        }} >Select</button>
                                                                                </div>
                                                                                {
                                                                                    savedAddress['saved'].length > 1 && (
                                                                                        <div className='col-12'>
                                                                                            <button type='button' data-for="more"
                                                                                                data-bs-toggle="modal" data-bs-target="#addressModal"
                                                                                            >Show More</button>
                                                                                        </div>
                                                                                    )
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                    <div className='FormCard'>
                                                        <div className="row">
                                                            <div className="col-md-6 mb-3">
                                                                <input type="text" value={orderDetails.name} onInput={(e) => {
                                                                    setOrderDetails({
                                                                        ...orderDetails,
                                                                        name: e.target.value
                                                                    })
                                                                }} placeholder='Name' required />
                                                            </div>
                                                            <div className="col-md-6 mb-3">
                                                                <input type="number" value={orderDetails.number} onInput={(e) => {
                                                                    setOrderDetails({
                                                                        ...orderDetails,
                                                                        number: e.target.value
                                                                    })
                                                                }} placeholder='10-digit mobile number' required />
                                                            </div>
                                                            <div className="col-md-6 mb-3">
                                                                <input type="number" value={orderDetails.pin} onInput={(e) => {
                                                                    setOrderDetails({
                                                                        ...orderDetails,
                                                                        pin: e.target.value
                                                                    })
                                                                }} placeholder='Pincode' required />
                                                            </div>
                                                            <div className="col-md-6 mb-3">
                                                                <input type="text" value={orderDetails.locality} onInput={(e) => {
                                                                    setOrderDetails({
                                                                        ...orderDetails,
                                                                        locality: e.target.value
                                                                    })
                                                                }} placeholder='Locality' required />
                                                            </div>
                                                            <div className="col-12 mb-3">
                                                                <textarea value={orderDetails.address} onInput={(e) => {
                                                                    setOrderDetails({
                                                                        ...orderDetails,
                                                                        address: e.target.value
                                                                    })
                                                                }} placeholder='Address (Area and Street)' cols="30" rows="10" required></textarea>
                                                            </div>
                                                            <div className="col-md-6 mb-3">
                                                                <input value={orderDetails.city} onInput={(e) => {
                                                                    setOrderDetails({
                                                                        ...orderDetails,
                                                                        city: e.target.value
                                                                    })
                                                                }} type="text" placeholder='City/District/Town' required />
                                                            </div>
                                                            <div className="col-md-6 mb-3">
                                                                <select value={orderDetails.state} onChange={(e) => {
                                                                    setOrderDetails({
                                                                        ...orderDetails,
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
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="rightDiv">

                                                    <div className='CheckoutAmtCard'>
                                                        <div className='subDiv'>
                                                            <h6 className='UserGrayMain font-bold'>PRICE DETAILS</h6>
                                                        </div>
                                                        <div className='lastDiv'>
                                                            <div className='AmtDiv'>
                                                                <div>
                                                                    <p>Price</p>
                                                                    <p>Discount</p>
                                                                    <p>MRP</p>
                                                                    <h6 className='font-bold'>Total Amount</h6>
                                                                </div>

                                                                <div>
                                                                    <p>₹ {amount.totalPrice}</p>
                                                                    <p>₹ {amount.totalDiscount}</p>
                                                                    <p>₹ {amount.totalMrp}</p>
                                                                    <h6 className='font-bold'>₹ {amount.totalPrice}</h6>
                                                                </div>

                                                            </div>
                                                        </div>

                                                        <div className='cuponInDiv'>
                                                            <input type="text" value={cupon} onInput={(e) => {
                                                                setCupon(e.target.value)
                                                                if (e.target.value.length < 5) {
                                                                    if (e.target.value.length > 0) {
                                                                        setCuponErr(true)
                                                                        setAmount(amountOrg)
                                                                        setDiscount({
                                                                            min: 0,
                                                                            discount: 0
                                                                        })
                                                                    } else {
                                                                        setAmount(amountOrg)
                                                                        setDiscount({
                                                                            min: 0,
                                                                            discount: 0
                                                                        })
                                                                        setCuponErr(false)
                                                                    }
                                                                } else {
                                                                    setAmount(amountOrg)
                                                                    setDiscount({
                                                                        min: 0,
                                                                        discount: 0
                                                                    })

                                                                    Server.get('/users/findCupon', {
                                                                        params: {
                                                                            code: e.target.value
                                                                        }
                                                                    }).then((res) => {

                                                                        setDiscount(res.data)

                                                                        if (OrderType.type === 'cart') {

                                                                            userAxios((server) => {
                                                                                server.get('/users/getCartTotalPriceCheckout', {
                                                                                    params: {
                                                                                        discount: res.data
                                                                                    }
                                                                                }).then((response) => {
                                                                                    if (response.data.login) {
                                                                                        setLoading(false)
                                                                                        setUserLogged({ status: false })
                                                                                        localStorage.removeItem('token')
                                                                                        setLogError(true)
                                                                                        setLoginModal(loginModal => ({
                                                                                            ...loginModal,
                                                                                            btn: true,
                                                                                            member: true,
                                                                                            active: true,
                                                                                            forgot: false
                                                                                        }))
                                                                                    } else {
                                                                                        if (response.data['amount'].totalPrice > 0) {
                                                                                            setAmount(response.data['amount'])
                                                                                            setCuponErr(false)
                                                                                        }
                                                                                    }
                                                                                }).catch((err) => {
                                                                                    setCuponErr(true)
                                                                                })
                                                                            })

                                                                        } else {

                                                                            userAxios((server) => {
                                                                                server.get('/users/getTotalPriceProduct', {
                                                                                    params: {
                                                                                        proId: OrderType.proId,
                                                                                        quantity: OrderType.quantity,
                                                                                        discount: res.data,
                                                                                        buyDetails: OrderType.buyDetails
                                                                                    }
                                                                                }).then((response) => {
                                                                                    if (response.data.login) {
                                                                                        setLoading(false)
                                                                                        setUserLogged({ status: false })
                                                                                        localStorage.removeItem('token')
                                                                                        setLogError(true)
                                                                                        setLoginModal(loginModal => ({
                                                                                            ...loginModal,
                                                                                            btn: true,
                                                                                            member: true,
                                                                                            active: true,
                                                                                            forgot: false
                                                                                        }))
                                                                                    } else {
                                                                                        if (response.data['amount'].totalPrice > 0) {
                                                                                            setAmount(response.data['amount'])
                                                                                            setCuponErr(false)
                                                                                        }
                                                                                    }
                                                                                }).catch((err) => {
                                                                                    setCuponErr(true)
                                                                                })
                                                                            })

                                                                        }

                                                                    }).catch(() => {
                                                                        console.log("ERR")
                                                                        setCuponErr(true)
                                                                    })
                                                                }
                                                            }} placeholder='Cupon Code' />

                                                            {
                                                                cuponErr && <label className='text-small' style={{ color: 'red' }}>Cupon not valid</label>
                                                            }

                                                        </div>

                                                        <div className="wrapper">
                                                            <div className="row">
                                                                <div className="col-6">
                                                                    <input type="radio" id="option-1"
                                                                        value='cod' checked={orderDetails.payType === 'cod'}
                                                                        onChange={(e) => {
                                                                            setOrderDetails({
                                                                                ...orderDetails,
                                                                                payType: e.target.value
                                                                            })
                                                                        }} />

                                                                    <div className="BtnDiv" onClick={() => {
                                                                        setOrderDetails({
                                                                            ...orderDetails,
                                                                            payType: 'cod'
                                                                        })
                                                                    }}>
                                                                        <label>COD</label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-6">
                                                                    <input type="radio" id="option-1"
                                                                        value='online' checked={orderDetails.payType === 'online'}
                                                                        onChange={(e) => {
                                                                            setOrderDetails({
                                                                                ...orderDetails,
                                                                                payType: e.target.value
                                                                            })
                                                                        }} />

                                                                    <div className="BtnDiv" onClick={() => {
                                                                        setOrderDetails({
                                                                            ...orderDetails,
                                                                            payType: 'online'
                                                                        })
                                                                    }}>
                                                                        <label>ONLINE</label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className='orderBtnDiv'>
                                                            <button type='submit' className='orderBtn'>place order</button>
                                                        </div>

                                                    </div>

                                                </div>
                                            </div>
                                        )
                                    }

                                    {
                                        width <= 767 && (
                                            <div className="Mobile">
                                                <div className='FormCard' style={{
                                                    paddingLeft: '1em', paddingRight: '1em',
                                                    paddingTop: '1.5em', paddingBottom: '1em'
                                                }}>
                                                    {
                                                        savedAddress['saved'].length !== 0 && (
                                                            <div className="AddressCard">
                                                                <div className='row'>
                                                                    <div className="col-7">
                                                                        <div>
                                                                            <h6 className='font-bold text-small'>{savedAddress['saved'][0].name} {savedAddress['saved'][0].number}</h6>
                                                                        </div>
                                                                        <div>
                                                                            <p className='text-small mb-1'>{savedAddress['saved'][0].address}, {savedAddress['saved'][0].locality}, {savedAddress['saved'][0].city}</p>
                                                                            <p className='text-small mb-1'>{savedAddress['saved'][0].state} - <span className='font-bold' >{savedAddress['saved'][0].pin}</span></p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-5" style={{ textAlign: 'right' }}>
                                                                        <div className="row">
                                                                            <div className="col-12">
                                                                                <button type='button' data-for="select"
                                                                                    onClick={() => {
                                                                                        setOrderDetails({
                                                                                            ...orderDetails,
                                                                                            name: savedAddress['saved'][0].name,
                                                                                            number: savedAddress['saved'][0].number,
                                                                                            pin: savedAddress['saved'][0].pin,
                                                                                            locality: savedAddress['saved'][0].locality,
                                                                                            address: savedAddress['saved'][0].address,
                                                                                            city: savedAddress['saved'][0].city,
                                                                                            state: savedAddress['saved'][0].state
                                                                                        })
                                                                                    }} >Select</button>
                                                                            </div>
                                                                            {
                                                                                savedAddress['saved'].length > 1 && (
                                                                                    <div className='col-12'>
                                                                                        <button type='button' data-for="more"
                                                                                            data-bs-toggle="modal" data-bs-target="#addressModal"
                                                                                        >Show More</button>
                                                                                    </div>
                                                                                )
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                                <div className='FormCard'>
                                                    <div className="row">
                                                        <div className="col-md-6 mb-3">
                                                            <input type="text" value={orderDetails.name} onInput={(e) => {
                                                                setOrderDetails({
                                                                    ...orderDetails,
                                                                    name: e.target.value
                                                                })
                                                            }} placeholder='Name' required />
                                                        </div>
                                                        <div className="col-md-6 mb-3">
                                                            <input type="number" value={orderDetails.number} onInput={(e) => {
                                                                setOrderDetails({
                                                                    ...orderDetails,
                                                                    number: e.target.value
                                                                })
                                                            }} placeholder='10-digit mobile number' required />
                                                        </div>
                                                        <div className="col-md-6 mb-3">
                                                            <input type="number" value={orderDetails.pin} onInput={(e) => {
                                                                setOrderDetails({
                                                                    ...orderDetails,
                                                                    pin: e.target.value
                                                                })
                                                            }} placeholder='Pincode' required />
                                                        </div>
                                                        <div className="col-md-6 mb-3">
                                                            <input type="text" value={orderDetails.locality} onInput={(e) => {
                                                                setOrderDetails({
                                                                    ...orderDetails,
                                                                    locality: e.target.value
                                                                })
                                                            }} placeholder='Locality' required />
                                                        </div>
                                                        <div className="col-12 mb-3">
                                                            <textarea value={orderDetails.address} onInput={(e) => {
                                                                setOrderDetails({
                                                                    ...orderDetails,
                                                                    address: e.target.value
                                                                })
                                                            }} placeholder='Address (Area and Street)' cols="30" rows="10" required></textarea>
                                                        </div>
                                                        <div className="col-md-6 mb-3">
                                                            <input value={orderDetails.city} onInput={(e) => {
                                                                setOrderDetails({
                                                                    ...orderDetails,
                                                                    city: e.target.value
                                                                })
                                                            }} type="text" placeholder='City/District/Town' required />
                                                        </div>
                                                        <div className="col-md-6 mb-3">
                                                            <select value={orderDetails.state} onChange={(e) => {
                                                                setOrderDetails({
                                                                    ...orderDetails,
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
                                                    </div>
                                                </div>

                                                <div className='CheckoutAmtCard'>
                                                    <div className='subDiv'>
                                                        <h6 className='UserGrayMain font-bold'>PRICE DETAILS</h6>
                                                    </div>
                                                    <div className='lastSub'>
                                                        <div className='AmtDiv'>
                                                            <div>
                                                                <p>Price </p>
                                                                <p>Discount</p>
                                                                <p>MRP </p>
                                                                <h6 className='font-bold'>Total Amount</h6>
                                                            </div>

                                                            <div>
                                                                <p>₹ {amount.totalPrice}</p>
                                                                <p>₹ {amount.totalDiscount}</p>
                                                                <p>₹ {amount.totalMrp}</p>
                                                                <h6 className='font-bold'>₹ {amount.totalPrice}</h6>
                                                            </div>

                                                        </div>
                                                    </div>

                                                    <div className='cuponInDiv'>
                                                        <input type="text" value={cupon} onInput={(e) => {
                                                            setCupon(e.target.value)
                                                            if (e.target.value.length < 5) {
                                                                if (e.target.value.length > 0) {
                                                                    setCuponErr(true)
                                                                    setAmount(amountOrg)
                                                                    setDiscount({
                                                                        min: 0,
                                                                        discount: 0
                                                                    })
                                                                } else {
                                                                    setAmount(amountOrg)
                                                                    setDiscount({
                                                                        min: 0,
                                                                        discount: 0
                                                                    })
                                                                    setCuponErr(false)
                                                                }
                                                            } else {
                                                                setAmount(amountOrg)
                                                                setDiscount({
                                                                    min: 0,
                                                                    discount: 0
                                                                })

                                                                Server.get('/users/findCupon', {
                                                                    params: {
                                                                        code: e.target.value
                                                                    }
                                                                }).then((res) => {

                                                                    setDiscount(res.data)

                                                                    if (OrderType.type === 'cart') {

                                                                        userAxios((server) => {
                                                                            server.get('/users/getCartTotalPriceCheckout', {
                                                                                params: {
                                                                                    discount: res.data
                                                                                }
                                                                            }).then((response) => {
                                                                                if (response.data.login) {
                                                                                    setLoading(false)
                                                                                    setUserLogged({ status: false })
                                                                                    localStorage.removeItem('token')
                                                                                    setLogError(true)
                                                                                    setLoginModal(loginModal => ({
                                                                                        ...loginModal,
                                                                                        btn: true,
                                                                                        member: true,
                                                                                        active: true,
                                                                                        forgot: false
                                                                                    }))
                                                                                } else {
                                                                                    if (response.data['amount'].totalPrice > 0) {
                                                                                        setAmount(response.data['amount'])
                                                                                        setCuponErr(false)
                                                                                    }
                                                                                }

                                                                            }).catch((err) => {
                                                                                setCuponErr(true)
                                                                            })
                                                                        })

                                                                    } else {

                                                                        userAxios((server) => {
                                                                            server.get('/users/getTotalPriceProduct', {
                                                                                params: {
                                                                                    proId: OrderType.proId,
                                                                                    quantity: OrderType.quantity,
                                                                                    discount: res.data
                                                                                }
                                                                            }).then((response) => {
                                                                                if (response.data.login) {
                                                                                    setLoading(false)
                                                                                    setUserLogged({ status: false })
                                                                                    localStorage.removeItem('token')
                                                                                    setLogError(true)
                                                                                    setLoginModal(loginModal => ({
                                                                                        ...loginModal,
                                                                                        btn: true,
                                                                                        member: true,
                                                                                        active: true,
                                                                                        forgot: false
                                                                                    }))
                                                                                } else {
                                                                                    if (response.data['amount'].totalPrice > 0) {
                                                                                        setAmount(response.data['amount'])
                                                                                        setCuponErr(false)
                                                                                    }
                                                                                }
                                                                            }).catch((err) => {
                                                                                setCuponErr(true)
                                                                            })
                                                                        })

                                                                    }

                                                                }).catch(() => {
                                                                    console.log("ERR")
                                                                    setCuponErr(true)
                                                                })
                                                            }
                                                        }} placeholder='Cupon Code' />
                                                        {
                                                            cuponErr && <label className='text-small' style={{ color: 'red' }}>Cupon not valid</label>
                                                        }
                                                    </div>

                                                    <div className="wrapper">
                                                        <div className="row">
                                                            <div className="col-6">
                                                                <input type="radio" id="option-1"
                                                                    value='cod' checked={orderDetails.payType === 'cod'}
                                                                    onChange={(e) => {
                                                                        setOrderDetails({
                                                                            ...orderDetails,
                                                                            payType: e.target.value
                                                                        })
                                                                    }} />

                                                                <div className="BtnDiv" onClick={() => {
                                                                    setOrderDetails({
                                                                        ...orderDetails,
                                                                        payType: 'cod'
                                                                    })
                                                                }}>
                                                                    <label>COD</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-6">
                                                                <input type="radio" id="option-1"
                                                                    value='online' checked={orderDetails.payType === 'online'}
                                                                    onChange={(e) => {
                                                                        setOrderDetails({
                                                                            ...orderDetails,
                                                                            payType: e.target.value
                                                                        })
                                                                    }} />

                                                                <div className="BtnDiv" onClick={() => {
                                                                    setOrderDetails({
                                                                        ...orderDetails,
                                                                        payType: 'online'
                                                                    })
                                                                }}>
                                                                    <label>ONLINE</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>

                                            </div>
                                        )
                                    }
                                </div>

                                {
                                    width <= 767 && (
                                        <div className='CheckoutAmtCardFixed'>
                                            <div className='container'>
                                                <div className="MainDiv">
                                                    <div>
                                                        <h6 className='font-bold UserGrayMain'><small><del>₹ {amount.totalMrp}</del></small></h6>
                                                        <h6 className='font-bold UserBlackMain'>₹ {amount.totalPrice}</h6>
                                                    </div>

                                                    <div>
                                                        <button type='submit' className='orderBtn'>place order</button>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            </form>
                        </div >
                    )
            }
        </>
    )
}

export default CheckoutComp