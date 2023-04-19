import React, { useState, useRef, useEffect, useCallback, Fragment } from 'react'
import { useContext } from 'react';
import Link from 'next/link';
import Server, { ServerId, userAxios } from '../../../Config/Server';
import style from './ResultComp.module.scss'
import { useRouter } from 'next/router';
import ContentControl from '@/ContentControl/ContentControl';

function ResultComp({
  setPageNum, products,
  response, category,
  setFilter, filter,
  setProducts, setResponse,
  pageNum, search }) {

  var pages = response.pages

  var categories = response.categories

  const navigate = useRouter()

  const { setQuickVw, QuickVw,
    setLoginModal, setUserLogged, setCartTotal } = useContext(ContentControl)

  var min = 0
  var max = 10000

  const [minVal, setMinVal] = useState(0);
  const [maxVal, setMaxVal] = useState(0);
  const minValRef = useRef(null);
  const maxValRef = useRef(null);
  const range = useRef(null);

  // Convert to percentage
  const getPercent = useCallback(
    (value) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  useEffect(() => {
    setMaxVal(10000)
    setMinVal(0)
  }, [search])
  // Set width of the range to decrease from the left side
  useEffect(() => {
    if (maxValRef.current) {
      const minPercent = getPercent(minVal);
      const maxPercent = getPercent(+maxValRef.current.value); // Preceding with '+' converts the value from type string to type number

      if (range.current) {
        range.current.style.left = `${minPercent}%`;
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [minVal, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    if (minValRef.current) {
      const minPercent = getPercent(+minValRef.current.value);
      const maxPercent = getPercent(maxVal);

      if (range.current) {
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [maxVal, getPercent]);

  function LogOut() {
    setUserLogged(user => ({
      ...user,
      status: false,
    }))
    localStorage.removeItem('token')
  }

  return (
    <div className={style.ResultComp + ' container'}>

      {
        response.showNot ? (
          <div className='text-center pt-3 pb-5'>
            <h3 className='font-bold UserBlackMain'>Products Not Found</h3>
          </div>
        ) : (
          <>
            <div className={style.Desktop}>
              <div className={style.rowGridDesk}>

                <div className={style.filterArea}>
                  <div className={style.filterItem}>
                    <h6 className='UserBlackMain'>PRODUCT CATEGORIES</h6>
                    <div>
                      <select onChange={(e) => {
                        if (category) {
                          navigate.push(`/c/${e.target.value}`)
                          setPageNum(1)
                          setFilter({
                            ...filter,
                            category: e.target.value
                          })
                        } else {
                          setPageNum(1)
                          setFilter({
                            ...filter,
                            seCategory: e.target.value
                          })
                          setMaxVal(10000)
                          setMinVal(0)
                        }
                      }} className={style.selectBox} name="" id="">
                        {
                          category ? (
                            <option value={category}>{category.toUpperCase()}</option>
                          ) : (
                            <>
                              {
                                filter.seCategory !== '' && (
                                  <option value={filter.seCategory}>{filter.seCategory.toUpperCase()}</option>
                                )
                              }
                            </>
                          )
                        }

                        {
                          categories.map((obj, key) => {
                            var mainSub = obj.mainSub
                            var sub = obj.sub
                            return (
                              <Fragment key={key}>
                                <option value={obj.slug}>{obj.name}</option>

                                {
                                  mainSub.map((obj2, key2) => {
                                    return (
                                      <Fragment key={key2}>
                                        <option value={obj2.slug}>{obj.name}{` > `}{obj2.name}</option>
                                      </Fragment>
                                    )
                                  })
                                }
                                {
                                  sub.map((obj3, key3) => {
                                    return (
                                      <Fragment key={key3}>
                                        <option value={obj3.slug}>{obj.name}{` > `}{obj3.mainSub}{` > `}{obj3.name}</option>
                                      </Fragment>
                                    )
                                  })
                                }
                              </Fragment>
                            )
                          })
                        }
                      </select>
                    </div>
                  </div>
                  <div className={style.filterItem}>
                    <h6 className='UserBlackMain'>FILTER BY PRICE</h6>

                    <div className={style.RangeContainer}>
                      <input
                        type="range"
                        min={min}
                        max={max}
                        value={minVal}
                        ref={minValRef}
                        onChange={(event) => {
                          const value = Math.min(+event.target.value, maxVal - 1);
                          setMinVal(value);
                          event.target.value = value.toString();

                          if (category !== undefined) {
                            Server.get(`/users/getCategoryProducts/${filter.category}`, {
                              params: {
                                page: pageNum,
                                sort: filter.sort,
                                min: value,
                                max: maxVal
                              }
                            }).then((res) => {
                              setProducts(res.data.products)
                              setResponse(res.data)

                            }).catch((err) => {
                              console.log('error')
                            })
                          } else {
                            Server.get(`/users/searchProduct/`, {
                              params: {
                                search: search,
                                page: pageNum,
                                category: filter.seCategory,
                                sort: filter.sort,
                                min: value,
                                max: maxVal
                              }
                            }).then((res) => {
                              setProducts(res.data.products)
                              setResponse(res.data)
                            }).catch((err) => {
                              console.log("err")
                            })
                          }
                        }}
                        className={style.thumb}
                      />
                      <input
                        type="range"
                        min={min}
                        max={max}
                        value={maxVal}
                        ref={maxValRef}
                        onChange={(event) => {
                          const value = Math.max(+event.target.value, minVal + 1);
                          setMaxVal(value);
                          event.target.value = value.toString();

                          if (category !== undefined) {
                            Server.get(`/users/getCategoryProducts/${filter.category}`, {
                              params: {
                                page: pageNum,
                                sort: filter.sort,
                                min: minVal,
                                max: value
                              }
                            }).then((res) => {
                              setProducts(res.data.products)
                              setResponse(res.data)
                            }).catch((err) => {
                              console.log('error')
                            })
                          } else {
                            Server.get(`/users/searchProduct/`, {
                              params: {
                                search: search,
                                page: pageNum,
                                category: filter.seCategory,
                                sort: filter.sort,
                                min: minVal,
                                max: value
                              }
                            }).then((res) => {
                              setProducts(res.data.products)
                              setResponse(res.data)

                            }).catch((err) => {
                              console.log('err')
                            })
                          }
                        }}
                        className={style.thumb}
                      />

                      <div className={style.slider}>
                        <div className={style.slider__track} />
                        <div ref={range} className={style.slider__range} />
                        <div className={style['slider__left-value']}>{minVal}</div>
                        <div className={style['slider__right-value']}>{maxVal}</div>
                      </div>
                    </div>

                  </div>

                </div>

                <div className={style.ProductsArea}>
                  <div className={style.sortDiv}>
                    <div>
                      <p className='text-small UserGrayMain pt-1'>Sort By : </p>
                    </div>
                    <div>
                      <select value={JSON.stringify(filter.sort)} className={style.selectBox} onChange={(e) => {
                        setFilter({
                          ...filter,
                          sort: JSON.parse(e.target.value)
                        })
                      }}>
                        <option value={JSON.stringify({ '_id': -1 })}>Latest</option>
                        <option value={JSON.stringify({ 'price': 1 })}>Low to High</option>
                        <option value={JSON.stringify({ 'price': -1 })}>High to Low</option>
                      </select>
                    </div>
                  </div>

                  <div className={style.products}>
                    {
                      products.map((obj, key) => {
                        return (
                          <div className={style.UserMainProCard} key={key}>
                            <div className={style.UserMainProimgDiv + ' text-center'}>
                              <div>
                                <button className={style.offerGreen}>{obj.discount}%</button>
                                {
                                  obj.available === "true" ? (
                                    <button className={style.cartBtn} onClick={() => {
                                      userAxios((server) => {
                                        server.post('/users/addToCart', {
                                          item: {
                                            quantity: 1,
                                            proId: obj._id,
                                            price: obj.price,
                                            mrp: obj.mrp,
                                            variantSize: obj.currVariantSize
                                          }
                                        }).then((res) => {
                                          if (res.data.login) {
                                            LogOut()
                                            setLoginModal(obj => ({
                                              ...obj,
                                              btn: true,
                                              active: true,
                                              member: true,
                                              forgot: false
                                            }))
                                          } else {
                                            if (res.data.found) {
                                              alert("Already in cart")
                                            } else {
                                              alert("Product added to cart")
                                              setCartTotal(amt => amt + parseInt(obj.price))
                                            }
                                          }
                                        }).catch((err) => {
                                          alert("Something Wrong")
                                        })
                                      })
                                    }}><i className="fa-solid fa-cart-plus"></i></button>
                                  ) : (
                                    <button className={style.cartBtn}><i className="fa-solid fa-exclamation"></i></button>
                                  )
                                }

                              </div>
                              <Link className='LinkTagNonDec' href={'/p/' + obj.slug + '/' + obj._id}>
                                <img src={ServerId + '/product/' + obj.uni_id_1 + obj.uni_id_2 + '/' + obj.files[0].filename} alt={obj.name} loading="lazy" />
                              </Link>
                              <button className={style.QuickViewDiv} onClick={() => {
                                Server.get('/users/product/' + obj.slug + '/' + obj._id).then((item) => {
                                  setQuickVw({
                                    ...QuickVw, active: true,
                                    btn: true,
                                    product: item.data.product
                                  })
                                }).catch(() => {
                                  alert('Facing An Error')
                                })
                              }}>
                                QUICK VIEW
                              </button>
                            </div>
                            <Link className='LinkTagNonDec' href={'/p/' + obj.slug + '/' + obj._id}>
                              <div className='pt-2 textArea'>
                                <h6 className='UserGrayMain text-small oneLineTxt'><small>{obj.category}</small></h6>
                                <h6 className='UserBlackMain oneLineTxt'>{obj.name}</h6>
                                <h6><small className='UserGrayMain text-small'><del>₹ {obj.mrp}</del></small> <span className='UserBlackMain'>₹ {obj.price}</span></h6>
                              </div>
                            </Link>
                          </div>
                        )
                      })
                    }
                  </div>

                  {
                    response.pagination && (
                      <div className={style.paginationDiv}>
                        <div className={style.pagination}>
                          {
                            pages.map((obj, key) => {
                              if (response.currentPage === obj) {
                                return (
                                  <button key={key} onClick={() => {
                                    setPageNum(obj)
                                  }} className={style.active}>{obj}</button>
                                )
                              } else {
                                return (
                                  <button key={key} onClick={() => {
                                    setPageNum(obj)
                                  }} >{obj}</button>
                                )
                              }
                            })
                          }
                        </div>
                      </div>
                    )
                  }

                </div>

              </div>
            </div>

            <div className={style.Mobile}>
              <div className="row">

                <div className="col-12">
                  <div className={style.ProductsArea}>
                    <div className={style.sortDiv}>
                      <div>
                        <p className='text-small UserGrayMain pt-1'>Sort By : </p>
                      </div>
                      <div>
                        <select value={JSON.stringify(filter.sort)} className={style.selectBox} onChange={(e) => {
                          setFilter({
                            ...filter,
                            sort: JSON.parse(e.target.value)
                          })
                        }}>
                          <option value={JSON.stringify({ '_id': -1 })}>Latest</option>
                          <option value={JSON.stringify({ 'price': 1 })}>Low to High</option>
                          <option value={JSON.stringify({ 'price': -1 })}>High to Low</option>
                        </select>
                      </div>
                    </div>

                    <div className={style.products}>
                      <div className="row">
                        {
                          products.map((obj, key) => {
                            return (
                              <div className="col-6" key={key}>

                                <div className={style.UserMainProCard}>
                                  <div className={style.UserMainProimgDiv + ' text-center'} >
                                    <div>
                                      <button className={style.offerGreen}>{obj.discount}%</button>
                                      {
                                        obj.available === "true" ? (
                                          <button className={style.cartBtn} onClick={() => {
                                            userAxios((server) => {
                                              server.post('/users/addToCart', {
                                                item: {
                                                  quantity: 1,
                                                  proId: obj._id,
                                                  price: obj.price,
                                                  mrp: obj.mrp,
                                                  variantSize: obj.currVariantSize
                                                }
                                              }).then((res) => {
                                                if (res.data.login) {
                                                  LogOut()
                                                  setLoginModal(obj => ({
                                                    ...obj,
                                                    btn: true,
                                                    active: true,
                                                    member: true,
                                                    forgot: false
                                                  }))
                                                } else {
                                                  if (res.data.found) {
                                                    alert("Already in cart")
                                                  } else {
                                                    alert("Product added to cart")
                                                    setCartTotal(amt => amt + parseInt(obj.price))
                                                  }
                                                }
                                              }).catch((err) => {
                                                alert("Something Wrong")
                                              })
                                            })
                                          }}><i className="fa-solid fa-cart-plus"></i></button>
                                        ) : (
                                          <button className={style.cartBtn}><i className="fa-solid fa-exclamation"></i></button>
                                        )
                                      }
                                    </div>
                                    <Link className='LinkTagNonDec' href={'/p/' + obj.slug + '/' + obj._id}>
                                      <img src={ServerId + '/product/' + obj.uni_id_1 + obj.uni_id_2 + '/' + obj.files[0].filename} alt={obj.name} loading="lazy" />
                                    </Link>
                                    <button className={style.QuickViewDiv} onClick={() => {
                                      Server.get('/users/product/' + obj.slug + '/' + obj._id).then((item) => {
                                        setQuickVw({
                                          ...QuickVw, active: true,
                                          btn: true,
                                          product: item.data.product
                                        })
                                      }).catch(() => {
                                        alert('Facing An Error')
                                      })
                                    }}>
                                      QUICK VIEW
                                    </button>
                                  </div>
                                  <Link className='LinkTagNonDec' href={'/p/' + obj.slug + '/' + obj._id}>
                                    <div className='pt-2'>
                                      <h6 className='UserGrayMain text-small oneLineTxt'><small>{obj.category}</small></h6>
                                      <h6 className='UserBlackMain oneLineTxt'>{obj.name}</h6>
                                      <h6><small className='UserGrayMain text-small'><del>₹ {obj.mrp}</del></small> <span className='UserBlackMain'>₹ {obj.price}</span></h6>
                                    </div>
                                  </Link>
                                </div>

                              </div>
                            )
                          })
                        }
                      </div>
                    </div>

                    {
                      response.pagination && (
                        <div className={style.paginationDiv}>
                          <div className={style.pagination}>
                            {
                              pages.map((obj, key) => {
                                if (response.currentPage === obj) {
                                  return (
                                    <button key={key} onClick={() => {
                                      setPageNum(obj)
                                    }} className={style.active}>{obj}</button>
                                  )
                                } else {
                                  return (
                                    <button key={key} onClick={() => {
                                      setPageNum(obj)
                                    }} >{obj}</button>
                                  )
                                }
                              })
                            }
                          </div>
                        </div>
                      )
                    }

                  </div>
                </div>

                <div className="col-12">
                  <div className={style.filterArea}>
                    <div className={style.filterItem}>
                      <h6 className='UserBlackMain'>PRODUCT CATEGORIES</h6>
                      <div>
                        <select onChange={(e) => {
                          if (category) {
                            navigate(`/c/${e.target.value}`)
                            setPageNum(1)
                            setFilter({
                              ...filter,
                              category: e.target.value
                            })
                          } else {
                            setPageNum(1)
                            setFilter({
                              ...filter,
                              seCategory: e.target.value
                            })
                            setMaxVal(10000)
                            setMinVal(0)
                          }
                        }} className={style.selectBox} name="" id="">
                          {
                            category ? (
                              <option value={category}>{category.toUpperCase()}</option>
                            ) : (
                              <>
                                {
                                  filter.seCategory !== '' && (
                                    <option value={filter.seCategory}>{filter.seCategory.toUpperCase()}</option>
                                  )
                                }
                              </>
                            )
                          }

                          {
                            categories.map((obj, key) => {
                              var mainSub = obj.mainSub
                              var sub = obj.sub
                              return (
                                <Fragment key={key}>
                                  <option value={obj.slug}>{obj.name}</option>

                                  {
                                    mainSub.map((obj2, key2) => {
                                      return (
                                        <Fragment key={key2}>
                                          <option value={obj2.slug}>{obj.name}{` > `}{obj2.name}</option>
                                        </Fragment>
                                      )
                                    })
                                  }
                                  {
                                    sub.map((obj3, key3) => {
                                      return (
                                        <Fragment key={key3}>
                                          <option value={obj3.slug}>{obj.name}{` > `}{obj3.mainSub}{` > `}{obj3.name}</option>
                                        </Fragment>
                                      )
                                    })
                                  }
                                </Fragment>
                              )
                            })
                          }
                        </select>
                      </div>
                    </div>
                    <div className={style.filterItem}>
                      <h6 className='UserBlackMain'>FILTER BY PRICE</h6>

                      <div className={style.RangeContainer}>
                        <input
                          type="range"
                          min={min}
                          max={max}
                          value={minVal}
                          ref={minValRef}
                          onChange={(event) => {
                            const value = Math.min(+event.target.value, maxVal - 1);
                            setMinVal(value);
                            event.target.value = value.toString();

                            if (category !== undefined) {
                              Server.get(`/users/getCategoryProducts/${filter.category}`, {
                                params: {
                                  page: pageNum,
                                  sort: filter.sort,
                                  min: value,
                                  max: maxVal
                                }
                              }).then((res) => {
                                setProducts(res.data.products)
                                setResponse(res.data)

                              }).catch((err) => {
                                console.log('err')
                              })
                            } else {
                              Server.get(`/users/searchProduct/`, {
                                params: {
                                  search: search,
                                  category: filter.seCategory,
                                  page: pageNum,
                                  sort: filter.sort,
                                  min: value,
                                  max: maxVal
                                }
                              }).then((res) => {
                                setProducts(res.data.products)
                                setResponse(res.data)

                              }).catch((err) => {
                                console.log('err')
                              })
                            }
                          }}
                          className={style.thumb}
                        />
                        <input
                          type="range"
                          min={min}
                          max={max}
                          value={maxVal}
                          ref={maxValRef}
                          onChange={(event) => {
                            const value = Math.max(+event.target.value, minVal + 1);
                            setMaxVal(value);
                            event.target.value = value.toString();

                            if (category !== undefined) {
                              Server.get(`/users/getCategoryProducts/${filter.category}`, {
                                params: {
                                  page: pageNum,
                                  sort: filter.sort,
                                  min: minVal,
                                  max: value
                                }
                              }).then((res) => {
                                setProducts(res.data.products)
                                setResponse(res.data)

                              }).catch((err) => {
                                console.log('err')
                              })
                            } else {
                              Server.get(`/users/searchProduct/`, {
                                params: {
                                  search: search,
                                  category: filter.seCategory,
                                  page: pageNum,
                                  sort: filter.sort,
                                  min: minVal,
                                  max: value
                                }
                              }).then((res) => {
                                setProducts(res.data.products)
                                setResponse(res.data)

                              }).catch((err) => {
                                console.log('err')
                              })
                            }
                          }}
                          className={style.thumb}
                        />

                        <div className={style.slider}>
                          <div className={style.slider__track} />
                          <div ref={range} className={style.slider__range} />
                          <div className={style['slider__left-value']}>{minVal}</div>
                          <div className={style['slider__right-value']}>{maxVal}</div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

              </div>
            </div>
          </>
        )
      }

    </div>
  )
}

export default ResultComp