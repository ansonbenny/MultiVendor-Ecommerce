import React from 'react'
import style from './HomePost.module.scss'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from "swiper";
import 'swiper/css';
import { useContext } from 'react';
import Link from 'next/link';
import Server, { ServerId, userAxios } from '@/Config/Server';
import ContentControl from '@/ContentControl/ContentControl';

function HomePost({ layout }) {
    const { sectionfour, sectionone,
        sectiontwo, sectionthree,
        sliderTwo, banner } = layout

    const {
        setQuickVw, QuickVw,
        setUserLogged, setLoginModal, setCartTotal
    } = useContext(ContentControl)

    function LogOut() {
        setUserLogged({
            status: false
        })
        localStorage.removeItem('token')
    }

    return (
        <div className={style.HomePost}>
            <div className='container'>
                <div className={style.SECTION1}>
                    <div className='p-3 pt-5'>
                        <h1 className='text-center font-bolder UserBlackMain'>{sectionone.title}</h1>
                        <h6 className='text-center font-bolder UserGrayMain'>{sectionone.subTitle}</h6>
                    </div>
                    <div className='text-center'>
                        <Swiper
                            autoplay={{
                                delay: 5000,
                                disableOnInteraction: false,
                            }}
                            modules={[Autoplay]}
                            spaceBetween={10}
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
                                sectionone['items'].map((obj, key) => {
                                    if (obj._id !== undefined) {
                                        return (
                                            <SwiperSlide key={key}>

                                                <div className={style.UserCateSlidCard}>
                                                    <div className={style.InnerDiv}>
                                                        <Link href={`/c/${obj.slug}`} className="LinkTagNonDec">
                                                            <div className={style.UserCateSlidImgDiv}>
                                                                <img className={style.UserCateSlidImg}
                                                                    src={`${ServerId}/category/${obj.uni_id1}${obj.uni_id2}/${obj.file.filename}`} alt={obj.name} loading="lazy" />
                                                            </div>
                                                            <div>
                                                                <h5 style={{ fontSize: '16px', paddingLeft: '5px', paddingRight: '5px' }}
                                                                    className='UserBlackMain font-bolder oneLineTxt'>{obj.name}</h5>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </SwiperSlide>
                                        )
                                    } else {
                                        return null
                                    }

                                })
                            }

                        </Swiper>
                    </div>
                </div>
            </div>

            <div className="container p-4 pt-2">

                <Swiper
                    autoplay={{
                        delay: 4000,
                        disableOnInteraction: false,
                    }}
                    modules={[Autoplay]}
                    spaceBetween={20}
                    breakpoints={{
                        0: {
                            slidesPerView: '1',
                        },
                        768: {
                            slidesPerView: '1',
                        },
                        992: {
                            slidesPerView: '2',
                        },
                        1205: {
                            slidesPerView: '2',
                        },
                    }}
                >
                    {
                        sliderTwo['items'].map((obj, key) => {
                            return (
                                <SwiperSlide key={key}>
                                    <div>
                                        <img className='ResponsiveImg rounded' style={{ cursor: 'pointer' }}
                                            src={`${ServerId}/${sliderTwo.for}/${obj.uni_id}/${obj.file.filename}`}
                                            loading="lazy" alt="slider"
                                            onClick={() => {
                                                window.open(banner.link, '_blank')
                                            }}
                                        />
                                    </div>
                                </SwiperSlide>
                            )
                        })
                    }

                </Swiper>
            </div>

            <div className='UserMainBgGrey'>
                <div className='container'>
                    <div className='p-3 pt-5'>
                        <h1 className='text-center font-bolder UserBlackMain'>{sectiontwo.title}</h1>
                        <h6 className='text-center font-bolder UserGrayMain'>{sectiontwo.subTitle}</h6>
                    </div>
                    <div>
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
                                sectiontwo['items'].map((obj, key) => {
                                    if (obj._id !== undefined) {
                                        return (
                                            <SwiperSlide key={key}>
                                                <div className={style.UserMainProCard}>
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
                                                        <Link href={`/p/${obj.slug}/${obj._id}`} className="LinkTagNonDec">
                                                            <img
                                                                src={`${ServerId}/product/${obj.uni_id_1}${obj.uni_id_2}/${obj.files[0].filename}`}
                                                                loading="lazy" alt={obj.name}
                                                            />
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
                                                    <Link href={`/p/${obj.slug}/${obj._id}`} className="LinkTagNonDec">
                                                        <div className='pt-2'>
                                                            <h6 className='UserGrayMain text-small oneLineTxt'><small>{obj.category}</small></h6>
                                                            <h6 className='UserBlackMain oneLineTxt'>{obj.name}</h6>
                                                            <h6><small className='UserGrayMain text-small'><del>₹ {obj.mrp}</del></small> <span className='UserBlackMain'>₹ {obj.price}</span></h6>
                                                        </div>
                                                    </Link>
                                                </div>
                                            </SwiperSlide>
                                        )
                                    } else {
                                        return null
                                    }

                                })
                            }

                        </Swiper>
                    </div>

                    <div>
                        <Swiper
                            autoplay={{
                                delay: 5000,
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
                                sectiontwo['items2'].map((obj, key) => {
                                    if (obj._id !== undefined) {
                                        return (
                                            <SwiperSlide key={key}>
                                                <div className={style.UserMainProCard}>
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
                                                        <Link href={`/p/${obj.slug}/${obj._id}`} className="LinkTagNonDec">
                                                            <img
                                                                src={`${ServerId}/product/${obj.uni_id_1}${obj.uni_id_2}/${obj.files[0].filename}`}
                                                                loading="lazy" alt={obj.name}
                                                            />
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
                                                    <Link href={`/p/${obj.slug}/${obj._id}`} className="LinkTagNonDec">
                                                        <div className='pt-2'>
                                                            <h6 className='UserGrayMain text-small oneLineTxt'><small>{obj.category}</small></h6>
                                                            <h6 className='UserBlackMain oneLineTxt'>{obj.name}</h6>
                                                            <h6><small className='UserGrayMain text-small'><del>₹ {obj.mrp}</del></small> <span className='UserBlackMain'>₹ {obj.price}</span></h6>
                                                        </div>
                                                    </Link>
                                                </div>
                                            </SwiperSlide>
                                        )
                                    } else {
                                        return null
                                    }

                                })
                            }

                        </Swiper>
                    </div>
                </div>
            </div>

            {
                banner.file.length !== 0 && (
                    <div className="UserMainBgGrey">
                        <div className="container p-4">
                            <img style={{ marginBottom: '20px', cursor: 'pointer' }}
                                className='ResponsiveImg rounded'
                                src={`${ServerId}/banner/${banner.file.filename}`}
                                onClick={() => {
                                    window.open(banner.link, '_blank')
                                }}
                                loading="lazy" alt="banner"
                            />
                        </div>
                    </div>
                )
            }

            <div>
                <div className='container'>
                    <div className='p-3 pt-5'>
                        <h1 className='text-center font-bolder UserBlackMain'>{sectionthree.title}</h1>
                        <h6 className='text-center font-bolder UserGrayMain'>{sectionthree.subTitle}</h6>
                    </div>
                    <div>
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
                                sectionthree['items'].map((obj, key) => {
                                    if (obj._id !== undefined) {
                                        return (
                                            <SwiperSlide key={key}>
                                                <div className={style.UserMainProCard}>
                                                    <div className={style.UserMainProimgDiv + ' text-center'} style={{ background: '#f4f4f4' }}>
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
                                                        <Link href={`/p/${obj.slug}/${obj._id}`} className="LinkTagNonDec">
                                                            <img
                                                                src={`${ServerId}/product/${obj.uni_id_1}${obj.uni_id_2}/${obj.files[0].filename}`}
                                                                loading="lazy" alt={obj.name}
                                                            />
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
                                                    <Link href={`/p/${obj.slug}/${obj._id}`} className="LinkTagNonDec">
                                                        <div className='pt-2'>
                                                            <h6 className='UserGrayMain text-small oneLineTxt'><small>{obj.category}</small></h6>
                                                            <h6 className='UserBlackMain oneLineTxt'>{obj.name}</h6>
                                                            <h6><small className='UserGrayMain text-small'><del>₹ {obj.mrp}</del></small> <span className='UserBlackMain'>₹ {obj.price}</span></h6>
                                                        </div>
                                                    </Link>
                                                </div>
                                            </SwiperSlide>
                                        )
                                    } else {
                                        return null
                                    }

                                })
                            }

                        </Swiper>
                    </div>

                    <div>
                        <Swiper
                            autoplay={{
                                delay: 5000,
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
                                sectionthree['items2'].map((obj, key) => {
                                    if (obj._id !== undefined) {
                                        return (
                                            <SwiperSlide key={key}>
                                                <div className={style.UserMainProCard}>
                                                    <div className={style.UserMainProimgDiv + ' text-center'} style={{ background: '#f4f4f4' }}>
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
                                                        <Link href={`/p/${obj.slug}/${obj._id}`} className="LinkTagNonDec">
                                                            <img
                                                                src={`${ServerId}/product/${obj.uni_id_1}${obj.uni_id_2}/${obj.files[0].filename}`}
                                                                loading="lazy" alt={obj.name}
                                                            />
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
                                                    <Link href={`/p/${obj.slug}/${obj._id}`} className="LinkTagNonDec">
                                                        <div className='pt-2'>
                                                            <h6 className='UserGrayMain text-small oneLineTxt'><small>{obj.category}</small></h6>
                                                            <h6 className='UserBlackMain oneLineTxt'>{obj.name}</h6>
                                                            <h6><small className='UserGrayMain text-small'><del>₹ {obj.mrp}</del></small> <span className='UserBlackMain'>₹ {obj.price}</span></h6>
                                                        </div>
                                                    </Link>
                                                </div>
                                            </SwiperSlide>
                                        )
                                    } else {
                                        return null
                                    }

                                })
                            }

                        </Swiper>
                    </div>
                </div>
            </div>

            <div className='UserMainBgGrey' style={{ paddingBottom: '50px' }}>
                <div className='container'>
                    <div className='p-3 pt-5'>
                        <h1 className='text-center font-bolder UserBlackMain'>{sectionfour.title}</h1>
                        <h6 className='text-center font-bolder UserGrayMain'>{sectionfour.subTitle}</h6>
                    </div>
                    <div>
                        <Swiper
                            autoplay={{
                                delay: 4000,
                                disableOnInteraction: false,
                            }}
                            modules={[Autoplay]}
                            spaceBetween={20}
                            breakpoints={{
                                0: {
                                    slidesPerView: '1',
                                },
                                768: {
                                    slidesPerView: '2',
                                },
                                992: {
                                    slidesPerView: '2',
                                },
                                1205: {
                                    slidesPerView: '3',
                                },
                            }}
                        >
                            {
                                sectionfour['items'].map((obj, key) => {
                                    if (obj._id !== undefined) {
                                        return (
                                            <SwiperSlide key={key}>
                                                <div className={style.usrLastHmMainDiv}>
                                                    <Link href={`/p/${obj.slug}/${obj._id}`} className="LinkTagNonDec">
                                                        <div className={style.usrLastHmGrid}>
                                                            <div>
                                                                <div className={style.UsrImgdivHomeLast}>
                                                                    <img
                                                                        src={`${ServerId}/product/${obj.uni_id_1}${obj.uni_id_2}/${obj.files[0].filename}`}
                                                                        loading="lazy" alt={obj.name}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className='p-2'>
                                                                <h6 className={style.category + ' UserGrayMain text-small oneLineTxt'}>
                                                                    <small>{obj.category}</small>
                                                                </h6>
                                                                <h6 className={style.proName + ' UserBlackMain oneLineTxt'}>{obj.name}</h6>
                                                                <h6><small className='UserGrayMain text-small'><del>₹ {obj.mrp}</del></small> <span className='UserBlackMain'>₹ {obj.price}</span></h6>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </div>
                                            </SwiperSlide>
                                        )
                                    } else {
                                        return null
                                    }

                                })
                            }

                        </Swiper>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default HomePost