import React from 'react'
import { useRef } from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { adminAxios } from '../../../Config/Server'

function SectionMadals({
    activeModal, setActiveModal,
    setSectionOneDetails, sectionOneDetails,
    sectionFourDetails, setSectionFourDetails,
    sectionTwoDetails, setSectionTwoDetails,
    sectionThreeDetails, setSectionThreeDetails,
    logOut
}) {

    const [sectionName, setSectionName] = useState('sectionone')

    const [SearchCategory, setSearchCategory] = useState([])

    const [SearchProduct, setSearchProduct] = useState([])
    const [SearchProductR2, setSearchProductR2] = useState([])

    const [sectionOne, setSectionOne] = useState({
        for: 'sectionone',
        title: sectionOneDetails.title,
        subTitle: sectionOneDetails.subTitle,
        items: []
    })

    const [sectionFour, setSectionFour] = useState({
        for: 'sectionfour',
        title: sectionFourDetails.title,
        subTitle: sectionFourDetails.subTitle,
        items: []
    })

    const [sectionTwo, setSectionTwo] = useState({
        for: 'sectiontwo',
        title: sectionTwoDetails.title,
        subTitle: sectionTwoDetails.subTitle,
        items: [],
        items2: []
    })

    const [sectionThree, setSectionThree] = useState({
        for: 'sectionthree',
        title: sectionThreeDetails.title,
        subTitle: sectionThreeDetails.subTitle,
        items: [],
        items2: []
    })

    const [ItemsSectionOne, setItemsSectionOne] = useState([])

    const [ItemsSectionFour, setItemsSectionFour] = useState([])

    const [ItemsSectionTwo, setItemsSectionTwo] = useState([])
    const [Items2SectionTwo, setItems2SectionTwo] = useState([])

    const [ItemsSectionThree, setItemsSectionThree] = useState([])
    const [Items2SectionThree, setItems2SectionThree] = useState([])

    useEffect(() => {
        setItemsSectionOne(sectionOne.items)

        setItemsSectionFour(sectionFour.items)

        setItems2SectionTwo(sectionTwo.items2)
        setItemsSectionTwo(sectionTwo.items)

        setItemsSectionThree(sectionThree.items)
        setItems2SectionThree(sectionThree.items2)
    }, [sectionOne, sectionFour, sectionTwo, sectionThree])

    let modalRef = useRef()

    useEffect(() => {
        if (activeModal.btn === true) {
            setActiveModal({ ...activeModal, btn: false })
        } else {
            window.addEventListener('click', closePopUpBody);
            function closePopUpBody(event) {
                if (!modalRef.current?.contains(event.target)) {
                    setActiveModal({ ...activeModal, active: false, for: '' })
                }
            }
            return () => window.removeEventListener('click', closePopUpBody)
        }
    })

    function GetAllLayouts() {
        adminAxios((server) => {
            server.get('/admin/getLayouts').then((layout) => {
                if (layout.data.login) {
                    logOut()
                } else {
                    setSectionOneDetails(layout.data.sectionone)
                    setSectionFourDetails(layout.data.sectionfour)
                    setSectionTwoDetails(layout.data.sectiontwo)
                    setSectionThreeDetails(layout.data.sectionthree)
                }
            }).catch((err) => {
                console.log('error')
            })
        })
    }

    function formSectionOne(e) {
        e.preventDefault()
        adminAxios((server) => {
            server.post('/admin/addOneRowSection', sectionOne).then((done) => {
                if (done.data.login) {
                    logOut()
                } else {
                    alert("Done")

                    GetAllLayouts()

                    setActiveModal({
                        ...activeModal,
                        btn: false,
                        active: false,
                        for: ''
                    })
                }
            }).catch((err) => {
                alert("We Are Facing Error")
            })
        })
    }

    function formSectionFour(e) {
        e.preventDefault()
        adminAxios((server) => {
            server.post('/admin/addOneRowSection', sectionFour).then((done) => {
                if (done.data.login) {
                    logOut()
                } else {
                    alert("Done")

                    GetAllLayouts()

                    setActiveModal({
                        ...activeModal,
                        btn: false,
                        active: false,
                        for: ''
                    })
                }
            }).catch((err) => {
                alert("We Are Facing Error")
            })
        })
    }

    function formSectionTwo(e) {
        e.preventDefault()
        adminAxios((server) => {
            server.post('/admin/addTwoRowSection', sectionTwo).then((done) => {
                if (done.data.login) {
                    logOut()
                } else {
                    alert("Done")

                    GetAllLayouts()

                    setActiveModal({
                        ...activeModal,
                        btn: false,
                        active: false,
                        for: ''
                    })
                }
            }).catch((err) => {
                alert("We Are Facing Error")
            })
        })
    }

    function formSectionThree(e) {
        e.preventDefault()
        adminAxios((server) => {
            server.post('/admin/addTwoRowSection', sectionThree).then((done) => {
                if (done.data.login) {
                    logOut()
                } else {
                    alert("Done")

                    GetAllLayouts()

                    setActiveModal({
                        ...activeModal,
                        btn: false,
                        active: false,
                        for: ''
                    })
                }
            }).catch((err) => {
                alert("We Are Facing Error")
            })
        })
    }

    return (
        <div className='LayoutModal'>
            <div className='inner'>
                <div className="innerMain" ref={modalRef}>
                    <div className='ExitDiv'>
                        <button onClick={() => {
                            setActiveModal({
                                ...activeModal,
                                btn: false,
                                active: false,
                                for: ''
                            })
                        }}>CLOSE</button>
                    </div>
                    <div className="row">

                        {
                            sectionName === 'sectionone' && (
                                <form onSubmit={formSectionOne}>
                                    <div className="col-12">
                                        <label htmlFor="">Title</label>
                                        <br />
                                        <input value={sectionOne.title}
                                            onInput={(e) => {
                                                setSectionOne({
                                                    ...sectionOne,
                                                    title: e.target.value
                                                })
                                            }} type="text" required />
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="">Sub Title</label>
                                        <br />
                                        <input value={sectionOne.subTitle}
                                            onInput={(e) => {
                                                setSectionOne({
                                                    ...sectionOne,
                                                    subTitle: e.target.value
                                                })
                                            }} type="text" required />
                                    </div>
                                    <div className="col-12">
                                        <label>Select Section</label>
                                        <select value={sectionName} onChange={(e) => {
                                            setSectionName(e.target.value)
                                        }}>
                                            <option value="sectionone">Section One</option>
                                            <option value="sectiontwo">Section Two</option>
                                            <option value="sectionthree">Section Three</option>
                                            <option value="sectionfour">Section Four</option>
                                        </select>
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="">Select Categories</label>
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
                                                        setSearchCategory(data.data)
                                                    }
                                                }).catch((err) => {
                                                    setSearchCategory([])
                                                })
                                            })
                                        }} placeholder='Search Categories' />
                                    </div>
                                    <div className="col-12">
                                        <div className="row">
                                            <div className="col-12 col-lg-6 grayLtBorder pt-4">
                                                <p className='font-bold'>Selected Items</p>

                                                {
                                                    ItemsSectionOne.map((obj, key) => {
                                                        return (
                                                            <div key={key} className="alert UserMainBgGrey">
                                                                <div className="row">
                                                                    <div className="col-8">
                                                                        <h5 className='text-small oneLineTxt'>{obj.name}</h5>
                                                                    </div>
                                                                    <div className="col-4">
                                                                        <Link href={`/c/${obj.slug}`}
                                                                            className="text-small LinkTagNonDec"
                                                                            target='_blank'>View</Link>
                                                                        &nbsp;
                                                                        <a role='button' onClick={() => {
                                                                            var oldData = sectionOne.items
                                                                            oldData = oldData.filter((item, key2) => {
                                                                                return key !== key2
                                                                            })

                                                                            setSectionOne({
                                                                                ...sectionOne,
                                                                                items: oldData
                                                                            })
                                                                        }}
                                                                            className="text-small LinkTagNonDec"
                                                                        >Delete</a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }

                                            </div>

                                            <div className="col-12 col-lg-6 grayLtBorder pt-4">
                                                <p className='font-bold'>Search Result</p>

                                                {
                                                    SearchCategory.map((obj, key) => {
                                                        return (
                                                            <div key={key} className="alert UserMainBgGrey">
                                                                <div className="row">
                                                                    <div className="col-8">
                                                                        <h5 className='text-small oneLineTxt'>{obj.name}</h5>
                                                                    </div>
                                                                    <div className="col-4">
                                                                        <Link href={`/c/${obj.slug}`}
                                                                            className="text-small LinkTagNonDec"
                                                                            target='_blank'>View</Link>
                                                                        &nbsp;
                                                                        <a role='button' onClick={() => {
                                                                            var oldData = sectionOne.items
                                                                            oldData.push(obj)
                                                                            setSectionOne({
                                                                                ...sectionOne,
                                                                                items: oldData
                                                                            })
                                                                        }}
                                                                            className="text-small LinkTagNonDec"
                                                                        >Add</a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }

                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <button className='submitBnt'>Submit</button>
                                    </div>
                                </form>
                            )
                        }

                        {
                            sectionName === 'sectiontwo' && (
                                <form onSubmit={formSectionTwo}>
                                    <div className="col-12">
                                        <label htmlFor="">Title</label>
                                        <br />
                                        <input value={sectionTwo.title}
                                            onInput={(e) => {
                                                setSectionTwo({
                                                    ...sectionTwo,
                                                    title: e.target.value
                                                })
                                            }} type="text" required />
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="">Sub Title</label>
                                        <br />
                                        <input value={sectionTwo.subTitle}
                                            onInput={(e) => {
                                                setSectionTwo({
                                                    ...sectionTwo,
                                                    subTitle: e.target.value
                                                })
                                            }} type="text" required />
                                    </div>
                                    <div className="col-12">
                                        <label>Select Section</label>
                                        <select value={sectionName} onChange={(e) => {
                                            setSectionName(e.target.value)
                                        }}>
                                            <option value="sectionone">Section One</option>
                                            <option value="sectiontwo">Section Two</option>
                                            <option value="sectionthree">Section Three</option>
                                            <option value="sectionfour">Section Four</option>
                                        </select>
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="">Select Product Row 1</label>
                                        <br />
                                        <input type="text" onInput={(e) => {
                                            adminAxios((server) => {
                                                server.get('/admin/searchProductSimple', {
                                                    params: {
                                                        search: e.target.value
                                                    }
                                                }).then((data) => {
                                                    if (data.data.login) {
                                                        logOut()
                                                    } else {
                                                        setSearchProduct(data.data)
                                                    }
                                                }).catch((err) => {
                                                    setSearchProduct([])
                                                })
                                            })
                                        }} placeholder='Search Product' />
                                    </div>
                                    <div className="col-12">
                                        <div className="row">
                                            <div className="col-12 col-lg-6 grayLtBorder pt-4">
                                                <p className='font-bold'>Selected Items Row 1</p>

                                                {
                                                    ItemsSectionTwo.map((obj, key) => {
                                                        return (
                                                            <div key={key} className="alert UserMainBgGrey">
                                                                <div className="row">
                                                                    <div className="col-8">
                                                                        <h5 className='text-small oneLineTxt'>{obj.name}</h5>
                                                                    </div>
                                                                    <div className="col-4">
                                                                        <Link href={`/p/${obj.slug}/${obj._id}`}
                                                                            className="text-small LinkTagNonDec"
                                                                            target='_blank'>View</Link>
                                                                        &nbsp;
                                                                        <a role='button' onClick={() => {
                                                                            var oldData = sectionTwo.items
                                                                            oldData = oldData.filter((item, key2) => {
                                                                                return key !== key2
                                                                            })

                                                                            setSectionTwo({
                                                                                ...sectionTwo,
                                                                                items: oldData
                                                                            })
                                                                        }}
                                                                            className="text-small LinkTagNonDec"
                                                                        >Delete</a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }

                                            </div>

                                            <div className="col-12 col-lg-6 grayLtBorder pt-4">
                                                <p className='font-bold'>Search Result Row 1</p>

                                                {
                                                    SearchProduct.map((obj, key) => {
                                                        return (
                                                            <div key={key} className="alert UserMainBgGrey">
                                                                <div className="row">
                                                                    <div className="col-8">
                                                                        <h5 className='text-small oneLineTxt'>{obj.name}</h5>
                                                                    </div>
                                                                    <div className="col-4">
                                                                        <Link href={`/p/${obj.slug}/${obj._id}`}
                                                                            className="text-small LinkTagNonDec"
                                                                            target='_blank'>View</Link>
                                                                        &nbsp;
                                                                        <a role='button' onClick={() => {
                                                                            var oldData = sectionTwo.items
                                                                            oldData.push(obj)
                                                                            setSectionTwo({
                                                                                ...sectionTwo,
                                                                                items: oldData
                                                                            })
                                                                        }}
                                                                            className="text-small LinkTagNonDec"
                                                                        >Add</a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }

                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-12 pt-2">
                                        <label htmlFor="">Select Product Row 2</label>
                                        <br />
                                        <input type="text" onInput={(e) => {
                                            adminAxios((server) => {
                                                server.get('/admin/searchProductSimple', {
                                                    params: {
                                                        search: e.target.value
                                                    }
                                                }).then((data) => {
                                                    if (data.data.login) {
                                                        logOut()
                                                    } else {
                                                        setSearchProductR2(data.data)
                                                    }
                                                }).catch((err) => {
                                                    setSearchProductR2([])
                                                })
                                            })
                                        }} placeholder='Search Product' />
                                    </div>
                                    <div className="col-12">
                                        <div className="row">
                                            <div className="col-12 col-lg-6 grayLtBorder pt-4">
                                                <p className='font-bold'>Selected Items Row 2</p>

                                                {
                                                    Items2SectionTwo.map((obj, key) => {
                                                        return (
                                                            <div key={key} className="alert UserMainBgGrey">
                                                                <div className="row">
                                                                    <div className="col-8">
                                                                        <h5 className='text-small oneLineTxt'>{obj.name}</h5>
                                                                    </div>
                                                                    <div className="col-4">
                                                                        <Link href={`/p/${obj.slug}/${obj._id}`}
                                                                            className="text-small LinkTagNonDec"
                                                                            target='_blank'>View</Link>
                                                                        &nbsp;
                                                                        <a role='button' onClick={() => {
                                                                            var oldData = sectionTwo.items2
                                                                            oldData = oldData.filter((item, key2) => {
                                                                                return key !== key2
                                                                            })

                                                                            setSectionTwo({
                                                                                ...sectionTwo,
                                                                                items2: oldData
                                                                            })
                                                                        }}
                                                                            className="text-small LinkTagNonDec"
                                                                        >Delete</a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }

                                            </div>

                                            <div className="col-12 col-lg-6 grayLtBorder pt-4">
                                                <p className='font-bold'>Search Result Row 2</p>

                                                {
                                                    SearchProductR2.map((obj, key) => {
                                                        return (
                                                            <div key={key} className="alert UserMainBgGrey">
                                                                <div className="row">
                                                                    <div className="col-8">
                                                                        <h5 className='text-small oneLineTxt'>{obj.name}</h5>
                                                                    </div>
                                                                    <div className="col-4">
                                                                        <Link href={`/p/${obj.slug}/${obj._id}`}
                                                                            className="text-small LinkTagNonDec"
                                                                            target='_blank'>View</Link>
                                                                        &nbsp;
                                                                        <a role='button' onClick={() => {
                                                                            var oldData = sectionTwo.items2
                                                                            oldData.push(obj)
                                                                            setSectionTwo({
                                                                                ...sectionTwo,
                                                                                items2: oldData
                                                                            })
                                                                        }}
                                                                            className="text-small LinkTagNonDec"
                                                                        >Add</a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }

                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <button className='submitBnt'>Submit</button>
                                    </div>
                                </form>
                            )
                        }

                        {
                            sectionName === 'sectionthree' && (
                                <form onSubmit={formSectionThree}>
                                    <div className="col-12">
                                        <label htmlFor="">Title</label>
                                        <br />
                                        <input value={sectionThree.title}
                                            onInput={(e) => {
                                                setSectionThree({
                                                    ...sectionThree,
                                                    title: e.target.value
                                                })
                                            }} type="text" required />
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="">Sub Title</label>
                                        <br />
                                        <input value={sectionThree.subTitle}
                                            onInput={(e) => {
                                                setSectionThree({
                                                    ...sectionThree,
                                                    subTitle: e.target.value
                                                })
                                            }} type="text" required />
                                    </div>
                                    <div className="col-12">
                                        <label>Select Section</label>
                                        <select value={sectionName} onChange={(e) => {
                                            setSectionName(e.target.value)
                                        }}>
                                            <option value="sectionone">Section One</option>
                                            <option value="sectiontwo">Section Two</option>
                                            <option value="sectionthree">Section Three</option>
                                            <option value="sectionfour">Section Four</option>
                                        </select>
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="">Select Product Row 1</label>
                                        <br />
                                        <input type="text" onInput={(e) => {
                                            adminAxios((server) => {
                                                server.get('/admin/searchProductSimple', {
                                                    params: {
                                                        search: e.target.value
                                                    }
                                                }).then((data) => {
                                                    if (data.data.login) {
                                                        logOut()
                                                    } else {
                                                        setSearchProduct(data.data)
                                                    }
                                                }).catch((err) => {
                                                    setSearchProduct([])
                                                })
                                            })
                                        }} placeholder='Search Product' />
                                    </div>
                                    <div className="col-12">
                                        <div className="row">
                                            <div className="col-12 col-lg-6 grayLtBorder pt-4">
                                                <p className='font-bold'>Selected Items Row 1</p>

                                                {
                                                    ItemsSectionThree.map((obj, key) => {
                                                        return (
                                                            <div key={key} className="alert UserMainBgGrey">
                                                                <div className="row">
                                                                    <div className="col-8">
                                                                        <h5 className='text-small oneLineTxt'>{obj.name}</h5>
                                                                    </div>
                                                                    <div className="col-4">
                                                                        <Link href={`/p/${obj.slug}/${obj._id}`}
                                                                            className="text-small LinkTagNonDec"
                                                                            target='_blank'>View</Link>
                                                                        &nbsp;
                                                                        <a role='button' onClick={() => {
                                                                            var oldData = sectionThree.items
                                                                            oldData = oldData.filter((item, key2) => {
                                                                                return key !== key2
                                                                            })

                                                                            setSectionThree({
                                                                                ...sectionThree,
                                                                                items: oldData
                                                                            })
                                                                        }}
                                                                            className="text-small LinkTagNonDec"
                                                                        >Delete</a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }

                                            </div>

                                            <div className="col-12 col-lg-6 grayLtBorder pt-4">
                                                <p className='font-bold'>Search Result Row 1</p>

                                                {
                                                    SearchProduct.map((obj, key) => {
                                                        return (
                                                            <div key={key} className="alert UserMainBgGrey">
                                                                <div className="row">
                                                                    <div className="col-8">
                                                                        <h5 className='text-small oneLineTxt'>{obj.name}</h5>
                                                                    </div>
                                                                    <div className="col-4">
                                                                        <Link href={`/p/${obj.slug}/${obj._id}`}
                                                                            className="text-small LinkTagNonDec"
                                                                            target='_blank'>View</Link>
                                                                        &nbsp;
                                                                        <a role='button' onClick={() => {
                                                                            var oldData = sectionThree.items
                                                                            oldData.push(obj)
                                                                            setSectionThree({
                                                                                ...sectionThree,
                                                                                items: oldData
                                                                            })
                                                                        }}
                                                                            className="text-small LinkTagNonDec"
                                                                        >Add</a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }

                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-12 pt-2">
                                        <label htmlFor="">Select Product Row 2</label>
                                        <br />
                                        <input type="text" onInput={(e) => {
                                            adminAxios((server) => {
                                                server.get('/admin/searchProductSimple', {
                                                    params: {
                                                        search: e.target.value
                                                    }
                                                }).then((data) => {
                                                    if (data.data.login) {
                                                        logOut()
                                                    } else {
                                                        setSearchProductR2(data.data)
                                                    }
                                                }).catch((err) => {
                                                    setSearchProductR2([])
                                                })
                                            })
                                        }} placeholder='Search Product' />
                                    </div>
                                    <div className="col-12">
                                        <div className="row">
                                            <div className="col-12 col-lg-6 grayLtBorder pt-4">
                                                <p className='font-bold'>Selected Items Row 2</p>

                                                {
                                                    Items2SectionThree.map((obj, key) => {
                                                        return (
                                                            <div key={key} className="alert UserMainBgGrey">
                                                                <div className="row">
                                                                    <div className="col-8">
                                                                        <h5 className='text-small oneLineTxt'>{obj.name}</h5>
                                                                    </div>
                                                                    <div className="col-4">
                                                                        <Link href={`/p/${obj.slug}/${obj._id}`}
                                                                            className="text-small LinkTagNonDec"
                                                                            target='_blank'>View</Link>
                                                                        &nbsp;
                                                                        <a role='button' onClick={() => {
                                                                            var oldData = sectionThree.items2
                                                                            oldData = oldData.filter((item, key2) => {
                                                                                return key !== key2
                                                                            })

                                                                            setSectionThree({
                                                                                ...sectionThree,
                                                                                items2: oldData
                                                                            })
                                                                        }}
                                                                            className="text-small LinkTagNonDec"
                                                                        >Delete</a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }

                                            </div>

                                            <div className="col-12 col-lg-6 grayLtBorder pt-4">
                                                <p className='font-bold'>Search Result Row 2</p>

                                                {
                                                    SearchProductR2.map((obj, key) => {
                                                        return (
                                                            <div key={key} className="alert UserMainBgGrey">
                                                                <div className="row">
                                                                    <div className="col-8">
                                                                        <h5 className='text-small oneLineTxt'>{obj.name}</h5>
                                                                    </div>
                                                                    <div className="col-4">
                                                                        <Link href={`/p/${obj.slug}/${obj._id}`}
                                                                            className="text-small LinkTagNonDec"
                                                                            target='_blank'>View</Link>
                                                                        &nbsp;
                                                                        <a role='button' onClick={() => {
                                                                            var oldData = sectionThree.items2
                                                                            oldData.push(obj)
                                                                            setSectionThree({
                                                                                ...sectionThree,
                                                                                items2: oldData
                                                                            })
                                                                        }}
                                                                            className="text-small LinkTagNonDec"
                                                                        >Add</a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }

                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <button className='submitBnt'>Submit</button>
                                    </div>
                                </form>
                            )
                        }

                        {
                            sectionName === 'sectionfour' && (
                                <form onSubmit={formSectionFour}>
                                    <div className="col-12">
                                        <label htmlFor="">Title</label>
                                        <br />
                                        <input value={sectionFour.title}
                                            onInput={(e) => {
                                                setSectionFour({
                                                    ...sectionFour,
                                                    title: e.target.value
                                                })
                                            }} type="text" required />
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="">Sub Title</label>
                                        <br />
                                        <input value={sectionFour.subTitle}
                                            onInput={(e) => {
                                                setSectionFour({
                                                    ...sectionFour,
                                                    subTitle: e.target.value
                                                })
                                            }} type="text" required />
                                    </div>
                                    <div className="col-12">
                                        <label>Select Section</label>
                                        <select value={sectionName} onChange={(e) => {
                                            setSectionName(e.target.value)
                                        }}>
                                            <option value="sectionone">Section One</option>
                                            <option value="sectiontwo">Section Two</option>
                                            <option value="sectionthree">Section Three</option>
                                            <option value="sectionfour">Section Four</option>
                                        </select>
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="">Select Product</label>
                                        <br />
                                        <input type="text" onInput={(e) => {
                                            adminAxios((server) => {
                                                server.get('/admin/searchProductSimple', {
                                                    params: {
                                                        search: e.target.value
                                                    }
                                                }).then((data) => {
                                                    if (data.data.login) {
                                                        logOut()
                                                    } else {
                                                        setSearchProduct(data.data)
                                                    }
                                                }).catch((err) => {
                                                    setSearchProduct([])
                                                })
                                            })
                                        }} placeholder='Search Product' />
                                    </div>
                                    <div className="col-12">
                                        <div className="row">
                                            <div className="col-12 col-lg-6 grayLtBorder pt-4">
                                                <p className='font-bold'>Selected Items</p>

                                                {
                                                    ItemsSectionFour.map((obj, key) => {
                                                        return (
                                                            <div key={key} className="alert UserMainBgGrey">
                                                                <div className="row">
                                                                    <div className="col-8">
                                                                        <h5 className='text-small oneLineTxt'>{obj.name}</h5>
                                                                    </div>
                                                                    <div className="col-4">
                                                                        <Link href={`/p/${obj.slug}/${obj._id}`}
                                                                            className="text-small LinkTagNonDec"
                                                                            target='_blank'>View</Link>
                                                                        &nbsp;
                                                                        <a role='button' onClick={() => {
                                                                            var oldData = sectionFour.items
                                                                            oldData = oldData.filter((item, key2) => {
                                                                                return key !== key2
                                                                            })

                                                                            setSectionFour({
                                                                                ...sectionFour,
                                                                                items: oldData
                                                                            })
                                                                        }}
                                                                            className="text-small LinkTagNonDec"
                                                                        >Delete</a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }

                                            </div>

                                            <div className="col-12 col-lg-6 grayLtBorder pt-4">
                                                <p className='font-bold'>Search Result</p>

                                                {
                                                    SearchProduct.map((obj, key) => {
                                                        return (
                                                            <div key={key} className="alert UserMainBgGrey">
                                                                <div className="row">
                                                                    <div className="col-8">
                                                                        <h5 className='text-small oneLineTxt'>{obj.name}</h5>
                                                                    </div>
                                                                    <div className="col-4">
                                                                        <Link href={`/p/${obj.slug}/${obj._id}`}
                                                                            className="text-small LinkTagNonDec"
                                                                            target='_blank'>View</Link>
                                                                        &nbsp;
                                                                        <a role='button' onClick={() => {
                                                                            var oldData = sectionFour.items
                                                                            oldData.push(obj)
                                                                            setSectionFour({
                                                                                ...sectionFour,
                                                                                items: oldData
                                                                            })
                                                                        }}
                                                                            className="text-small LinkTagNonDec"
                                                                        >Add</a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }

                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <button className='submitBnt'>Submit</button>
                                    </div>
                                </form>
                            )
                        }

                    </div>
                </div>
            </div>
        </div>
    )
}

export default SectionMadals