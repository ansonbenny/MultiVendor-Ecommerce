import React, { Fragment } from 'react'
import { useState, useContext } from 'react'
import Link from 'next/link'
import MenuBar from '../MenuBar/MenuBar'
import style from './Header.module.scss'
import { useEffect } from 'react'
import ContentControl from '../../../ContentControl/ContentControl'
import Login from '../Login/Login'
import Server from '@/Config/Server'
import { useRouter } from 'next/router'

function Header() {

    const [menuBar, setMenuBar] = useState({
        active: false,
        btn: false,
        categories: []
    })

    const [timeDate, setTimeDate] = useState('')

    const { userLogged, setUserLogged,
        LoginModal, setLoginModal, cartTotal } = useContext(ContentControl)

    const [search, setSearch] = useState('')
    const [headerCategories, setHeaderCategories] = useState([])
    const [allCategories, setAllCategories] = useState([])

    const navigate = useRouter()

    function SearchSubmit(e) {
        e.preventDefault()
        navigate.push(`/search?name=${search}`);
    }

    useEffect(() => {
        Server.get('/users/getHeaderCategories').then((categories) => {
            setHeaderCategories(categories.data.categories)
            setAllCategories(categories.data.allCategories)
        }).catch((err) => {
            console.log('error')
        })
    }, [])

    useEffect(() => {
        const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        let time = `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
        let today = `${weekday[new Date().getDay()]} ${month[new Date().getMonth()]} ${new Date().getDate()} ${new Date().getFullYear()}`

        setTimeout(() => {
            setTimeDate(`${today} ${time}`)
        }, 1000)
    })

    return (
        <Fragment>
            {
                !userLogged.status && (
                    <>
                        {LoginModal.active && <Login LoginModal={LoginModal} setLoginModal={setLoginModal} />}
                    </>
                )
            }
            {menuBar.active && <MenuBar menuBar={menuBar} setMenuBar={setMenuBar} />}
            <header>
                <div className={style.UserHeadDesk}>
                    <div className={style.subTop}>
                        <div className="container">
                            <div className="row">
                                <div className="col-6">
                                    <h5 className='text-small'>
                                        <span className='UserGreenMain'><i className="fa-solid fa-truck-fast fa-lg"></i></span>&nbsp;&nbsp;
                                        <span className='font-normal UserGrayMain'>All India Home Delivery</span>
                                    </h5>
                                </div>
                                <div className="col-6">
                                    <h5 className="text-small font-normal UserGrayMain"
                                        style={{ textAlign: 'right' }}
                                    >
                                        <span>{timeDate}</span>
                                        {
                                            userLogged.status && (
                                                <span onClick={() => {
                                                    localStorage.removeItem('token')
                                                    setUserLogged({ status: false })
                                                }} style={{ cursor: 'pointer' }}>&nbsp;&nbsp;
                                                    Logout
                                                </span>
                                            )
                                        }
                                    </h5>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={style.main}>
                        <div className="container">
                            <div className="row">
                                <div className="col-3 pt-2">
                                    <Link className='LinkTagNonDec' href="/">
                                        <h5 className='UserGreenMain'>E Fish</h5>
                                    </Link>
                                </div>
                                <div className="col-5">
                                    <div>
                                        <form onSubmit={SearchSubmit}>
                                            <input className={style.searchBox} required placeholder='Search...'
                                                type='text' value={search} onInput={(e) => {
                                                    setSearch(e.target.value)
                                                }} />
                                            <button className={style.searchBtn}>
                                                <i className="fa-solid fa-magnifying-glass"></i>
                                            </button>
                                        </form>
                                    </div>
                                </div>
                                <div className="col-4" style={{ float: 'right' }}>
                                    <div className='GridTwoAuto'>
                                        <div>
                                            <div className='GridTwoAuto'>
                                                <div className='pt-2'>
                                                    <h6 style={{ cursor: 'pointer' }} onClick={() => {
                                                        if (userLogged.status) {
                                                            navigate.push('/account')
                                                        } else {
                                                            setLoginModal({
                                                                ...LoginModal,
                                                                member: true,
                                                                forgot: false,
                                                                btn: true,
                                                                active: true
                                                            })
                                                        }
                                                    }}>
                                                        <i className="fa-solid fa-user fa-xl UserBlackMain"></i>
                                                    </h6>
                                                </div>
                                                <div>

                                                    <h6 className='text-small' style={{ cursor: 'pointer' }} onClick={() => {
                                                        if (userLogged.status) {
                                                            navigate.push('/account')
                                                        } else {
                                                            setLoginModal({
                                                                ...LoginModal,
                                                                member: true,
                                                                forgot: false,
                                                                btn: true,
                                                                active: true
                                                            })
                                                        }
                                                    }}>Welcome</h6>

                                                    {
                                                        userLogged.status ? (
                                                            <h6 className={style.accNameMax + ' text-small UserBlackMain'}
                                                                style={{ cursor: 'pointer' }} onClick={() => {
                                                                    navigate.push('/account')
                                                                }}>{userLogged.name}</h6>
                                                        ) :
                                                            <h6 className='text-small UserBlackMain'><span onClick={() => {
                                                                setLoginModal({
                                                                    ...LoginModal,
                                                                    member: true,
                                                                    forgot: false,
                                                                    btn: true,
                                                                    active: true
                                                                })
                                                            }} style={{ cursor: 'pointer' }}>Login</span> / <span onClick={() => {
                                                                setLoginModal({
                                                                    ...LoginModal,
                                                                    member: false,
                                                                    btn: true,
                                                                    active: true
                                                                })
                                                            }} style={{ cursor: 'pointer' }}>Sign Up</span></h6>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className='GridTwoAuto'>
                                                <div className='pt-2'>
                                                    <h6 style={{ cursor: 'pointer' }} onClick={() => {
                                                        navigate.push('/cart')
                                                    }}>
                                                        <i className="fa-solid fa-bag-shopping fa-xl UserBlackMain"></i>
                                                    </h6>
                                                </div>
                                                <div>
                                                    {
                                                        userLogged.status ? (
                                                            <>
                                                                <h6 className='text-small' style={{ cursor: 'pointer' }} onClick={() => {
                                                                    navigate.push('/cart')
                                                                }}>Cart</h6>
                                                                <h6 className='text-small UserBlackMain' style={{ cursor: 'pointer' }} onClick={() => {
                                                                    navigate.push('/cart')
                                                                }}>₹ {cartTotal}</h6>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <h6 className='text-small' style={{ cursor: 'pointer' }} onClick={() => {
                                                                    navigate.push('/cart')
                                                                }}>Cart</h6>
                                                                <h6 className='text-small UserBlackMain' style={{ cursor: 'pointer' }} onClick={() => {
                                                                    navigate.push('/')
                                                                }}>₹ 0</h6>
                                                            </>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={style.sub}>
                        <div className="container">
                            <div>
                                <ul>
                                    <li><Link className={style.mainLink} href={'/'}>Home</Link></li>
                                    <li><h6>All Categories</h6>
                                        <div className={style.showCategories}>
                                            <div className={style.innerDiv}>
                                                <div className='container container-fluid'>
                                                    <div className='row'>
                                                        {
                                                            allCategories.map((obj, key) => {
                                                                var mainSub = obj.mainSub
                                                                return (
                                                                    <div className='col-md-4 col-lg-3' key={key}>

                                                                        <div>
                                                                            <Link className={style.innerLinks + ' font-bold'} href={`/c/${obj.slug}`}>{obj.name}</Link>
                                                                        </div>
                                                                        {
                                                                            mainSub.map((obj2, key2) => {
                                                                                return (
                                                                                    <div className='pt-1' key={key2}>
                                                                                        <Link className={style.innerLinksTwo} href={`/c/${obj2.slug}`}>{obj2.name}</Link>
                                                                                        <br />
                                                                                    </div>
                                                                                )
                                                                            })
                                                                        }

                                                                    </div>
                                                                )
                                                            })
                                                        }

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    {
                                        headerCategories.map((obj, key) => {
                                            var mainSub = obj.mainSub
                                            var sub = obj.sub
                                            return (
                                                <Fragment key={key}>
                                                    <li className='UserBlackMain'>
                                                        <h6>{obj.name}</h6>
                                                        <div className={style.showCategories}>
                                                            <div className={style.innerDiv}>
                                                                <div className='container container-fluid'>
                                                                    <div className='row'>
                                                                        {
                                                                            mainSub.map((obj2, key2) => {
                                                                                return (
                                                                                    <div className='col-md-4 col-lg-3' key={key2}>
                                                                                        <div>
                                                                                            <Link className={style.innerLinks + ' font-bold'} href={`/c/${obj2.slug}`}>{obj2.name}</Link>
                                                                                        </div>
                                                                                        <div className='pt-1'>
                                                                                            {
                                                                                                sub.map((obj3, key3) => {
                                                                                                    if (obj2.slug === obj3.mainSubSlug) {
                                                                                                        return (
                                                                                                            <Fragment key={key3}>
                                                                                                                <Link className={style.innerLinksTwo} href={`/c/${obj3.slug}`}>{obj3.name}</Link>
                                                                                                                <br />
                                                                                                            </Fragment>
                                                                                                        )
                                                                                                    } else {
                                                                                                        return null
                                                                                                    }
                                                                                                })
                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                )
                                                                            })
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </Fragment>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>

                </div>

                <div className={style.UserHeadMob}>
                    <div className={style.subTop}>
                        <div className="container">
                            <div className="row">
                                <div className="col-12">
                                    <h5 className='text-small'>
                                        <span className='UserGreenMain'><i className="fa-solid fa-truck-fast fa-lg"></i></span>&nbsp;&nbsp;
                                        <span className='font-normal UserGrayMain'>All India Home Delivery</span>
                                    </h5>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={style.MainMob + " pt-3"}>
                        <div className="container">
                            <div className="row">
                                <div className="col-3">
                                    <button className={style.MobMenuBar} onClick={() => {
                                        setMenuBar({
                                            ...menuBar,
                                            active: true,
                                            btn: true,
                                            categories: headerCategories
                                        })
                                    }}>
                                        <i className="fa-solid fa-bars fa-xl UserBlackMain"></i>
                                    </button>
                                </div>
                                <div className="col-6">
                                    <Link className='LinkTagNonDec' href="/">
                                        <h3 className="UserGreenMain text-center">E Fish</h3>
                                    </Link>
                                </div>
                                <div className='col-3 text-end'>
                                    <h6 style={{ cursor: 'pointer' }} onClick={() => {
                                        if (userLogged.status) {
                                            navigate.push('/account')
                                        } else {
                                            setLoginModal({
                                                ...LoginModal,
                                                member: true,
                                                forgot: false,
                                                btn: true,
                                                active: true
                                            })
                                        }
                                    }}>
                                        <i className="fa-solid fa-user fa-xl UserBlackMain"></i>
                                    </h6>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={style.subBottumMob}>
                        <div className="container text-center pt-3">
                            <form onSubmit={SearchSubmit}>
                                <input className={style.searchBox} required placeholder='Search...'
                                    type='text' value={search} onInput={(e) => {
                                        setSearch(e.target.value)
                                    }} />
                                <button className={style.searchBtn}>
                                    <i className="fa-solid fa-magnifying-glass"></i>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </header>
        </Fragment >
    )
}

export default Header