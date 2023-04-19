import ContentControl from '@/ContentControl/ContentControl'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { adminAxios } from '../../../Config/Server'

function EditOrder({ Order, setOrder }) {
    const { setAdminLogged } = useContext(ContentControl)
    const navigate = useRouter()

    function FormSubmit(e) {
        e.preventDefault()
        adminAxios((server) => {
            server.put('/admin/editOrder', {
                order_id_shiprocket: Order.order_id_shiprocket,
                shipment_id: Order.shipment_id,
                OrderStatus: Order.OrderStatus,
                userId: Order.userId,
                secretOrderId: Order.secretOrderId,
                updated: Order.updated,
            }).then((res) => {
                if (res.data.login) {
                    setAdminLogged({ status: false })
                    localStorage.removeItem("adminToken")
                    navigate.push('/admin/login')
                } else {
                    alert('Done')
                }
            }).catch(() => {
                alert('Sorry for facing error')
            })
        })
    }

    return (
        <div className='AdminContainer EditOrder'>
            <div className="innerDiv">
                <div className='ExitDiv mb-3'>
                    <button style={{ width: '8em' }} className='me-3' onClick={() => {
                        window.open(`/p/${Order.slug}/${Order.proId}`, '_blank')
                    }}>Show Product</button>
                    <button onClick={() => {
                        navigate.push('/admin/orders')
                    }}>CLOSE</button>
                </div>
                <form onSubmit={FormSubmit}>

                    <div className="row">
                        <div className='col-6'>
                            <label >ShipRocket Order Id</label><br />
                            <input value={Order.order_id_shiprocket} onInput={(e) => {
                                setOrder({
                                    ...Order,
                                    order_id_shiprocket: e.target.value
                                })
                            }} type="text" />
                        </div>

                        <div className='col-6'>
                            <label >Shipment Id</label><br />
                            <input value={Order.shipment_id} onInput={(e) => {
                                setOrder({
                                    ...Order,
                                    shipment_id: e.target.value
                                })
                            }} type="text" />
                        </div>


                        {
                            Order.OrderStatus !== 'Failed' && (
                                <>
                                    <div className='col-12'>
                                        <label>Change Status</label><br />
                                        <select value={Order.OrderStatus} onInput={(e) => {
                                            setOrder({
                                                ...Order,
                                                OrderStatus: e.target.value
                                            })
                                        }}>
                                            <option value={Order.OrderStatus}>{Order.OrderStatus}</option>
                                            <option value="Cancelled">Cancelled</option>
                                            <option value="Return">Return</option>
                                            <option value="Pending">Pending</option>
                                            <option value="Delivered">Delivered</option>
                                        </select>
                                    </div>

                                    {
                                        Order.OrderStatus === 'Return' && (
                                            <div className='col-12'>
                                                <label>Return Reason</label><br />
                                                <textarea value={Order.returnReason} cols="30" rows="10" disabled></textarea>
                                            </div>
                                        )
                                    }

                                    <div className='col-12'>
                                        <button className='submitBnt'>Update</button>
                                    </div>
                                </>
                            )
                        }

                        {
                            Order.vendorId && <div className='col-12'>
                                <button className='submitBnt'
                                    style={{ width: '100%', background: 'white', color: '#333' }}
                                    onClick={() => {
                                        navigate.push(`/admin/vendor/details/${Order.vendorId}`)
                                    }}>Vendor Details</button>
                            </div>
                        }

                        <div className='col-12'>
                            <label >Order Created On</label><br />
                            <input type="text" value={Order.created} readOnly disabled />
                        </div>

                        <div className='col-12'>
                            <label >Order Status</label><br />
                            <input type="text" value={Order.OrderStatus} readOnly disabled />
                        </div>

                        <div className='col-12'>
                            <label >Variant Size</label><br />
                            <input type="text" value={Order.variantSize} readOnly disabled />
                        </div>

                        <div className='col-12'>
                            <label >Secret Order Id</label><br />
                            <input type="text" value={Order.secretOrderId} readOnly disabled />
                        </div>

                        <div className='col-12'>
                            <label >User Id</label><br />
                            <input type="text" value={Order.userId} readOnly disabled />
                        </div>

                        <div className='col-6'>
                            <label >Payment Type</label><br />
                            <input type="text" value={Order.details.payType} readOnly disabled />
                        </div>

                        <div className='col-6'>
                            <label >Payment Id</label><br />
                            <input type="text" value={Order.payId} readOnly disabled />
                        </div>

                        <div className='col-12'>
                            <label >Product Name</label><br />
                            <textarea value={Order.proName} type="text" readOnly disabled ></textarea>
                        </div>

                        <div className='col-12'>
                            <label >Quantity</label><br />
                            <input type="number" value={Order.quantity} readOnly disabled />
                        </div>

                        <div className='col-6'>
                            <label >Price</label><br />
                            <input type="number" value={Order.price} readOnly disabled />
                        </div>

                        <div className='col-6'>
                            <label >MRP</label><br />
                            <input type="number" value={Order.mrp} readOnly disabled />
                        </div>

                        <div className='col-6'>
                            <label >Name</label><br />
                            <input type="text" value={Order.details.name} readOnly disabled />
                        </div>

                        <div className='col-6'>
                            <label >Locality</label><br />
                            <input type="text" value={Order.details.locality} readOnly disabled />
                        </div>

                        <div className='col-12'>
                            <label >Number</label><br />
                            <input type="text" value={Order.details.number} readOnly disabled />
                        </div>

                        <div className='col-12'>
                            <label >Email</label><br />
                            <input type="text" value={Order.details.email} readOnly disabled />
                        </div>

                        <div className='col-12'>
                            <label >Address</label><br />
                            <textarea type="text" value={Order.details.address} readOnly disabled ></textarea>
                        </div>

                        <div className='col-6'>
                            <label >Pin Code</label><br />
                            <input type="text" value={Order.details.pin} readOnly disabled />
                        </div>

                        <div className='col-6'>
                            <label >City</label><br />
                            <input type="text" value={Order.details.city} readOnly disabled />
                        </div>

                        <div className='col-12 mb-5'>
                            <label >State</label><br />
                            <input type="text" value={Order.details.state} readOnly disabled />
                        </div>

                    </div>

                </form>
            </div >
        </div >
    )
}

export default EditOrder