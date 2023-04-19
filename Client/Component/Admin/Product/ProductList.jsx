import Loading from '@/Component/Loading/Loading'
import ContentControl from '@/ContentControl/ContentControl'
import { useRouter } from 'next/router'
import { Fragment, useContext } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import Server, { adminAxios, ServerId } from '../../../Config/Server'

function ProductList({ loaded, setLoaded }) {

    const { setAdminLogged } = useContext(ContentControl)

    const [responseServer, setResponse] = useState({
        pagination: false
    })

    const [update, setUpdate] = useState(false)

    const [search, setSearch] = useState('')

    const [pages, setPages] = useState([])

    const [products, setProducts] = useState([])

    const navigate = useRouter()

    const logOut = () => {
        setAdminLogged({ status: false })
        localStorage.removeItem("adminToken")
        setLoaded(true)
        navigate.push('/admin/login')
    }

    useEffect(() => {
        setLoaded(false)
        if (!navigate.query.search && search.length === 0) {
            adminAxios((server) => {
                server.get('/admin/getProducts', {
                    params: {
                        page: 1,
                        search: null
                    }
                }).then((response) => {
                    if (response.data.login) {
                        logOut()
                    } else {
                        setProducts(response.data.data)
                        setResponse(response.data)
                        setPages(response.data.pages)
                    }
                }).catch((err) => {
                    console.log("error")
                })
            })
            setLoaded(true)
            setSearch('')
        } else {
            adminAxios((server) => {
                server.get('/admin/getProducts', {
                    params: {
                        page: 1,
                        search: navigate.query.search
                    }
                }).then((response) => {
                    if (response.data.login) {
                        logOut()
                    } else {
                        setProducts(response.data.data)
                        setResponse(response.data)
                        setPages(response.data.pages)
                    }
                }).catch((err) => {
                    console.log("error")
                })
            })
            setLoaded(true)
        }
    }, [search, update, navigate.query])

    function searchProduct(e) {
        e.preventDefault()
        navigate.push(`/admin/products?search=${search}`)
    }

    return (
        <>
            {
                loaded ? (
                    <div className='AdminContainer'>
                        <div className='pt-3 ProductListAdmin'>

                            <div className='TitleGrid'>
                                <div>
                                    <h5 className='UserBlackMain font-bold'>PRODUCTS</h5>
                                </div>
                                <div>
                                    <button className='AddBtn' onClick={() => [
                                        navigate.push('/admin/products/add')
                                    ]}>Add Product</button>
                                </div>
                            </div>

                            {responseServer.showNot ? (
                                <div className='text-center pt-5'>
                                    <h3 className='font-bold UserBlackMain2nd'>Products Not Found</h3>
                                </div>
                            ) : (
                                <Fragment>
                                    <div className='searchDiv'>
                                        <form onSubmit={searchProduct}>
                                            <input value={search} type="text" onChange={(e) => {
                                                setSearch(e.target.value)
                                            }} placeholder='Search ....' />
                                        </form>
                                    </div>

                                    <div className='Products'>

                                        {products.map((obj, key) => {
                                            return (
                                                <div className='productCard' key={key}>
                                                    <div className='innerCard'>
                                                        <div className='ImgDiv'>
                                                            <img
                                                                src={`${ServerId}/product/${obj.uni_id_1}${obj.uni_id_2}/${obj.files[0].filename}`}
                                                                alt={obj.name}
                                                            />
                                                        </div>

                                                        <div className='p-3'>
                                                            <h5 className='UserBlackMain2nd oneLineTxt'>{obj.name}</h5>
                                                            <h6 className='UserGrayMain font-bold'><small>{obj.category}</small></h6>
                                                            <h6>
                                                                <span className='UserGreenMain font-bold'>
                                                                    <small><small>{obj.discount}%</small></small>
                                                                </span>
                                                                &nbsp;
                                                                <small><del className='UserGrayMain font-bold'>₹{obj.mrp}</del>&nbsp;</small>
                                                                <span className='UserBlackMain2nd font-bold'>₹{obj.price}</span>

                                                            </h6>
                                                        </div>

                                                        <div className='CardMenu'>
                                                            <button className='View' onClick={() => {
                                                                window.open(`/p/${obj.slug}/${obj._id}`, '_blank')
                                                            }}><i className="fa-solid fa-eye"></i></button>
                                                            <button className='Edit' onClick={() => {
                                                                navigate.push('/admin/products/edit/' + obj._id)
                                                            }}><i className="fa-solid fa-pen-to-square"></i></button>
                                                            <button className='Delete' onClick={() => {
                                                                if (window.confirm(`Do You Want Delete ${obj.name}`)) {
                                                                    adminAxios((server) => {
                                                                        server.delete(`/admin/deleteProduct/${obj._id}`, {
                                                                            data: {
                                                                                folderId: obj.uni_id_1 + obj.uni_id_2
                                                                            }
                                                                        }).then((res) => {
                                                                            if (res.data.login) {
                                                                                logOut()
                                                                            } else {
                                                                                alert("Product Deleted")
                                                                                setUpdate(!update)
                                                                            }
                                                                        }).catch((err) => {
                                                                            alert("Sorry Server Has Some Problem")
                                                                        })
                                                                    })
                                                                }
                                                            }}><i className="fa-solid fa-trash"></i></button>
                                                        </div>
                                                    </div>

                                                </div>
                                            )
                                        })}

                                    </div>

                                </Fragment>
                            )}

                        </div>

                        {
                            responseServer.pagination &&
                            (
                                <div className='AdminProListPaginationArea'>
                                    {
                                        pages.map((obj, key) => {
                                            if (responseServer.currentPage === obj) {
                                                return (
                                                    <button key={key} onClick={() => {
                                                        const sp = new URLSearchParams(window.location.search);
                                                        adminAxios((server) => {
                                                            server.get('/admin/getProducts', {
                                                                params: {
                                                                    page: obj,
                                                                    search: sp.get("search")
                                                                }
                                                            }).then((response) => {
                                                                if (response.data.login) {
                                                                    logOut()
                                                                } else {
                                                                    setProducts(response.data.data)
                                                                    setResponse(response.data)
                                                                    setPages(response.data.pages)
                                                                }
                                                            }).catch((err) => {
                                                                console.log("error")
                                                            })
                                                        })
                                                    }} className='active'>{obj}</button>
                                                )
                                            } else {
                                                return (
                                                    <button key={key} onClick={() => {
                                                        const sp = new URLSearchParams(window.location.search);
                                                        adminAxios((server) => {
                                                            server.get('/admin/getProducts', {
                                                                params: {
                                                                    page: obj,
                                                                    search: sp.get("search")
                                                                }
                                                            }).then((response) => {
                                                                if (response.data.login) {
                                                                    logOut()
                                                                } else {
                                                                    setProducts(response.data.data)
                                                                    setResponse(response.data)
                                                                    setPages(response.data.pages)
                                                                }
                                                            }).catch((err) => {
                                                                console.log("error")
                                                            })
                                                        })
                                                    }} >{obj}</button>
                                                )
                                            }
                                        })
                                    }

                                </div>
                            )
                        }
                    </div>
                ) : <Loading />
            }
        </>
    )
}

export default ProductList
