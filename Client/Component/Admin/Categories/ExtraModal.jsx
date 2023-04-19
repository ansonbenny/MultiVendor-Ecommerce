import React, { Fragment } from 'react'
import { useRef } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { adminAxios } from '../../../Config/Server'

function HeaderModal({
    extraModal,
    setExtraModal,
    setCategories,
    setMainSub,
    setSub,
    logOut
}) {
    const [searchResult, setSearch] = useState([])

    const [DataHeader, setDataHeader] = useState({
        cateId: '',
        header: 'false'
    })

    const [mainSubData, setMainSubData] = useState({
        name: ''
    })

    const [subData, setSubData] = useState({
        name: ''
    })

    var modalRef = useRef()

    useEffect(() => {
        if (extraModal.btn === true) {
            setExtraModal({ ...extraModal, btn: false })
        } else {
            window.addEventListener('click', closePopUpBody);
            function closePopUpBody(event) {
                if (!modalRef.current?.contains(event.target)) {
                    setExtraModal({ ...extraModal, active: false, for: '' })
                }
            }
            return () => window.removeEventListener('click', closePopUpBody)
        }
    })

    function GetCategories() {
        adminAxios((server) => {
            server.get('/admin/getAllTypesCategory').then((res) => {
                if (res.data.login) {
                    logOut()
                } else {
                    setCategories(res.data.categories)
                    setMainSub(res.data.mainSub)
                    setSub(res.data.subCategory)
                }
            }).catch((err) => {
                console.log('err')
            })
        })
    }


    function formHeader(e) {
        e.preventDefault()

        adminAxios((server) => {
            server.put('/admin/addHeaderCategory', DataHeader).then((done) => {
                if (done.data.login) {
                    logOut()
                } else {
                    GetCategories()

                    setExtraModal({
                        ...extraModal,
                        btn: false,
                        active: false,
                        for: ''
                    })
                }
            }).catch((err) => {
                alert('Facing An Error')
            })
        })

    }

    function formMainSub(e) {
        e.preventDefault()

        adminAxios((server) => {
            server.put('/admin/addMainSubCategory', mainSubData).then((done) => {
                if (done.data.login) {
                    logOut()
                } else {
                    GetCategories()

                    alert("Added")

                    setExtraModal({
                        ...extraModal,
                        btn: false,
                        active: false,
                        for: ''
                    })
                }
            }).catch((e) => {
                alert("Facing an Error")
            })
        })
    }

    function formSub(e) {
        e.preventDefault()
        adminAxios((server) => {
            server.put('/admin/addSubCategory', subData).then((done) => {
                if (done.data.login) {
                    logOut()
                } else {
                    alert("Added")

                    GetCategories()

                    setExtraModal({
                        ...extraModal,
                        btn: false,
                        active: false,
                        for: ''
                    })
                }

            }).catch(() => {
                alert("Facing An Error")
            })
        })
    }

    return (
        <Fragment>
            {
                extraModal.for === 'header' && (
                    <div className='CategoryModal'>
                        <div className='inner'>
                            <div className="innerMain" ref={modalRef}>
                                <div className='ExitDiv'>
                                    <button onClick={() => {
                                        setExtraModal({
                                            ...extraModal,
                                            btn: false,
                                            active: false,
                                            for: ''
                                        })
                                    }}>CLOSE</button>
                                </div>
                                <div className="row">
                                    <form onSubmit={formHeader}>
                                        <div className="col-12">
                                            <label htmlFor="">Select Category</label>
                                            <br />
                                            <input type="text" onInput={(e) => {
                                                adminAxios((server) => {
                                                    server.get('/admin/searchCategory', {
                                                        params: {
                                                            search: e.target.value
                                                        }
                                                    }).then((data) => {
                                                        if (data.data.login) {
                                                            logOut()
                                                        } else {
                                                            setSearch(data.data)
                                                        }
                                                    }).catch(() => {
                                                        setSearch([])
                                                        console.log("Not Found")
                                                    })
                                                })
                                            }} placeholder='Search Category' name="" id="" />


                                            <select onChange={(e) => {
                                                setDataHeader({
                                                    ...DataHeader,
                                                    cateId: e.target.value
                                                })
                                            }} required>
                                                <option value=" ">Select</option>
                                                {
                                                    searchResult && searchResult.length > 0 ? (
                                                        <>
                                                            {
                                                                searchResult.map((obj, key) => {
                                                                    return (<option value={obj._id} key={key}>{obj.name}</option>)
                                                                })
                                                            }
                                                        </>
                                                    ) : null
                                                }
                                            </select>

                                        </div>
                                        <div className='col-12'>
                                            <label htmlFor="">Header Available</label>
                                            <br />
                                            <select onChange={(e) => {
                                                setDataHeader({
                                                    ...DataHeader,
                                                    header: e.target.value
                                                })
                                            }}>
                                                <option value="false">false</option>
                                                <option value="true">true</option>
                                            </select>
                                        </div>
                                        <div className="col-12">
                                            <button className='submitBnt'>Add</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {
                extraModal.for === 'mainSub' && (
                    <div className='CategoryModal'>
                        <div className='inner'>
                            <div className="innerMain" ref={modalRef}>
                                <div className='ExitDiv'>
                                    <button onClick={() => {
                                        setExtraModal({
                                            ...extraModal,
                                            btn: false,
                                            active: false,
                                            for: ''
                                        })
                                    }}>CLOSE</button>
                                </div>
                                <div className="row">
                                    <form onSubmit={formMainSub}>
                                        <div className="col-12">
                                            <label htmlFor="">Name</label>
                                            <br />
                                            <input value={mainSubData.name} type="text" onInput={(e) => {
                                                setMainSubData({
                                                    ...mainSubData,
                                                    name: e.target.value
                                                })
                                            }} required />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="">Select Category</label>
                                            <br />
                                            <input type="text" onInput={(e) => {
                                                adminAxios((server) => {
                                                    server.get('/admin/searchCategory', {
                                                        params: {
                                                            search: e.target.value
                                                        }
                                                    }).then((data) => {
                                                        if (data.data.login) {
                                                            logOut()
                                                        } else {
                                                            setSearch(data.data)
                                                        }
                                                    }).catch(() => {
                                                        setSearch([])
                                                        console.log("Not Found")
                                                    })
                                                })
                                            }} placeholder='Search Category' name="" id="" />


                                            <select onChange={(e) => {
                                                setMainSubData({
                                                    ...mainSubData,
                                                    main: e.target.value
                                                })
                                            }} required>
                                                <option value="Select">Select</option>
                                                {
                                                    searchResult && searchResult.length > 0 ? (
                                                        <>
                                                            {
                                                                searchResult.map((obj, key) => {
                                                                    return (<option value={JSON.stringify(obj)} key={key}>{obj.name}</option>)
                                                                })
                                                            }
                                                        </>
                                                    ) : null
                                                }
                                            </select>

                                        </div>
                                        <div className="col-12">
                                            <button className='submitBnt'>Add</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {
                extraModal.for === 'sub' && (
                    <div className='CategoryModal'>
                        <div className='inner'>
                            <div className="innerMain" ref={modalRef}>
                                <div className='ExitDiv'>
                                    <button onClick={() => {
                                        setExtraModal({
                                            ...extraModal,
                                            btn: false,
                                            active: false,
                                            for: ''
                                        })
                                    }}>CLOSE</button>
                                </div>
                                <div className="row">
                                    <form onSubmit={formSub}>
                                        <div className="col-12">
                                            <label htmlFor="">Name</label>
                                            <br />
                                            <input value={subData.name} type="text" onInput={(e) => {
                                                setSubData({
                                                    ...subData,
                                                    name: e.target.value
                                                })
                                            }} required />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="">Select Category</label>
                                            <br />
                                            <input type="text" onInput={(e) => {
                                                adminAxios((server) => {
                                                    server.get('/admin/searchMainSubCategory', {
                                                        params: {
                                                            search: e.target.value
                                                        }
                                                    }).then((data) => {
                                                        if (data.data.login) {
                                                            logOut()
                                                        } else {
                                                            setSearch(data.data)
                                                        }
                                                    }).catch(() => {
                                                        setSearch([])
                                                        console.log("Not Found")
                                                    })
                                                })
                                            }} placeholder='Search Main Sub Category' name="" id="" />


                                            <select onChange={(e) => {
                                                setSubData({
                                                    ...subData,
                                                    main: e.target.value
                                                })
                                            }} required>
                                                <option value="Select">Select</option>

                                                {
                                                    searchResult && searchResult.length > 0 ? (
                                                        <>
                                                            {
                                                                searchResult.map((obj, key) => {
                                                                    return (<option value={JSON.stringify(obj)} key={key}>{obj.name}</option>)
                                                                })
                                                            }
                                                        </>
                                                    ) : null
                                                }
                                            </select>

                                        </div>
                                        <div className="col-12">
                                            <button className='submitBnt'>Add</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </Fragment>
    )
}

export default HeaderModal