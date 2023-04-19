import { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Thumbs, Autoplay, Pagination } from 'swiper'
import 'swiper/css';
import { useContext } from 'react'
import Link from 'next/link'
import ContentControl from '../../../ContentControl/ContentControl'
import Server, { ServerId, userAxios } from '../../../Config/Server'
import ReviewModal from './ReviewModal'
import CheckPinModal from './CheckPinModal'
import { useRouter } from 'next/router'

function ProductComp() {

  const {
    OrderDetails, setOrderDetails,
    setQuickVw, QuickVw,
    ImgModal, setImgModal,
    product, similar, userLogged, setUserLogged,
    setLoginModal, setCartTotal, setOrderType, setProduct
  } = useContext(ContentControl)

  const [showDesReview, setDesReview] = useState({
    description: true,
    review: false
  })

  const [showReviewModal, setShowReviewModal] = useState({
    btn: false,
    active: false
  })

  const [reviews, setReviews] = useState({
    total: 0,
    reviews: [],
    userReview: false,
    stars: {
      one: 0,
      two: 0,
      three: 0,
      four: 0,
      five: 0,
      onePerc: 0,
      twoPerc: 0,
      threePerc: 0,
      fourPerc: 0,
      fivePerc: 0,
      rating: 0
    }
  })

  const images = product.files
  const [thumbsSwiper, setThumbsSwiper] = useState(null)

  const [magnifier, setMagnifier] = useState(false)
  const [[x, y], setXY] = useState([0, 0]);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);

  var magnifierHeight = 150
  var magnifieWidth = 150
  var zoomLevel = 2

  function copyURL() {
    navigator.clipboard.writeText(window.location.href);
    alert('Text copied');
  }

  function LogOut() {
    setUserLogged(user => ({
      ...user,
      status: false,
    }))
    localStorage.removeItem('token')
  }

  function getReviews() {
    Server.get('/users/getReviews', {
      params: {
        proId: product._id,
        userId: userLogged._id || '',
      }
    }).then((res) => {
      setReviews({
        total: res.data.total,
        reviews: res.data.reviews,
        userReview: res.data.userReview,
        stars: res.data.stars
      })
    }).catch(() => {
      setDesReview({
        ...showDesReview, description: true,
        review: false
      })
      alert('Error to Get Reviews')
    })
  }

  useEffect(() => {
    getReviews()
  }, [userLogged])

  function loadMoreReviews() {
    Server.get('/users/loadMoreReviews', {
      params: {
        proId: product._id,
        skip: reviews['reviews'].length
      }
    }).then((res) => {
      setReviews({
        ...reviews,
        total: res.data.total,
        reviews: [...reviews.reviews, ...res.data.reviews]
      })
    }).catch(() => {
      alert('Error to Load More Reviews')
    })
  }

  function deleteReview() {
    if (window.confirm('Do you want delete review')) {
      userAxios((server) => {
        server.delete('/users/deleteReview', {
          data: {
            proId: product._id
          }
        }).then((res) => {
          if (res.data.login) {
            setUserLogged({ status: false })
            localStorage.removeItem('token')
            alert('Please Login')
          } else {
            getReviews()
            alert("Review Deleted")
          }
        }).catch(() => {
          alert("Error to delete review")
        })
      })
    }
  }

  const navigate = useRouter()

  return (
    <>
      <CheckPinModal />
      {showReviewModal.active && <ReviewModal
        showReviewModal={showReviewModal}
        setReviewModal={setShowReviewModal}
        getReviews={getReviews}
        proId={product._id} />}
      <div className='singleProduct container'>

        <div className="desktope">
          <div className="leftDiv">
            <div className='SlidDivBorder'>
              <Swiper
                modules={[Thumbs]}
                grabCursor={true}
                loop={false}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }} >
                {
                  images.map((item, key) => {
                    return (
                      <SwiperSlide key={key} className="MainimgDiv">
                        <img className='Mainimg' src={ServerId + '/product/' + product.uni_id_1 + product.uni_id_2 + '/' + item.filename} loading="lazy" alt={product.name} onMouseEnter={(e) => {
                          setMagnifier(true)
                          const elem = e.currentTarget;
                          const { width, height } = elem.getBoundingClientRect();
                          setSize([width, height]);
                        }} onMouseMove={(e) => {
                          // update cursor position
                          const elem = e.currentTarget;
                          const { top, left } = elem.getBoundingClientRect();

                          // calculate cursor position on the image
                          const x = e.pageX - left - window.pageXOffset;
                          const y = e.pageY - top - window.pageYOffset;
                          setXY([x, y]);
                        }}

                          onMouseLeave={() => {
                            setMagnifier(false)
                          }} />

                        <div style={{
                          display: magnifier ? 'block' : 'none', position: "absolute",

                          // prevent magnifier blocks the mousemove event of img
                          pointerEvents: "none",
                          // set size of magnifier
                          height: `${magnifierHeight}px`,
                          width: `${magnifieWidth}px`,
                          // move element center to cursor pos
                          top: `${y - magnifierHeight / 2}px`,
                          left: `${x - magnifieWidth / 2}px`,
                          opacity: "1", // reduce opacity so you can verify position
                          backgroundColor: "white",
                          backgroundImage: `url(${ServerId + '/product/' + product.uni_id_1 + product.uni_id_2 + '/' + item.filename})`,
                          backgroundRepeat: "no-repeat",

                          //calculate zoomed image size
                          backgroundSize: `${imgWidth * zoomLevel}px ${imgHeight * zoomLevel
                            }px`,

                          //calculate position of zoomed image.
                          backgroundPositionX: `${-x * zoomLevel + magnifieWidth / 2}px`,
                          backgroundPositionY: `${-y * zoomLevel + magnifierHeight / 2}px`
                        }} alt="" >
                        </div>
                      </SwiperSlide>
                    )
                  })
                }
              </Swiper>

              <Swiper
                modules={[Thumbs]}
                watchSlidesProgress
                slidesPerView={4}
                spaceBetween={10}
                onSwiper={setThumbsSwiper}
                loop={false}
                className="QuickContainer"
              >
                {
                  images.map((item, key) => {
                    return (
                      <SwiperSlide key={key} className="ThumbDiv">
                        <img className='ThumbSingle' src={ServerId + '/product/' + product.uni_id_1 + product.uni_id_2 + '/' + item.filename} alt={product.name} />
                      </SwiperSlide>
                    )
                  })
                }
              </Swiper>
            </div>
          </div>

          <div className="rightDiv">

            <div className="content">
              <div className='TitleShareDiv'>
                <div>
                  <h3 className='font-bolder textSpace UserBlackMain'><small>{product.name}</small></h3>
                </div>
                <div>
                  <div>
                    <button onClick={copyURL}><i className="fa-solid fa-share-nodes"></i></button>
                  </div>
                  <div className='pt-5'>
                    <button onClick={() => {
                      userAxios((server) => {
                        server.post('/users/addToWishlist', {
                          item: {
                            proId: product._id,
                            price: product.price,
                            mrp: product.mrp,
                            variantSize: product.currVariantSize
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
                            alert("Product added to wishlist")
                          }
                        }).catch((err) => {
                          alert("Sorry for facing error")
                        })
                      })
                    }}><i className="fa-solid fa-heart"></i></button>
                  </div>
                </div>
              </div>

              <div className='pt-2'>
                <h3 className='font-bold'>
                  <span className='UserGreenMain'>
                    <small><small>{product.discount}%</small></small>
                  </span>
                  &nbsp;
                  <span><small className='UserGrayMain'>
                    <small><del>₹ {product.mrp}</del></small>
                  </small></span>
                  &nbsp;<span className='UserBlackMain'>₹ {product.price}</span>
                </h3>

                <h6 style={{ fontSize: '14px', textTransform: 'uppercase' }}>
                  <span className='UserGrayMain font-normal'>Categories:&nbsp;</span>
                  <span className='UserBlackMain font-bold'>{product.category}</span>
                </h6>

                {
                  product.available === "true" && (
                    <h6 style={{ fontSize: '14px' }}>
                      <span className='UserGrayMain font-normal'>DELIVERY:&nbsp;</span>
                      <span className='font-bold'
                        style={{ cursor: 'pointer', color: '#60e290' }}
                        data-bs-toggle="modal" data-bs-target="#checkPinModal"
                      >CHECK PIN CODE</span>
                    </h6>
                  )
                }
              </div>

              <div className='pt-2' style={{ color: '#777' }} dangerouslySetInnerHTML={{ __html: product.srtDescription }}></div>

              <div className='pt-2'>
                <h6 style={{ fontSize: '14px', textTransform: 'uppercase' }}>
                  <span className='UserGrayMain font-normal'>Availability:&nbsp;</span>
                  {
                    product.available === "true" ? (
                      <span className='UserBlackMain font-bold'>available</span>
                    ) : (
                      <span className='UserBlackMain font-bold'>out of stock</span>
                    )
                  }
                </h6>

                <h6 style={{ fontSize: '14px', textTransform: 'uppercase' }}>
                  <span className='UserGrayMain font-normal'>Cancellation:&nbsp;</span>
                  {
                    product.cancellation === "true" ? (
                      <span className='UserBlackMain font-bold'>Available</span>
                    ) : (
                      <span className='UserBlackMain font-bold'>not available</span>
                    )
                  }
                </h6>

                <h6 style={{ fontSize: '14px', textTransform: 'uppercase' }}>
                  <span className='UserGrayMain font-normal'>Return:&nbsp;</span>
                  {
                    product.return === "true" ? (
                      <span className='UserBlackMain font-bold'>7 days return</span>
                    ) : (
                      <span className='UserBlackMain font-bold'>Return not available </span>
                    )
                  }
                </h6>

              </div>
            </div>

            <div className="variantArea">
              {
                product['variant'] && product['variant'].length > 0 && (
                  <>
                    <p className='m-0 mb-1 UserBlackMain text-small'>Size - {product.variantDetails}</p>
                    <div className='flex' >
                      {
                        product['variant'].map((obj, key) => {
                          if (obj.active) {
                            return (
                              <button key={key} data-type="active">
                                {obj.size}
                              </button>
                            )
                          } else {
                            return (
                              <button key={key} onClick={() => {
                                var newArr = product['variant'].map((elem, pos) => {
                                  if (pos === key) {
                                    elem.active = true
                                  } else {
                                    elem.active = false
                                  }

                                  return elem
                                })

                                let balance = parseInt(product['variant'][key].mrp) - parseInt(product['variant'][key].price)

                                let discount = Math.trunc(balance / parseInt(product['variant'][key].mrp) * 100)
                                setProduct({
                                  ...product,
                                  price: product['variant'][key].price,
                                  mrp: product['variant'][key].mrp,
                                  variantDetails: product['variant'][key].details,
                                  currVariantSize: product['variant'][key].size,
                                  variant: newArr,
                                  discount: discount
                                })
                              }}>
                                {obj.size}
                              </button>
                            )
                          }
                        })
                      }
                    </div>
                  </>
                )
              }
            </div>

            <div className="BuyDiv">

              {
                product.available === "true" ? (
                  <>

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
                            proId: product._id,
                            buyDetails: {
                              price: product.price,
                              mrp: product.mrp,
                              variantSize: product.currVariantSize
                            }
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

                    <div>
                      {
                        OrderDetails.incart ? (
                          <button className='AddToCart' onClick={() => {
                            navigate.push('/cart')
                          }}>Go to cart</button>
                        ) : (
                          <button className='AddToCart' onClick={() => {

                            userAxios((server) => {
                              server.post('/users/addToCart', {
                                item: {
                                  quantity: OrderDetails.quantity,
                                  proId: OrderDetails.proId,
                                  price: product.price,
                                  mrp: product.mrp,
                                  variantSize: product.currVariantSize
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
                                    setCartTotal(amt => amt + parseInt(product.price))
                                  }
                                  setOrderDetails({
                                    ...OrderDetails,
                                    incart: true
                                  })
                                }
                              }).catch((err) => {
                                alert("Something Wrong")
                              })
                            })
                          }}>Add to Cart</button>
                        )
                      }
                    </div>
                  </>
                ) : (
                  <div>
                    <button className='BuyBtn'>Out of Stock</button>
                  </div>
                )
              }

            </div>

            <div className='DescAndReviews'>
              <div className='btns'>
                <button className={showDesReview.description ? 'active-btn' : ''} onClick={() => {
                  setDesReview({
                    ...showDesReview, description: true,
                    review: false
                  })
                }}>Description</button>
                <button className={showDesReview.review ? 'active-btn' : ''} onClick={() => {
                  setDesReview({
                    ...showDesReview, description: false,
                    review: true
                  })
                  getReviews()
                }}>Reviews</button>
              </div>

              <div className='description' style={{ display: showDesReview.description ? 'block' : 'none' }} dangerouslySetInnerHTML={{ __html: product.description }}></div>

              <div className='reviews' style={{ display: showDesReview.review ? 'block' : 'none' }}>


                <div className="ReviewRating">
                  <div className="row">

                    <div className="col-4 text-center">
                      <h2 className='UserBlackMain font-bold pt-2'>
                        {reviews['stars'].rating}
                        &nbsp;
                        <span className='fa fa-star'></span>
                      </h2>
                      <h6 className='text-small UserGrayMain'>{reviews.total} Reviews</h6>

                      {
                        userLogged.status ? (
                          <>
                            {
                              reviews['userReview'] ? <button className='LoginBtn text-small'>
                                To add new review
                                <span className='UserGreenMain' onClick={() => {
                                  deleteReview()
                                }}>
                                  &nbsp;delete&nbsp;
                                </span>
                                old review
                              </button>
                                : <button className='AddReview'
                                  onClick={() => {
                                    setShowReviewModal({
                                      btn: true,
                                      active: true
                                    })
                                  }} >
                                  Add Review
                                </button>
                            }
                          </>
                        )

                          : <button className='LoginBtn text-small'>
                            Must&nbsp;
                            <span className='UserGreenMain' onClick={() => {
                              setLoginModal(obj => ({
                                ...obj,
                                btn: true,
                                active: true,
                                member: true,
                                forgot: false
                              }))
                            }}>
                              logged
                            </span> to post a review
                          </button>
                      }
                    </div>

                    <div className="col-8">
                      <div className="RatingBars">

                        <div className="row">
                          <div className="col-md-3 col-lg-2">
                            <small className='UserBlackMain text-smaller'>
                              5
                              &nbsp;
                              <span className='fa fa-star'></span>
                            </small>
                          </div>
                          <div className="col-md-7 col-lg-8">
                            <div className="barBody">
                              <div className="bar-5" style={{ maxWidth: `${reviews['stars'].fivePerc}%` }}></div>
                            </div>
                          </div>
                          <div className="col-2">
                            <small className='UserGrayMain text-smaller'>
                              {reviews['stars'].five}
                            </small>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-3 col-lg-2">
                            <small className='UserBlackMain text-smaller'>
                              4
                              &nbsp;
                              <span className='fa fa-star'></span>
                            </small>
                          </div>
                          <div className="col-md-7 col-lg-8">
                            <div className="barBody">
                              <div className="bar-4" style={{ maxWidth: `${reviews['stars'].fourPerc}%` }}></div>
                            </div>
                          </div>
                          <div className="col-2">
                            <small className='UserGrayMain text-smaller'>
                              {reviews['stars'].four}
                            </small>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-3 col-lg-2">
                            <small className='UserBlackMain text-smaller'>
                              3
                              &nbsp;
                              <span className='fa fa-star'></span>
                            </small>
                          </div>
                          <div className="col-md-7 col-lg-8">
                            <div className="barBody">
                              <div className="bar-3" style={{ maxWidth: `${reviews['stars'].threePerc}%` }}></div>
                            </div>
                          </div>
                          <div className="col-2">
                            <small className='UserGrayMain text-smaller'>
                              {reviews['stars'].three}
                            </small>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-3 col-lg-2">
                            <small className='UserBlackMain text-smaller'>
                              2
                              &nbsp;
                              <span className='fa fa-star'></span>
                            </small>
                          </div>
                          <div className="col-md-7 col-lg-8">
                            <div className="barBody">
                              <div className="bar-2" style={{ maxWidth: `${reviews['stars'].twoPerc}%` }}></div>
                            </div>
                          </div>
                          <div className="col-2">
                            <small className='UserGrayMain text-smaller'>
                              {reviews['stars'].two}
                            </small>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-3 col-lg-2">
                            <small
                              className='UserBlackMain text-smaller'>
                              1
                              &nbsp;&nbsp;
                              <span className='fa fa-star'></span>
                            </small>
                          </div>
                          <div className="col-md-7 col-lg-8">
                            <div className="barBody">
                              <div className="bar-1" style={{ maxWidth: `${reviews['stars'].onePerc}%` }}></div>
                            </div>
                          </div>
                          <div className="col-2">
                            <small className='UserGrayMain text-smaller'>
                              {reviews['stars'].one}
                            </small>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>

                  <div className="Reviews">
                    {
                      reviews['reviews'] && reviews['reviews'].length !== 0 ? (
                        <>
                          {
                            reviews['reviews'].map((obj, key) => {
                              if (userLogged.status && userLogged._id === obj.userId) {
                                return (
                                  <div key={key} className="cardReview">

                                    <div className="rowCardOwnReview">
                                      <div>
                                        <button className='rating'>
                                          {obj.starInNum}
                                          &nbsp;
                                          <span className='fa fa-star'></span>
                                        </button>
                                      </div>

                                      <div className='reviewTitle'>
                                        <h6 className='UserBlackMain font-bold'>
                                          <small>{obj.title}</small>
                                        </h6>
                                      </div>

                                      <div>
                                        <button className='delete' onClick={() => {
                                          deleteReview()
                                        }}>
                                          delete
                                        </button>
                                      </div>
                                    </div>

                                    <div className="reviewContent" style={{ whiteSpace: 'pre-wrap' }} >
                                      {obj.review}
                                    </div>

                                  </div>
                                )
                              } else {
                                return (
                                  <div key={key} className="cardReview">

                                    <div className="rowCard">
                                      <div>
                                        <button className='rating'>
                                          {obj.starInNum}
                                          &nbsp;
                                          <span className='fa fa-star'></span>
                                        </button>
                                      </div>

                                      <div className='reviewTitle'>
                                        <h6 className='UserBlackMain font-bold'>
                                          <small>{obj.title}</small>
                                        </h6>
                                      </div>
                                    </div>

                                    <div className="reviewContent" style={{ whiteSpace: 'pre-wrap' }} >
                                      {obj.review}
                                    </div>

                                  </div>
                                )
                              }
                            })
                          }
                          {
                            parseInt(reviews.total) !== reviews['reviews'].length ? <button className='loadMore' onClick={() => {
                              loadMoreReviews()
                            }}>load more</button>
                              : (
                                <div className="pt-1"></div>
                              )
                          }
                        </>
                      ) : (
                        <div style={{ paddingLeft: '10px', paddingTop: '10px' }}>
                          <p className='UserGrayMain text-small'>There are no reviews yet.</p>
                        </div>
                      )
                    }
                  </div>

                </div>

              </div>
            </div>

          </div>

        </div>

        <div className="Mobile">

          <div className="ImagesDiv">
            <Swiper
              modules={[Pagination]}
              grabCursor={true}
              pagination={{ clickable: true }}
              loop={false} >
              {
                images.map((item, key) => {
                  return (
                    <SwiperSlide key={key} className="MainimgDiv">
                      <img className='Mainimg' src={ServerId + '/product/' + product.uni_id_1 + product.uni_id_2 + '/' + item.filename} loading="lazy" alt={product.name}
                        onClick={() => {
                          setImgModal({
                            ...ImgModal, active: true,
                            url: `${ServerId + '/product/' + product.uni_id_1 + product.uni_id_2 + '/' + item.filename}`
                          })
                          setQuickVw({
                            ...QuickVw, active: false,
                            btn: false
                          })
                        }} />
                    </SwiperSlide>
                  )
                })
              }
            </Swiper>

          </div>

          <div className="content">
            <div className='TitleShareDiv'>
              <div>
                <h3 className='font-bolder UserBlackMain textSpace'><small>{product.name}</small></h3>
              </div>
              <div>
                <div>
                  <button onClick={copyURL}><i className="fa-solid fa-share-nodes"></i></button>
                </div>
                <div className='pt-5'>
                  <button onClick={() => {
                    userAxios((server) => {
                      server.post('/users/addToWishlist', {
                        item: {
                          proId: product._id,
                          price: product.price,
                          mrp: product.mrp,
                          variantSize: product.currVariantSize
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
                          alert("Product added to wishlist")
                        }
                      }).catch((err) => {
                        alert("Sorry for facing error")
                      })
                    })
                  }}><i className="fa-solid fa-heart"></i></button>
                </div>
              </div>
            </div>

            <div className='pt-2'>
              <h3 className='font-bold'>
                <span className='UserGreenMain'>
                  <small><small>{product.discount}%</small></small>
                </span>
                &nbsp;
                <span><small className='UserGrayMain'>
                  <small><del>₹ {product.mrp}</del></small>
                </small></span>
                &nbsp;
                <span className='UserBlackMain'>₹ {product.price}</span>
              </h3>

              <h6 style={{ fontSize: '14px', textTransform: 'uppercase' }}>
                <span className='UserGrayMain font-normal'>Categories:&nbsp;</span>
                <span className='UserBlackMain font-bold'>{product.category}</span>
              </h6>

              {
                product.available === "true" && (
                  <h6 style={{ fontSize: '14px' }}>
                    <span className='UserGrayMain font-normal'>DELIVERY:&nbsp;</span>
                    <span className='font-bold'
                      style={{ cursor: 'pointer', color: '#60e290' }}
                      data-bs-toggle="modal" data-bs-target="#checkPinModal"
                    >CHECK PIN CODE</span>
                  </h6>
                )
              }

            </div>

            <div className='pt-2' style={{ color: '#777' }} dangerouslySetInnerHTML={{ __html: product.srtDescription }}>
            </div>

            <div className='pt-2'>
              <h6 style={{ fontSize: '14px', textTransform: 'uppercase' }}>
                <span className='UserGrayMain font-normal'>Availability:&nbsp;</span>
                {
                  product.available === "true" ? (
                    <span className='UserBlackMain font-bold'>available</span>
                  ) : (
                    <span className='UserBlackMain font-bold'>out of stock</span>
                  )
                }
              </h6>

              <h6 style={{ fontSize: '14px', textTransform: 'uppercase' }}>
                <span className='UserGrayMain font-normal'>Cancellation:&nbsp;</span>
                {
                  product.cancellation === "true" ? (
                    <span className='UserBlackMain font-bold'>Available</span>
                  ) : (
                    <span className='UserBlackMain font-bold'>not available</span>
                  )
                }
              </h6>

              <h6 style={{ fontSize: '14px', textTransform: 'uppercase' }}>
                <span className='UserGrayMain font-normal'>Return:&nbsp;</span>
                {
                  product.return === "true" ? (
                    <span className='UserBlackMain font-bold'>7 days return</span>
                  ) : (
                    <span className='UserBlackMain font-bold'>Return not available </span>
                  )
                }
              </h6>

            </div>
          </div>

          <div className="variantArea">
            {
              product['variant'] && product['variant'].length > 0 && (
                <>
                  <p className='m-0 mb-1 UserBlackMain text-small'>Size - {product.variantDetails}</p>
                  <div className='flex' >
                    {
                      product['variant'].map((obj, key) => {
                        if (obj.active) {
                          return (
                            <button key={key} data-type="active">
                              {obj.size}
                            </button>
                          )
                        } else {
                          return (
                            <button key={key} onClick={() => {
                              var newArr = product['variant'].map((elem, pos) => {
                                if (pos === key) {
                                  elem.active = true
                                } else {
                                  elem.active = false
                                }

                                return elem
                              })

                              let balance = parseInt(product['variant'][key].mrp) - parseInt(product['variant'][key].price)

                              let discount = Math.trunc(balance / parseInt(product['variant'][key].mrp) * 100)

                              setProduct({
                                ...product,
                                price: product['variant'][key].price,
                                mrp: product['variant'][key].mrp,
                                variantDetails: product['variant'][key].details,
                                currVariantSize: product['variant'][key].size,
                                variant: newArr
                              })
                            }}>
                              {obj.size}
                            </button>
                          )
                        }
                      })
                    }
                  </div>
                </>
              )
            }
          </div>

          <div className="BuyDiv">

            {
              product.available === "true" ? (
                <>
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
                          proId: product._id,
                          buyDetails: {
                            price: product.price,
                            mrp: product.mrp,
                            variantSize: product.currVariantSize
                          }
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

                  <div>
                    {
                      OrderDetails.incart ? (
                        <button className='AddToCart' onClick={() => {
                          navigate.push('/cart')
                        }}>Go to cart</button>
                      ) : (
                        <button className='AddToCart' onClick={() => {
                          userAxios((server) => {
                            server.post('/users/addToCart', {
                              item: {
                                quantity: OrderDetails.quantity,
                                proId: OrderDetails.proId,
                                price: product.price,
                                mrp: product.mrp,
                                variantSize: product.currVariantSize
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
                                  setCartTotal(amt => amt + parseInt(product.price))
                                }
                                setOrderDetails({
                                  ...OrderDetails,
                                  incart: true
                                })
                              }
                            }).catch((err) => {
                              alert("Something Wrong")
                            })
                          })
                        }}>Add to Cart</button>
                      )
                    }
                  </div>
                </>
              ) : (
                <div>
                  <button style={{ width: '10em' }} className='BuyBtn'>Out of Stock</button>
                </div>
              )
            }

          </div>

          <div className='DescAndReviews'>
            <div className='btns'>
              <button className={showDesReview.description ? 'active-btn' : ''} onClick={() => {
                setDesReview({
                  ...showDesReview, description: true,
                  review: false
                })
              }}>Description</button>
              <button className={showDesReview.review ? 'active-btn' : ''} onClick={() => {
                setDesReview({
                  ...showDesReview, description: false,
                  review: true
                })
                getReviews()
              }}>Reviews</button>
            </div>

            <div className='description' style={{ display: showDesReview.description ? 'block' : 'none' }} dangerouslySetInnerHTML={{ __html: product.description }}>
            </div>

            <div className='reviews' style={{ display: showDesReview.review ? 'block' : 'none' }}>

              <div className="ReviewRating">
                <div className="row">

                  <div className="col-4 text-center">
                    <h2 className='UserBlackMain font-bold pt-2'>
                      {reviews['stars'].rating}
                      &nbsp;
                      <span className='fa fa-star'></span>
                    </h2>
                    <h6 className='text-small UserGrayMain'>{reviews.total} Reviews</h6>

                    {
                      userLogged.status ? (
                        <>
                          {
                            reviews['userReview'] ? <button className='LoginBtn text-small'>
                              To add new review
                              <span className='UserGreenMain' onClick={() => {
                                deleteReview()
                              }}>
                                &nbsp;delete&nbsp;
                              </span>
                              old review
                            </button>
                              : <button className='AddReview'
                                onClick={() => {
                                  setShowReviewModal({
                                    btn: true,
                                    active: true
                                  })
                                }} >
                                Add Review
                              </button>
                          }
                        </>
                      )

                        : <button className='LoginBtn text-small'>
                          Must&nbsp;
                          <span className='UserGreenMain' onClick={() => {
                            setLoginModal(obj => ({
                              ...obj,
                              btn: true,
                              active: true,
                              member: true,
                              forgot: false
                            }))
                          }}>
                            logged
                          </span> to post a review
                        </button>
                    }

                  </div>

                  <div className="col-8">
                    <div className="RatingBars">

                      <div className="row">
                        <div className="col-3">
                          <small className='UserBlackMain text-smaller'>
                            5
                            &nbsp;
                            <span className='fa fa-star'></span>
                          </small>
                        </div>
                        <div className="col-7">
                          <div className="barBody">
                            <div className="bar-5" style={{ maxWidth: `${reviews['stars'].fivePerc}%` }}></div>
                          </div>
                        </div>
                        <div className="col-2">
                          <small className='UserGrayMain text-smaller'>
                            {reviews['stars'].five}
                          </small>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-3">
                          <small className='UserBlackMain text-smaller'>
                            4
                            &nbsp;
                            <span className='fa fa-star'></span>
                          </small>
                        </div>
                        <div className="col-7">
                          <div className="barBody">
                            <div className="bar-4" style={{ maxWidth: `${reviews['stars'].fourPerc}%` }}></div>
                          </div>
                        </div>
                        <div className="col-2">
                          <small className='UserGrayMain text-smaller'>
                            {reviews['stars'].four}
                          </small>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-3">
                          <small className='UserBlackMain text-smaller'>
                            3
                            &nbsp;
                            <span className='fa fa-star'></span>
                          </small>
                        </div>
                        <div className="col-7">
                          <div className="barBody">
                            <div className="bar-3" style={{ maxWidth: `${reviews['stars'].threePerc}%` }}></div>
                          </div>
                        </div>
                        <div className="col-2">
                          <small className='UserGrayMain text-smaller'>
                            {reviews['stars'].three}
                          </small>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-3">
                          <small className='UserBlackMain text-smaller'>
                            2
                            &nbsp;
                            <span className='fa fa-star'></span>
                          </small>
                        </div>
                        <div className="col-7">
                          <div className="barBody">
                            <div className="bar-2" style={{ maxWidth: `${reviews['stars'].twoPerc}%` }}></div>
                          </div>
                        </div>
                        <div className="col-2">
                          <small className='UserGrayMain text-smaller'>
                            {reviews['stars'].two}
                          </small>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-3">
                          <small
                            className='UserBlackMain text-smaller'>
                            1
                            &nbsp;&nbsp;
                            <span className='fa fa-star'></span>
                          </small>
                        </div>
                        <div className="col-7">
                          <div className="barBody">
                            <div className="bar-1" style={{ maxWidth: `${reviews['stars'].onePerc}%` }}></div>
                          </div>
                        </div>
                        <div className="col-2">
                          <small className='UserGrayMain text-smaller'>
                            {reviews['stars'].one}
                          </small>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                <div className="Reviews">
                  {
                    reviews['reviews'] && reviews['reviews'].length !== 0 ? (
                      <>
                        {
                          reviews['reviews'].map((obj, key) => {
                            if (userLogged.status && userLogged._id === obj.userId) {
                              return (
                                <div key={key} className="cardReview">

                                  <div className="rowCardOwnReview">
                                    <div>
                                      <button className='rating'>
                                        {obj.starInNum}
                                        &nbsp;
                                        <span className='fa fa-star'></span>
                                      </button>
                                    </div>

                                    <div className='reviewTitle'>
                                      <h6 className='UserBlackMain font-bold'>
                                        <small>{obj.title}</small>
                                      </h6>
                                    </div>

                                    <div>
                                      <button className='delete' onClick={() => {
                                        deleteReview()
                                      }}>
                                        delete
                                      </button>
                                    </div>
                                  </div>

                                  <div className="reviewContent" style={{ whiteSpace: 'pre-wrap' }} >
                                    {obj.review}
                                  </div>

                                </div>
                              )
                            } else {
                              return (
                                <div key={key} className="cardReview">

                                  <div className="rowCard">
                                    <div>
                                      <button className='rating'>
                                        {obj.starInNum}
                                        &nbsp;
                                        <span className='fa fa-star'></span>
                                      </button>
                                    </div>

                                    <div className='reviewTitle'>
                                      <h6 className='UserBlackMain font-bold'>
                                        <small>{obj.title}</small>
                                      </h6>
                                    </div>
                                  </div>

                                  <div className="reviewContent" style={{ whiteSpace: 'pre-wrap' }} >
                                    {obj.review}
                                  </div>

                                </div>
                              )
                            }
                          })
                        }
                        {
                          parseInt(reviews.total) !== reviews['reviews'].length ? <button className='loadMore' onClick={() => {
                            loadMoreReviews()
                          }}>load more</button>
                            : (
                              <div className="pt-1"></div>
                            )
                        }
                      </>
                    ) : (
                      <div style={{ paddingLeft: '10px', paddingTop: '10px' }}>
                        <p className='UserGrayMain text-small'>There are no reviews yet.</p>
                      </div>
                    )
                  }
                </div>

              </div>

            </div>
          </div>

        </div>

        <div className="relatedproducts">

          <div className='heading'>
            <h5>RELATED PRODUCTS</h5>
          </div>

          <Swiper
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            modules={[Autoplay]}
            spaceBetween={20}
            breakpoints={{
              0: {
                slidesPerView: '2',
              },
              768: {
                slidesPerView: '3',
              },
              992: {
                slidesPerView: '4',
              },
              1205: {
                slidesPerView: '5',
              },
            }}
          >
            {
              similar.map((obj, key) => {
                return (
                  <SwiperSlide key={key}>
                    <div className="UserMainProCard">
                      <div className='UserMainProimgDiv text-center'>
                        <div>
                          <button className='offerGreen'>{obj.discount}%</button>
                          {
                            obj.available === "true" ? (
                              <button className='cartBtn' onClick={() => {
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
                              <button className='cartBtn'><i className="fa-solid fa-exclamation"></i></button>
                            )
                          }
                        </div>
                        <Link href={'/p/' + obj.slug + '/' + obj._id}>
                          <img src={ServerId + '/product/' + obj.uni_id_1 + obj.uni_id_2 + '/' + obj.files[0].filename} alt={obj.name} loading="lazy" />
                        </Link>
                        <button className='QuickViewDiv' onClick={() => {
                          Server.get('/users/product/' + obj.slug + '/' + obj._id).then((item) => {
                            setQuickVw({
                              ...QuickVw, active: true,
                              btn: true,
                              product: item.data.product
                            })
                            setImgModal({ ...ImgModal, active: false })
                          }).catch(() => {
                            alert('Facing An Error')
                          })

                        }}>
                          QUICK VIEW
                        </button>
                      </div>
                      <Link href={'/p/' + obj.slug + '/' + obj._id} className="LinkTagNonDec">
                        <div className='pt-2'>
                          <h6 className='UserGrayMain text-small oneLineTxt'><small>{obj.category}</small></h6>
                          <h6 className='UserBlackMain oneLineTxt'>{obj.name}</h6>
                          <h6><small className='UserGrayMain text-small'><del>₹ {obj.mrp}</del></small> <span className='UserBlackMain'>₹ {obj.price}</span></h6>
                        </div>
                      </Link>
                    </div>
                  </SwiperSlide>
                )

              })
            }

          </Swiper>
        </div>
      </div>
    </>
  )
}

export default ProductComp