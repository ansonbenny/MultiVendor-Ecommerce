import React, { Fragment } from 'react'
import { useContext } from 'react'
import ContentControl from '../../../ContentControl/ContentControl'
import { ServerId } from '../../../Config/Server'
import { useRouter } from 'next/router'

function ProductHead() {
    const {
        OrderDetails, setOrderDetails, product, setLoginModal, userLogged, setOrderType
    } = useContext(ContentControl)

    let navigate = useRouter()

    return (
        <div className='ProductHead'>
            <div className="container">
                <div className="row">

                    <div className="col-6">
                        <div className="ProMaiRow">
                            <div className="pt-1">
                                <img src={ServerId + '/product/' + product.uni_id_1 + product.uni_id_2 + '/' + product.files[0].filename} className='ProImg' alt={product.name} loading='lazy' />
                            </div>
                            <div className="pt-2">
                                <h6 className='font-bold UserBlackMain oneLineTxtMax-300'>{product.name}</h6>
                                <h6 className='font-normal'>
                                    <span className='UserGrayMain'><small><del>₹ {product.mrp}</del></small>&nbsp;</span>
                                    <span className='UserBlackMain'>₹ {product.price}&nbsp;</span>
                                    {
                                        product.available === "true" ? (
                                            <span className='UserGrayMain text-small'>&nbsp;In stock</span>
                                        ) : (
                                            <span className='UserGrayMain text-small'>&nbsp;Out of stock</span>
                                        )
                                    }
                                </h6>
                            </div>
                        </div>
                    </div>

                    <div className="col-6">
                        <div className="ProBuyRow pt-2">
                            {
                                product.available === "true" ? (
                                    <Fragment>
                                        <div className='quantityDiv'>
                                            <button className='btnMinus' onClick={() => {
                                                if (OrderDetails.quantity !== 1) {
                                                    setOrderDetails({
                                                        ...OrderDetails,
                                                        quantity: OrderDetails.quantity - 1
                                                    })
                                                }
                                            }}>-</button>
                                            <input type="number" value={OrderDetails.quantity} onChange={(e) => {
                                                if (parseInt(e.target.value) !== 0) {
                                                    setOrderDetails({
                                                        ...OrderDetails,
                                                        quantity: parseInt(e.target.value)
                                                    })
                                                } else {
                                                    setOrderDetails({
                                                        ...OrderDetails,
                                                        quantity: 1
                                                    })
                                                }
                                            }} name="" id="" />
                                            <button className='btnPlus' onClick={() => {
                                                setOrderDetails({
                                                    ...OrderDetails,
                                                    quantity: OrderDetails.quantity + 1
                                                })
                                            }}>+</button>
                                        </div>

                                        <div>
                                            <button className='BuyBtn' onClick={() => {
                                                if (userLogged.status) {
                                                    setOrderType({
                                                        order: true,
                                                        type: 'buy',
                                                        quantity: OrderDetails.quantity,
                                                        proId: product._id
                                                    })

                                                    navigate.push('/checkout')
                                                } else {
                                                    setLoginModal(obj => ({
                                                        ...obj,
                                                        btn: true,
                                                        active: true,
                                                        member: true,
                                                        forgot: false
                                                    }))
                                                }
                                            }}>Buy Now</button>
                                        </div>
                                    </Fragment>
                                ) : (
                                    <div>
                                        <button className='BuyBtn'>Out of Stock</button>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductHead