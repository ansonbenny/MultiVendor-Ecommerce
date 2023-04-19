import { useRouter } from 'next/router'
import Server from '../../../Config/Server'

function EditOrder({ Order }) {

    return (
        <div className='container container-fluid OrderDetails'>
            <div className="innerDiv">
                <div className='ProductBtnDiv mb-3'>
                    <button data-for="showproduct" className='me-3' onClick={() => {
                        window.open(`/p/${Order.slug}/${Order.proId}`, '_blank')
                    }}>Show Product</button>
                </div>
                <div className="row">

                    <div className='col-12'>
                        <label >Order Status</label><br />
                        <input type="text" value={Order.OrderStatus} readOnly disabled />
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
                        <label >Order Created On</label><br />
                        <input type="text" value={Order.created} readOnly disabled />
                    </div>

                    <div className='col-12'>
                        <label >Variant Size</label><br />
                        <input type="text" value={Order.variantSize} readOnly disabled />
                    </div>

                    <div className='col-12'>
                        <label >Secret Order Id</label><br />
                        <input type="text" value={Order.secretOrderId} readOnly disabled />
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
            </div >
        </div >
    )
}

export default EditOrder