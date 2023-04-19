import Head from "next/head"
import { Fragment, useContext, useEffect, useState } from "react"
import dynamic from "next/dynamic"
import ContentControl from "@/ContentControl/ContentControl"
import { userAxios } from "@/Config/Server"
import LoginError from "@/Component/Error/LoginError"
import { useRouter } from "next/router"
const Footer = dynamic(() => import('@/Component/User/Footer/Footer'))
const Header = dynamic(() => import('@/Component/User/Header/Header'))
const CheckoutComp = dynamic(() => import('@/Component/User/Checkout/CheckoutComp'))

function Checkout() {
    const {
        userLogged, setLoginModal,
        setUserLogged, OrderType, setOrderType
    } = useContext(ContentControl)

    const navigate = useRouter()

    const [razorpayKey, setRazorpayKey] = useState('')

    const [loading, setLoading] = useState(false)

    const [logError, setLogError] = useState(false)

    useEffect(() => {
        var script = document.createElement('script')

        script.src = 'https://checkout.razorpay.com/v1/checkout.js'

        document.body.appendChild(script)
    }, [])

    const [savedAddress, setAddress] = useState({ saved: [] })

    const [discount, setDiscount] = useState({
        min: 0,
        discount: 0
    })

    const [amount, setAmount] = useState({
        totalPrice: 0,
        totalMrp: 0,
        totalDiscount: 0,
    })

    const [amountOrg, setAmountOrg] = useState({
        totalPrice: 0,
        totalMrp: 0,
        totalDiscount: 0,
    })

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!OrderType.order) {
            navigate.push('/')
        } else {
            if (token) {
                setLogError(false)
                if (OrderType.type === 'cart') {
                    userAxios((server) => {
                        server.get('/users/getCartTotalPriceCheckout', {
                            params: {
                                discount: discount
                            }
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
                                if (res.data['amount'].totalPrice > 0) {
                                    setAddress(res.data['address'])
                                    setAmount(res.data['amount'])
                                    setAmountOrg(res.data['amount'])
                                    setRazorpayKey(res.data['key'])
                                } else {
                                    alert("Something Wrong")
                                    navigate.push('/')
                                }
                            }
                        }).catch((err) => {
                            alert("Something Wrong")
                            navigate.push('/')
                        })
                    })
                } else {
                    userAxios((server) => {
                        server.get('/users/getTotalPriceProduct', {
                            params: {
                                proId: OrderType.proId,
                                quantity: OrderType.quantity,
                                discount: discount,
                                buyDetails: OrderType.buyDetails
                            }
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
                                if (res.data['amount'].totalPrice > 0) {
                                    setAddress(res.data['address'])
                                    setAmount(res.data['amount'])
                                    setAmountOrg(res.data['amount'])
                                    setRazorpayKey(res.data['key'])
                                } else {
                                    alert("Something Wrong")
                                    navigate.push('/')
                                }
                            }
                        }).catch((err) => {
                            alert("Something Wrong")
                            navigate.push('/')
                        })
                    })
                }
            } else {
                setLogError(true)
                setLoginModal(loginModal => ({
                    ...loginModal,
                    btn: true,
                    member: true,
                    active: true
                }))
            }
        }

    }, [userLogged])

    return (
        <Fragment>
            <Head>
                <title>Aquariun - Checkout</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <main>
                {
                    !loading && <Header />
                }
                {
                    logError ? <LoginError />
                        : <CheckoutComp
                            amount={amount}
                            setAmount={setAmount}
                            amountOrg={amountOrg}
                            OrderType={OrderType}
                            setDiscount={setDiscount}
                            discount={discount}
                            loading={loading}
                            setOrderType={setOrderType}
                            setLoading={setLoading}
                            setLogError={setLogError}
                            razorpayKey={razorpayKey}
                            savedAddress={savedAddress} />
                }
                <Footer />
            </main>
        </Fragment>
    )
}

export default Checkout