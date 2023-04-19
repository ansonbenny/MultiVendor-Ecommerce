import { useContext } from 'react'
import OrdersEmtyIcon from '../../../Assets/OrdersEmtyIcon'
import UserIcon from '../../../Assets/UserIcon'
import TruckIcon from '../../../Assets/TruckIcon'
import HeartIcon from '../../../Assets/HeartIcon'
import CartIcon from '../../../Assets/CartIcon'
import LocationIcon from '../../../Assets/LocationIcon'
import LogoutIcon from '../../../Assets/logoutIcon'
import Link from 'next/link'
import { ServerId, userAxios } from '../../../Config/Server'
import { useState } from 'react'
import { useEffect } from 'react'
import ContentControl from '../../../ContentControl/ContentControl'
import { useRouter } from 'next/router'

function OrdersComp({ setSearch, search, Orders, setOrders, total, setTotal, setLogError }) {
    const navigate = useRouter()

    const { setUserLogged, setLoginModal } = useContext(ContentControl)

    const [ShowNull, setShowNull] = useState(false)

    useEffect(() => {
        if (Orders && Orders.length !== 0) {
            setShowNull(false)
        } else {
            setShowNull(true)
        }
    }, [])
    return (
        <div className='OrdersComp'>
            <div className="container container-fluid pt-5 pb-5">

                <div>
                    <div className='pb-4 MobNon'>
                        <h3 className='UserBlackMain font-bold'>My Account</h3>
                    </div>

                    <div className="row">

                        <div className="col-12 col-md-3">
                            <div className="Menu">

                                <div className='BtnDiv'>
                                    <button onClick={() => {
                                        navigate.push('/account')
                                    }}>
                                        <span><UserIcon color={'#333'} /></span>
                                        <span className='span2'>My Details</span>
                                    </button>
                                </div>

                                <div className='BtnDiv'>
                                    <button onClick={() => {
                                        navigate.push('/address')
                                    }}>
                                        <span><LocationIcon color={'#333'} /></span>
                                        <span className='span2'>My Address</span>
                                    </button>
                                </div>

                                <div className='BtnDiv'>
                                    <button className='active'>
                                        <span><TruckIcon color={'#ffffff'} /></span>
                                        <span className='span2'>My Orders</span>
                                    </button>
                                </div>

                                <div className='BtnDiv'>
                                    <button onClick={() => {
                                        navigate.push('/wishlist')
                                    }}>
                                        <span><HeartIcon color={'#333'} /></span>
                                        <span className='span2'>My Wishlist</span>
                                    </button>
                                </div>

                                <div className='BtnDiv'>
                                    <button onClick={() => {
                                        navigate.push('/cart')
                                    }}>
                                        <span><CartIcon color={'#333'} /></span>
                                        <span className='span2'>My Cart</span>
                                    </button>
                                </div>

                                <div className='BtnDiv'>
                                    <button onClick={() => {
                                        setUserLogged({ status: false })
                                        localStorage.removeItem('token')
                                    }}>
                                        <span><LogoutIcon color={'#333'} /></span>
                                        <span className='span2'>Logout</span>
                                    </button>
                                </div>

                            </div>
                        </div>

                        <div className="col-12 col-md-9">
                            <div className="MainCard">
                                <div className='pb-3'>
                                    <h4 className='UserBlackMain font-bold'>My Orders</h4>
                                </div>

                                {
                                    ShowNull ? (
                                        <div className='text-center'>
                                            <div className='ErrorSection'>
                                                <OrdersEmtyIcon />
                                                <h5 className='UserGrayMain pt-2 pb-3'>Your orders is empty</h5>
                                            </div>
                                        </div >
                                    ) : (
                                        <div className='pt-2'>
                                            <div>
                                                <input className='searchIn'
                                                    placeholder='Search' value={search}
                                                    type="text" onInput={(e) => {
                                                        setSearch(e.target.value)
                                                    }} name="" id="" />
                                            </div>
                                            <div>
                                                <div className="row">
                                                    {
                                                        Orders.map((obj, key) => {
                                                            return (
                                                                <div className="col-12 mb-1" key={key}>
                                                                    <Link href={`/orders/${obj.secretOrderId}`} className='LinkTagNonDec'>
                                                                        <div className="orderCard">
                                                                            <div className="imgDiv">
                                                                                {
                                                                                    obj.files &&
                                                                                    <img src={`${ServerId}/product/${obj.uni_id_Mix}/${obj.files[0].filename}`} alt="" />
                                                                                }
                                                                            </div>

                                                                            <div className='Details'>
                                                                                <h4
                                                                                    className='oneLineTxt font-bold UserBlackMain'>
                                                                                    <small>{obj.name}</small>
                                                                                </h4>

                                                                                <h6 className='font-bold'>
                                                                                    <span><small><del className='UserGrayMain'>₹ {obj.mrp}</del></small></span>&nbsp;&nbsp;
                                                                                    <span className='UserBlackMain'>₹ {obj.price}</span>
                                                                                    &nbsp;&nbsp;
                                                                                    <span className='UserBlackMain'><small>QTY : {obj.quantity}</small></span>
                                                                                </h6>
                                                                                <h6 className='UserGreenMain'>
                                                                                    <small>Order {obj.date} - {obj.OrderStatus}</small>
                                                                                </h6>
                                                                            </div>
                                                                        </div>
                                                                    </Link>
                                                                </div>
                                                            )
                                                        })
                                                    }

                                                </div>
                                            </div>

                                            {
                                                total !== Orders.length && <div className='text-end'>
                                                    <button data-for="LoadMore" onClick={() => {
                                                        userAxios((server) => {
                                                            server.get('/users/getOrders', {
                                                                params: {
                                                                    search: search,
                                                                    skip: Orders.length
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
                                                                    setLogError(false)
                                                                    setOrders([...Orders, ...res.data.orders])
                                                                    setTotal(res.data.total)
                                                                }
                                                            }).catch(() => {
                                                                setLogError(false)
                                                                alert("Error")
                                                            })
                                                        })
                                                    }}>Load More</button>
                                                </div>
                                            }

                                        </div >
                                    )
                                }

                            </div>
                        </div>

                    </div>
                </div>

            </div >
        </div >
    )
}

export default OrdersComp