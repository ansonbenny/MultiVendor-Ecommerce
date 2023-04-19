import { useEffect } from 'react'
import { useState } from 'react'
import { ServerId, userAxios } from '../../../Config/Server'
import CartEmptyIcon from '../../../Assets/CartEmpty'
import { useContext } from 'react'
import ContentControl from '../../../ContentControl/ContentControl'
import { useRouter } from 'next/router'

function CartComp({ products, setUpdate, amount, setOrderType }) {

  const [showOrdrBtn, setOrdrBtn] = useState(false)

  const navigate = useRouter()

  const { setUserLogged } = useContext(ContentControl)

  function LogOut() {
    setUserLogged(user => ({
      ...user,
      status: false,
    }))
    localStorage.removeItem('token')
  }

  useEffect(() => {
    if (parseInt(window.innerWidth) <= 767) {
      setOrdrBtn(true)
    } else {
      setOrdrBtn(false)
    }
  }, [setOrdrBtn])

  useEffect(() => {
    window.addEventListener('resize', () => {
      if (parseInt(window.innerWidth) > 767) {
        setOrdrBtn(false)
      } else {
        setOrdrBtn(true)
      }
    });

  });

  return (
    <>
      {
        products.length !== 0 ? (
          <div className='CartComp'>
            <div className="container">
              <div className="desktop">

                <div className="leftDiv">

                  {
                    products.map((obj, key) => {
                      return (
                        <div className="cartCard" key={key}>

                          <div className='imgDiv'>
                            <img src={`${ServerId}/product/${obj.item.uni_id_1}${obj.item.uni_id_2}/${obj.item.files[0].filename}`} alt={obj.item.name} />
                          </div>

                          <div className='content'>
                            <h4 className='font-bold UserBlackMain oneLineTxt-Desk-Specific'>{obj.item.name}</h4>
                            <h6 className='font-bold'>
                              <span className='UserGrayMain'><small><del>₹ {obj.mrp}&nbsp;</del></small></span>
                              &nbsp;&nbsp;
                              <span className='UserBlackMain'>₹ {obj.price}</span>
                            </h6>

                            <div className='RmvNQunty'>

                              {
                                obj.item.available === 'true' ? (
                                  <div className='quantityDiv'>
                                    <button className='btnMinus' onClick={() => {
                                      if (obj.quantity - 1 === 0) {
                                        if (window.confirm(`Do you want remove ${obj.item.name}`)) {
                                          userAxios((server) => {
                                            server.put('/users/removeItemCart', {
                                              proId: obj.item._id
                                            }).then((res) => {
                                              if (res.data.login) {
                                                LogOut()
                                              } else {

                                                setUpdate(update => !update)
                                              }
                                            }).catch(() => {
                                              alert("Sorry for facing error")
                                            })
                                          })
                                        }
                                      } else {
                                        userAxios((server) => {
                                          server.put('/users/changeQuantityCart', {
                                            proId: obj.item._id,
                                            action: -1,
                                            quantity: obj.quantity
                                          }).then((res) => {
                                            if (res.data.login) {
                                              LogOut()
                                            } else {
                                              setUpdate(update => !update)
                                            }
                                          }).catch(() => {
                                            alert("Sorry for facing error")
                                          })
                                        })
                                      }
                                    }}>-</button>

                                    <input type="number" value={obj.quantity} disabled />

                                    <button className='btnPlus' onClick={() => {
                                      userAxios((server) => {
                                        server.put('/users/changeQuantityCart', {
                                          proId: obj.item._id,
                                          action: +1,
                                          quantity: obj.quantity
                                        }).then((res) => {
                                          if (res.data.login) {
                                            LogOut()
                                          } else {

                                            setUpdate(update => !update)
                                          }
                                        }).catch(() => {
                                          alert("Sorry for facing error")
                                        })
                                      })
                                    }}>+</button>
                                  </div>
                                ) : (
                                  <div className="StockBtnDiv">
                                    <button onClick={() => {
                                      if (window.confirm(`Do you want remove ${obj.item.name}`)) {
                                        userAxios((server) => {
                                          server.put('/users/removeItemCart', {
                                            proId: obj.item._id
                                          }).then((res) => {
                                            if (res.data.login) {
                                              LogOut()
                                            } else {

                                              setUpdate(update => !update)
                                            }
                                          }).catch(() => {
                                            alert("Sorry for facing error")
                                          })
                                        })
                                      }
                                    }}>No Stock</button>
                                  </div>
                                )
                              }

                              <div className="RemoveBtnDiv">
                                <button onClick={() => {
                                  if (window.confirm(`Do you want remove ${obj.item.name}`)) {
                                    userAxios((server) => {
                                      server.put('/users/removeItemCart', {
                                        proId: obj.item._id
                                      }).then((res) => {
                                        if (res.data.login) {
                                          LogOut()
                                        } else {

                                          setUpdate(update => !update)
                                        }
                                      }).catch(() => {
                                        alert("Sorry for facing error")
                                      })
                                    })
                                  }
                                }}>Remove</button>
                              </div>

                            </div>

                          </div>

                        </div>
                      )
                    })
                  }
                </div>

                <div className="rightDiv">

                  <div className='cartAmtCard'>
                    <div className='subDiv'>
                      <h6 className='UserGrayMain font-bold'>PRICE DETAILS</h6>
                    </div>
                    <div className='subDiv'>
                      <div className='AmtDiv'>
                        <div>
                          <p>Price ({products.length} items)</p>
                          <p>Discount</p>
                          <p>MRP ({products.length} items)</p>
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

                    <div className='orderBtnDiv'>

                      <button className='orderBtn' onClick={() => {
                        setOrderType({
                          order: true,
                          type: 'cart'
                        })
                        navigate.push('/checkout')
                      }}>place order</button>

                    </div>

                  </div>

                </div>
              </div>

              <div className="Mobile">
                <div className="products">
                  <div className="row">
                    {
                      products.map((obj, key) => {
                        return (
                          <div className="col-12" key={key}>
                            <div className="cartCard">

                              <div className='imgDiv'>
                                <img src={`${ServerId}/product/${obj.item.uni_id_1}${obj.item.uni_id_2}/${obj.item.files[0].filename}`} alt={obj.item.name} />
                              </div>

                              <div className='content'>
                                <h4 className='font-bold UserBlackMain oneLineTxt-Mob'>{obj.item.name}</h4>
                                <h6 className='font-bold'>
                                  <span className='UserGrayMain'><small><del>₹ {obj.mrp}&nbsp;</del></small></span>
                                  &nbsp;&nbsp;
                                  <span className='UserBlackMain'>₹ {obj.price}</span>
                                </h6>

                                <div className='RmvNQunty'>
                                  {
                                    obj.item.available === 'true' ? (
                                      <div className='quantityDiv'>
                                        <button className='btnMinus' onClick={() => {
                                          if (obj.quantity - 1 === 0) {
                                            if (window.confirm(`Do you want remove ${obj.item.name}`)) {
                                              userAxios((server) => {
                                                server.put('/users/removeItemCart', {
                                                  proId: obj.item._id
                                                }).then((res) => {
                                                  if (res.data.login) {
                                                    LogOut()
                                                  } else {

                                                    setUpdate(update => !update)
                                                  }
                                                }).catch(() => {
                                                  alert("Sorry for facing error")
                                                })
                                              })
                                            }
                                          } else {
                                            userAxios((server) => {
                                              server.put('/users/changeQuantityCart', {
                                                proId: obj.item._id,
                                                action: -1,
                                                quantity: obj.quantity
                                              }).then((res) => {
                                                if (res.data.login) {
                                                  LogOut()
                                                } else {

                                                  setUpdate(update => !update)
                                                }
                                              }).catch(() => {
                                                alert("Sorry for facing error")
                                              })
                                            })
                                          }
                                        }}>-</button>
                                        <input type="number" value={obj.quantity} disabled />
                                        <button className='btnPlus' onClick={() => {
                                          userAxios((server) => {
                                            server.put('/users/changeQuantityCart', {
                                              proId: obj.item._id,
                                              action: +1,
                                              quantity: obj.quantity
                                            }).then((res) => {
                                              if (res.data.login) {
                                                LogOut()
                                              } else {

                                                setUpdate(update => !update)
                                              }
                                            }).catch(() => {
                                              alert("Sorry for facing error")
                                            })
                                          })
                                        }}>+</button>
                                      </div>
                                    ) : (
                                      <div className="StockBtnDiv">
                                        <button onClick={() => {
                                          if (window.confirm(`Do you want remove ${obj.item.name}`)) {
                                            userAxios((server) => {
                                              server.put('/users/removeItemCart', {
                                                proId: obj.item._id
                                              }).then((res) => {
                                                if (res.data.login) {
                                                  LogOut()
                                                } else {

                                                  setUpdate(update => !update)
                                                }
                                              }).catch(() => {
                                                alert("Sorry for facing error")
                                              })
                                            })
                                          }
                                        }}>No Stock</button>
                                      </div>

                                    )
                                  }

                                  <div className="RemoveBtnDiv">
                                    <button onClick={() => {
                                      if (window.confirm(`Do you want remove ${obj.item.name}`)) {
                                        userAxios((server) => {
                                          server.put('/users/removeItemCart', {
                                            proId: obj.item._id
                                          }).then((res) => {
                                            if (res.data.login) {
                                              LogOut()
                                            } else {

                                              setUpdate(update => !update)
                                            }
                                          }).catch(() => {
                                            alert("Sorry for facing error")
                                          })
                                        })
                                      }
                                    }}>Remove</button>
                                  </div>

                                </div>

                              </div>

                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>

                <div className='cartAmtCard'>
                  <div className='subDiv'>
                    <h6 className='UserGrayMain font-bold'>PRICE DETAILS</h6>
                  </div>
                  <div className='lastSub'>
                    <div className='AmtDiv'>
                      <div>
                        <p>Price ({products.length} items)</p>
                        <p>Discount</p>
                        <p>MRP ({products.length} items)</p>
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

                </div>

              </div>
            </div>

            <div style={{ display: showOrdrBtn ? 'block' : 'none' }} className='amtCardFixed'>
              <div className='container'>
                <div className="MainDiv">
                  <div>
                    <h6 className='font-bold UserGrayMain'><small><del>₹ {amount.totalMrp}</del></small></h6>
                    <h6 className='font-bold UserBlackMain'>₹ {amount.totalPrice}</h6>
                  </div>

                  <div>

                    <button className='orderBtn' onClick={() => {
                      setOrderType({
                        order: true,
                        type: 'cart'
                      })

                      navigate.push('/checkout')
                    }}>place order</button>

                  </div>
                </div>
              </div>
            </div>
          </div >
        ) : (
          <div className="container container-fluid pt-3 pb-2">
            <div className='text-center'>
              <div className='ErrorSection'>
                <CartEmptyIcon />
                <h5 className='UserGrayMain pt-5'>Your cart is empty</h5>
              </div>
            </div>
          </div>
        )
      }
    </>
  )
}

export default CartComp