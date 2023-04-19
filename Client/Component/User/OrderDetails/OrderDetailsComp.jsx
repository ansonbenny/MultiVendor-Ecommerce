import React, { useContext } from 'react'
import { useState } from 'react'
import { ServerId, userAxios } from '../../../Config/Server'
import ContentControl from '../../../ContentControl/ContentControl'
import Modal from './Modal'

function OrderDetailsComp({ order, setLoaded, setLogError, setUpdate }) {

  const [returnModal, setReturnModal] = useState({
    btn: false,
    active: false
  })

  const { setUserLogged, setLoginModal } = useContext(ContentControl)

  const cancelOrder = () => {
    userAxios((server) => {
      server.put('/users/cancelOrder', {
        order_id_shiprocket: order.order_id_shiprocket,
        payId: order.payId,
        payType: order.details.payType,
        secretOrderId: order.secretOrderId,
        price: order.price
      }).then((res) => {
        if (res.data.login) {
          setUserLogged({ status: false })
          localStorage.removeItem('token')
          setLogError(true)
          setLoaded(true)
          setLoginModal(loginModal => ({
            ...loginModal,
            btn: true,
            member: true,
            active: true,
            forgot: false
          }))
        } else {
          setUpdate(update => !update)
        }
      }).catch((err) => {
        alert('error')
      })
    })
  }

  return (
    <>
      {
        returnModal.active && <Modal
          order={order}
          setReturnModal={setReturnModal}
          returnModal={returnModal}
          setLogError={setLogError}
          setUpdate={setUpdate}
        />
      }
      <div className='OrderDetailsComp pt-5 pb-5'>
        <div className='container container-fluid'>

          <div className="row">
            <div className='col-5 col-md-3 col-lg-2'>
              <h6 className='text-small font-bold oneLineTxt pt-1'>
                <span className='UserBlackMain'>Order Id</span>
                &nbsp;
                <span style={{ color: 'red' }}>#{order.secretOrderId}</span>
              </h6>
            </div>

            <div className="col-7 col-md-9 col-lg-10">
              <button className='copyBtn' onClick={() => {
                navigator.clipboard.writeText(order.secretOrderId)
                alert("Copied")
              }}>
                copy Id
              </button>
            </div>

          </div>

          <div className="row mt-2">

            <div className="col-12 col-md-8">
              <div className="Card mt-3">
                <h6 className='pb-2 UserBlackMain font-bold'>Product</h6>

                <div className="ProImgDiv">
                  {
                    order.files ? <img src={`${ServerId}/product/${order.uni_id_Mix}/${order.files[0].filename}`} alt="product" />
                      : <img src="" alt="PRODUCT" />
                  }
                </div>

                <h6 className='text-small UserBlackMain pt-2'>
                  {order.proName}
                </h6>

                {
                  order.cancellation === 'true' &&
                    order.OrderStatus !== 'Cancelled' &&
                    order.OrderStatus !== 'Failed' &&
                    order.OrderStatus !== 'Delivered' &&
                    order.OrderStatus !== 'Return' &&
                    order.OrderStatus !== 'Destroyed' &&
                    order.OrderStatus !== 'Damaged' &&
                    order.OrderStatus !== 'Lost' &&
                    order.OrderStatus !== 'CANCELLED_BEFORE_DISPATCHED' ?
                    <button onClick={() => {
                      cancelOrder()
                    }}>Cancel</button> : null
                }

                {
                  order.OrderStatus === 'Delivered' && order.returnAvailable ?
                    <button onClick={() => {
                      setReturnModal({
                        ...returnModal,
                        active: true,
                        btn: true
                      })
                    }}>Return</button> : null
                }


              </div>
              <div className="Card mt-3">
                <h6 className='pb-2 UserBlackMain font-bold'>Tracking</h6>

                <h6 className='text-small UserBlackMain'>
                  <span className='font-bold'>Status:</span>
                  &nbsp;
                  <span>{order.OrderStatus}</span>
                </h6>

                {
                  order.OrderStatus === 'Delivered' &&
                    order.updated ? <h6 className='text-small UserBlackMain'>
                    <span className='font-bold'>Delivered:</span>
                    &nbsp;
                    <span>{order.updated}</span>
                  </h6>
                    : null
                }

                {
                  order.OrderStatus !== 'Cancelled' &&
                    order.OrderStatus !== 'Failed' &&
                    order.OrderStatus !== 'Delivered' &&
                    order.OrderStatus !== 'Return' &&
                    order.OrderStatus !== 'Destroyed' &&
                    order.OrderStatus !== 'Damaged' &&
                    order.OrderStatus !== 'Lost' &&
                    order.OrderStatus !== 'CANCELLED_BEFORE_DISPATCHED' &&
                    order.etd ?
                    <h6 className='text-small UserBlackMain'>
                      <span className='font-bold'>Estimated Date:</span>
                      &nbsp;
                      <span>{order.etd}</span>
                    </h6>
                    : null
                }

                <div className="row">
                  <div className="col-12 col-md-5">

                    <div className="trackingBar">

                      {
                        order.OrderStatus === 'Pending' && <div className="current"
                          style={{ maxWidth: '3%', background: '#60e290' }}
                        ></div>
                      }

                      {
                        order.OrderStatus === 'Pickup Error' ||
                          order.OrderStatus === 'Pickup Exception' ||
                          order.OrderStatus === 'Pickup Rescheduled' ? <div className="current"
                            style={{ maxWidth: '5%', background: '#60e290' }}
                          ></div>
                          : null
                      }

                      {
                        order.OrderStatus === 'Out For Pickup' && <div className="current"
                          style={{ maxWidth: '8%', background: '#60e290' }}
                        ></div>
                      }

                      {
                        order.OrderStatus === 'Picked Up' && <div className="current"
                          style={{ maxWidth: '10%', background: '#60e290' }}
                        ></div>
                      }

                      {
                        order.OrderStatus === 'Shipped' ||
                          order.OrderStatus === 'In Transit' ? <div className="current"
                            style={{ maxWidth: '30%', background: '#60e290' }}
                          ></div>
                          : null
                      }

                      {
                        order.OrderStatus === 'Reached at Destination' && <div className="current"
                          style={{ maxWidth: '60%', background: '#60e290' }}
                        ></div>
                      }

                      {
                        order.OrderStatus === 'Out For Delivery' ||
                          order.OrderStatus === 'Delayed' ||
                          order.OrderStatus === 'Misrouted' ||
                          order.OrderStatus === 'Undelivered' ? <div className="current"
                            style={{ maxWidth: '80%', background: '#60e290' }}
                          ></div>
                          : null
                      }

                      {
                        order.OrderStatus === 'Delivered' && <div className="current"
                          style={{ maxWidth: '100%', background: '#60e290' }}
                        ></div>
                      }

                      {
                        order.OrderStatus === 'Destroyed' ||
                          order.OrderStatus === 'Damaged' ||
                          order.OrderStatus === 'Lost' ||
                          order.OrderStatus === 'Return' ||
                          order.OrderStatus === 'Cancelled' ||
                          order.OrderStatus === 'Failed' ||
                          order.OrderStatus === 'Return' ||
                          order.OrderStatus === 'CANCELLED_BEFORE_DISPATCHED' ? <div className="current"
                            style={{ maxWidth: '100%', background: 'red' }}
                          ></div>
                          : null
                      }

                    </div>

                  </div>

                </div>
                {
                  order['shipment_track_activities'] && (
                    <div className="table-responsive tableBorder">
                      <table className='table table-border text-small'>
                        <tbody>
                          {
                            order['shipment_track_activities'].map((obj, key) => {
                              return (
                                <tr key={key}>
                                  <td>{obj.date}</td>
                                  <td>{obj.location}</td>
                                  <td>{obj.activity}</td>
                                </tr>
                              )
                            })
                          }
                        </tbody>
                      </table>
                    </div>
                  )
                }

                <br />

                {
                  order.track_url && <div style={{ textAlign: 'right' }} >
                    <button onClick={() => {
                      window.open(order.track_url, '_blank')
                    }}>Track</button>
                  </div>
                }

              </div>

            </div>

            <div className="col-12 col-md-4">
              <div className="Card mt-3">
                <h6 className='pb-2 UserBlackMain font-bold'>Order Summery</h6>
                <div className="row">
                  <div className="col-6">
                    <h6 className='UserBlackMain font-bold text-small'>
                      Order Created
                    </h6>
                  </div>
                  <div className="col-6">
                    <h6 className='UserBlackMain text-small'>
                      {order.created}
                    </h6>
                  </div>
                </div>

                <div className="row">
                  <div className="col-6">
                    <h6 className='UserBlackMain font-bold text-small'>
                      Order Payment Type
                    </h6>
                  </div>
                  <div className="col-6">
                    <h6 className='UserBlackMain text-small'>
                      {order.details.payType}
                    </h6>
                  </div>
                </div>

                <div className="row">
                  <div className="col-6">
                    <h6 className='UserBlackMain font-bold text-small'>
                      Order QTY
                    </h6>
                  </div>
                  <div className="col-6">
                    <h6 className='UserBlackMain text-small'>
                      x{order.quantity}
                    </h6>
                  </div>
                </div>

                <div className="row">
                  <div className="col-6">
                    <h6 className='UserBlackMain font-bold text-small'>
                      Order MRP
                    </h6>
                  </div>
                  <div className="col-6">
                    <h6 className='UserBlackMain text-small'>
                      {order.mrp}
                    </h6>
                  </div>
                </div>

                <div className="row">
                  <div className="col-6">
                    <h6 className='UserBlackMain font-bold text-small'>
                      Order Extra Discount
                    </h6>
                  </div>
                  <div className="col-6">
                    <h6 className='UserBlackMain text-small'>
                      {order.discount}
                    </h6>
                  </div>
                </div>

                <div className="row">
                  <div className="col-6">
                    <h6 className='UserBlackMain font-bold text-small'>
                      Order Total Price
                    </h6>
                  </div>
                  <div className="col-6">
                    <h6 className='UserBlackMain text-small'>
                      {order.price}
                    </h6>
                  </div>
                </div>

                {
                  order.variantSize === "S" || order.variantSize === "M" || order.variantSize === "L" || order.variantSize === "XL" ?
                    (
                      <div className="row">
                        <div className="col-6">
                          <h6 className='UserBlackMain font-bold text-small'>
                            Order Variant Size
                          </h6>
                        </div>
                        <div className="col-6">
                          <h6 className='UserBlackMain text-small'>
                            {order.variantSize}
                          </h6>
                        </div>
                      </div>
                    ) : null
                }

                {
                  order.OrderStatus === 'Delivered' ||
                    order.OrderStatus === 'Return' ? (
                    order.invoice.is_invoice_created && <button onClick={() => {
                      window.open(order.invoice.invoice_url, '_blank')
                    }}>Invoice</button>
                  )
                    : null
                }

              </div>

              <div className="Card mt-3">
                <h6 className='pb-2 UserBlackMain font-bold'>
                  Delivery Address
                </h6>

                <div className="row">
                  <div className="col-4">
                    <h6 className='UserBlackMain font-bold text-small'>
                      Name:
                    </h6>
                  </div>
                  <div className="col-8">
                    <h6 className='UserBlackMain text-small'>
                      {order.details.name}
                    </h6>
                  </div>
                </div>

                <div className="row">
                  <div className="col-4">
                    <h6 className='UserBlackMain font-bold text-small'>
                      Address:
                    </h6>
                  </div>
                  <div className="col-8">
                    <h6 className='UserBlackMain text-small'>
                      {order.details.address}
                    </h6>
                  </div>
                </div>

                <div className="row">
                  <div className="col-4">
                    <h6 className='UserBlackMain font-bold text-small'>
                      City:
                    </h6>
                  </div>
                  <div className="col-8">
                    <h6 className='UserBlackMain text-small'>
                      {order.details.city}
                    </h6>
                  </div>
                </div>

                <div className="row">
                  <div className="col-4">
                    <h6 className='UserBlackMain font-bold text-small'>
                      Locality:
                    </h6>
                  </div>
                  <div className="col-8">
                    <h6 className='UserBlackMain text-small'>
                      {order.details.locality}
                    </h6>
                  </div>
                </div>

                <div className="row">
                  <div className="col-4">
                    <h6 className='UserBlackMain font-bold text-small'>
                      Pin Code:
                    </h6>
                  </div>
                  <div className="col-8">
                    <h6 className='UserBlackMain text-small'>
                      {order.details.pin}
                    </h6>
                  </div>
                </div>

                <div className="row">
                  <div className="col-4">
                    <h6 className='UserBlackMain font-bold text-small'>
                      State:
                    </h6>
                  </div>
                  <div className="col-8">
                    <h6 className='UserBlackMain text-small'>
                      {order.details.state}
                    </h6>
                  </div>
                </div>

                <div className="row">
                  <div className="col-4">
                    <h6 className='UserBlackMain font-bold text-small'>
                      Number:
                    </h6>
                  </div>
                  <div className="col-8">
                    <h6 className='UserBlackMain text-small'>
                      {order.details.number}
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div >
    </>
  )
}

export default OrderDetailsComp