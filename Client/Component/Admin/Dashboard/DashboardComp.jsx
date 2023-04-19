import { adminAxios } from '@/Config/Server'
import ContentControl from '@/ContentControl/ContentControl'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'

function DashboardComp() {
    const { setAdminLogged } = useContext(ContentControl)
    const [response, setResponse] = useState({
        total: {
            totalDelivered: '',
            totalCancelled: '',
            totalReturn: '',
            totalAmount: ''
        },
        Orders: []
    })

    const navigate = useRouter()

    useEffect(() => {
        adminAxios((server) => {
            server.get('/admin/getDashboard').then((res) => {
                if (res.data.login) {
                    setAdminLogged({ status: false })
                    localStorage.removeItem("adminToken")
                    navigate.push('/admin/login')
                } else {
                    setResponse(res.data)
                }
            }).catch((err) => {
                alert("error")
            })
        })
    }, [])
    return (
        <div className='AdminContainer'>
            <div className="dashboard pb-3">
                <div className="row">
                    <div className="col-6 col-md-3">
                        <div className="cardDash mt-1">
                            <h6>Total Delivered</h6>
                            <h5>{response.total.totalDelivered}</h5>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="cardDash mt-1">
                            <h6>Total Return</h6>
                            <h5>{response.total.totalReturn}</h5>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="cardDash mt-1">
                            <h6>Total Cancelled</h6>
                            <h5>{response.total.totalCancelled}</h5>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="cardDash mt-1">
                            <h6>Total Amount</h6>
                            <h5>{response.total.totalAmount}</h5>
                        </div>
                    </div>
                </div>

                <div className='RecentOrder'>
                    <h6>Recent Orders</h6>
                    <div className='MainTable text-center'>
                        <div>
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
                                        response['Orders'].map((obj, key) => {
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
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardComp