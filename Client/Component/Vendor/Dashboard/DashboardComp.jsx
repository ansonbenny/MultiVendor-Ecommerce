import { useRouter } from "next/router"

function DashboardComp({response}) {
    const navigate = useRouter()
    return (
        <div className='containerVendor'>
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
                                        <th>Payment</th>
                                        <th>Status</th>
                                        <th>Actions</th>
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
                                                    <td>
                                                        <button data-for="actionBtn" onClick={() => {
                                                            navigate.push(`/vendor/orders/${obj.secretOrderId}/${obj.userId}`)
                                                        }}>Details</button>
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