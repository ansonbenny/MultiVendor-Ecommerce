import React, { Fragment, useContext } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { adminAxios, ServerId } from '../../../Config/Server'
import EditCategory from './EditCategory'
import MainModal from './MainModal'
import ExtraModal from './ExtraModal'
import Loading from '@/Component/Loading/Loading'
import ContentControl from '@/ContentControl/ContentControl'
import { useRouter } from 'next/router'

function CategoriesComp({ loaded, setLoaded }) {
    const { setAdminLogged } = useContext(ContentControl)
    const navigate = useRouter()

    const logOut = () => {
        setAdminLogged({ status: false })
        localStorage.removeItem("adminToken")
        setLoaded(true)
        navigate.push('/admin/login')
    }

    const [mainModal, setMainModal] = useState({
        btn: false,
        active: false,
    })

    const [extraModal, setExtraModal] = useState({
        btn: false,
        active: false,
        for: ''
    })

    const [editModal, setEditModal] = useState({
        btn: false,
        active: false,
    })

    const [page, setPage] = useState({
        category: true,
        mainSub: false,
        sub: false
    })

    const [editCategory, setEditCategory] = useState({})

    const [categories, setCategories] = useState([])

    const [mainSub, setMainSub] = useState([])

    const [subCategory, setSub] = useState([])

    function GetCategories() {
        setLoaded(false)
        adminAxios((server) => {
            server.get('/admin/getAllTypesCategory').then((response) => {
                if (response.data.login) {
                    logOut()
                } else {
                    setCategories(response.data.categories)
                    setMainSub(response.data.mainSub)
                    setSub(response.data.subCategory)
                    setLoaded(true)
                }
            }).catch((err) => {
                console.log('err')
                setLoaded(true)
            })
        })
    }

    useEffect(() => {
        GetCategories()
    }, [])

    return (
        <Fragment>
            {mainModal.active && <MainModal
                mainModal={mainModal}
                setMainModal={setMainModal}
                setCategories={setCategories}
                logOut={logOut} />}
            {editModal.active && <EditCategory
                editModal={editModal}
                setEditModal={setEditModal}
                setCategories={setCategories}
                editCategory={editCategory}
                logOut={logOut} />}
            {extraModal.active && <ExtraModal
                extraModal={extraModal}
                setExtraModal={setExtraModal}
                setCategories={setCategories}
                setMainSub={setMainSub}
                setSub={setSub}
                logOut={logOut} />}


            {
                loaded ? (
                    <div className='AdminContainer CategoriesComp pb-3'>

                        <div className='ActionAreaDiv text-center pt-3 pb-5'>
                            <div className="row">
                                <div className="col-12 col-md-3 pb-1">
                                    <button className='BUTTONS' onClick={() => {
                                        setMainModal({
                                            ...mainModal, btn: true,
                                            active: true
                                        })
                                    }}>Add Categoty</button>
                                </div>
                                <div className="col-12 col-md-3 pb-1">
                                    <button className='BUTTONS' onClick={() => {
                                        setExtraModal({
                                            ...extraModal,
                                            btn: true,
                                            active: true,
                                            for: 'mainSub'
                                        })
                                    }}>Add Main Sub</button>
                                </div>
                                <div className="col-12 col-md-3 pb-1">
                                    <button className='BUTTONS' onClick={() => {
                                        setExtraModal({
                                            ...extraModal,
                                            btn: true,
                                            active: true,
                                            for: 'sub'
                                        })
                                    }}>Add Sub</button>
                                </div>

                                <div className="col-12 col-md-3 pb-1">
                                    <button className='BUTTONS' onClick={() => {
                                        setExtraModal({
                                            ...extraModal,
                                            btn: true,
                                            active: true,
                                            for: 'header'
                                        })
                                    }}>Add Header</button>
                                </div>
                            </div>
                        </div>

                        <div className="BtnsSections text-center pt-3">
                            <div className="row">
                                <div className="col-12 col-md-3 pb-2">
                                    <button className='BUTTONS' onClick={() => {
                                        GetCategories()

                                        setPage({
                                            ...page,
                                            category: true,
                                            mainSub: false,
                                            sub: false
                                        })
                                    }}>Show Categories</button>
                                </div>
                                <div className="col-12 col-md-3 pb-2">
                                    <button className='BUTTONS' onClick={() => {
                                        GetCategories()

                                        setPage({
                                            ...page,
                                            category: false,
                                            mainSub: true,
                                            sub: false
                                        })
                                    }}>Show Main Sub</button>
                                </div>
                                <div className="col-12 col-md-3 pb-2">
                                    <button className='BUTTONS' onClick={() => {
                                        GetCategories()

                                        setPage({
                                            ...page,
                                            category: false,
                                            mainSub: false,
                                            sub: true
                                        })
                                    }}>Show Sub</button>
                                </div>

                            </div>
                        </div>

                        {
                            page.category === true && (
                                <div className='MainCategory text-center'>
                                    <table className="table align-middle">
                                        <thead>
                                            <tr>
                                                <th>Image</th>
                                                <th>Name</th>
                                                <th>Header</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {
                                                categories.map((obj, key) => {
                                                    return (
                                                        <tr key={key}>
                                                            <td className='col-2'>
                                                                <img className='TableImg'
                                                                    src={ServerId + '/category/' + obj.uni_id1 + obj.uni_id2 + '/' + obj.file.filename}
                                                                    alt={obj.name}
                                                                />
                                                            </td>
                                                            <td className='col-4'>{obj.name}</td>
                                                            <td className='col-2'>{obj.header}</td>
                                                            <td className='col-4'>

                                                                <button className='cateActionBtn' onClick={() => {
                                                                    adminAxios((server) => {
                                                                        server.get('/admin/getOneCategory/' + obj._id).then((data) => {
                                                                            if (data.data.login) {
                                                                                logOut()
                                                                            } else {
                                                                                setEditCategory(data.data)
                                                                                setEditModal({
                                                                                    ...editModal,
                                                                                    btn: true,
                                                                                    active: true
                                                                                })
                                                                            }
                                                                        }).catch(() => {
                                                                            alert("Facing an error")
                                                                        })
                                                                    })

                                                                }}>Edit</button>

                                                                <button className='cateActionBtn' onClick={() => {
                                                                    if (window.confirm("Do you want delete " + obj.name)) {
                                                                        adminAxios((server) => {
                                                                            server.delete('/admin/deleteCategory/' + obj._id, {
                                                                                data: {
                                                                                    folderId: obj.uni_id1 + obj.uni_id2
                                                                                }
                                                                            }).then(() => {
                                                                                adminAxios((server) => {
                                                                                    server.get('/admin/getCatgories').then((data) => {
                                                                                        if (data.data.login) {
                                                                                            logOut()
                                                                                        } else {
                                                                                            setCategories(data.data)
                                                                                        }
                                                                                    }).catch((err) => {
                                                                                        console.log('err')
                                                                                    })
                                                                                })
                                                                            }).catch(() => {
                                                                                alert("Sorry We Facing Some Error")
                                                                            })
                                                                        })
                                                                    }
                                                                }}>Delete</button>
                                                            </td>
                                                        </tr>

                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            )
                        }

                        {
                            page.mainSub === true && (
                                <div className='MainCategory text-center'>
                                    <table className="table align-middle">
                                        <thead>
                                            <tr>
                                                <th>Category</th>
                                                <th>Name</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {
                                                mainSub.map((obj, key) => {
                                                    return (
                                                        <tr key={key}>
                                                            <td className='col-4'>{obj.category}</td>
                                                            <td className='col-4'>{obj.name}</td>
                                                            <td className='col-4'>
                                                                <button className='cateActionBtn' onClick={() => {
                                                                    if (window.confirm("Do you want delete " + obj.name)) {
                                                                        adminAxios((server) => {
                                                                            server.put('/admin/deleteMainSubCategory/' + obj._id, {
                                                                                name: obj.name,
                                                                                category: obj.category,
                                                                                uni_id: obj.uni_id,
                                                                                slug: obj.slug
                                                                            }).then((res) => {
                                                                                if (res.data.login) {
                                                                                    logOut()
                                                                                } else {
                                                                                    GetCategories()
                                                                                }
                                                                            }).catch(() => {
                                                                                alert("Sorry We Facing Some Error")
                                                                            })
                                                                        })
                                                                    }
                                                                }}>Delete</button>
                                                            </td>
                                                        </tr>

                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>

                                </div>
                            )
                        }

                        {
                            page.sub === true && (
                                <div className='MainCategory text-center'>
                                    <table className="table align-middle">
                                        <thead>
                                            <tr>
                                                <th>Category</th>
                                                <th>Main</th>
                                                <th>Name</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {
                                                subCategory.map((obj, key) => {
                                                    return (
                                                        <tr key={key}>
                                                            <td className='col-2'>
                                                                {obj.category}
                                                            </td>
                                                            <td className="col-4">
                                                                {obj.mainSub}
                                                            </td>
                                                            <td className='col-3'>{obj.name}</td>
                                                            <td className='col-3'>
                                                                <button className='cateActionBtn' onClick={() => {
                                                                    if (window.confirm("Do you want delete " + obj.name)) {
                                                                        adminAxios((server) => {
                                                                            server.put('/admin/deleteSubCategory/' + obj._id, {
                                                                                name: obj.name,
                                                                                category: obj.category,
                                                                                uni_id: obj.uni_id,
                                                                                slug: obj.slug,
                                                                                mainSubSlug: obj.mainSubSlug,
                                                                                mainSub: obj.mainSub
                                                                            }).then((res) => {
                                                                                if (res.data.login) {
                                                                                    logOut()
                                                                                } else {
                                                                                    GetCategories()
                                                                                }
                                                                            }).catch(() => {
                                                                                alert("Sorry We Facing Some Error")
                                                                            })
                                                                        })
                                                                    }
                                                                }}>Delete</button>
                                                            </td>
                                                        </tr>

                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            )
                        }
                    </div>
                ) : <Loading />
            }
        </Fragment>
    )
}

export default CategoriesComp