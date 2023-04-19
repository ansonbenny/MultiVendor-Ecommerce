import { adminAxios } from '../../../Config/Server'
import { useContext, useState } from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Loading from '@/Component/Loading/Loading'
import ContentControl from '@/ContentControl/ContentControl'

function OrdersComp({ loaded, setLoaded }) {
    const { setAdminLogged } = useContext(ContentControl)
    const [search, setSearch] = useState('')
    const [Orders, setOrders] = useState([])
    const [total, setTotal] = useState(0)

    let navigate = useRouter()

    const logOut = () => {
        setAdminLogged({ status: false })
        localStorage.removeItem("adminToken")
        setLoaded(true)
        navigate.push('/admin/login')
    }

    useEffect(() => {
        adminAxios((server) => {
            server.get('/admin/getAllOrders', {
                params: {
                    search: search,
                    skip: 0,
                }
            }).then((res) => {
                if (res.data.login) {
                    logOut()
                } else {
                    setOrders(res.data.orders)
                    setTotal(res.data.total)
                    setLoaded(true)
                }
            }).catch(() => {
                console.log('err')
                setLoaded(true)
            })
        })
    }, [search])

    return (
        <>
            {
                loaded ? (
                    <div className='OrdersComp'>
                        <div className='AdminContainer pb-3'>

                            <div className="BtnsSections text-center pt-3">
                                <div className="row">
                                    <div className="col-12 col-md-4 pb-2">
                                        <input type="text" value={search} onInput={(e) => {
                                            setSearch(e.target.value)
                                        }} placeholder='Search Name' name="" id="" />
                                    </div>

                                </div>
                            </div>

                            <div className='MainTable text-center'>
                                <table className="table align-middle">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Customer</th>
                                            <th>Price</th>
                                            <th>Pay</th>
                                            <th>Order</th>
                                            <th>Id-Secret</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {
                                            Orders.map((obj, key) => {
                                                return (
                                                    <tr key={key}>
                                                        <td>{obj.date}</td>
                                                        <td>{obj.customer}</td>
                                                        <td>{obj.price}</td>
                                                        <td>{obj.payType}</td>
                                                        <td>{obj.OrderStatus}</td>
                                                        <td>{obj.secretOrderId}</td>
                                                        <td>
                                                            <button className='ActionBtn' onClick={() => {
                                                                navigate.push(`/admin/orders/${obj.secretOrderId}/${obj.userId}`)
                                                            }}>Edit</button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>

                            {
                                Orders.length !== total && <div>
                                    <button data-for="loadMore" onClick={() => {
                                        adminAxios((server) => {
                                            server.get('/admin/getAllOrders', {
                                                params: {
                                                    search: search,
                                                    skip: Orders.length,
                                                }
                                            }).then((res) => {
                                                if (res.data.login) {
                                                    logOut()
                                                } else {
                                                    setOrders([...Orders, ...res.data.orders])
                                                    setTotal(res.data.total)
                                                }
                                            }).catch(() => {
                                                console.log('err')
                                            })
                                        })
                                    }}>Load More</button>
                                </div>
                            }
                        </div>
                    </div>
                ) : <Loading />
            }
        </>
    )
}

export default OrdersComp