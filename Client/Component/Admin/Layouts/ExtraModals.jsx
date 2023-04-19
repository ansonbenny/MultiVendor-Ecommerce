import React, { Fragment, useRef, useEffect } from 'react'
import { useState } from 'react'
import { adminAxios } from '../../../Config/Server'
import JoditEditor from 'jodit-react';

function ExtraModals({
    activeModal, setActiveModal,
    setSliderOne, setSliderTwo, setBannerPage, logOut
}) {

    let modalRef = useRef()

    const [thumb, setThumb] = useState('')

    const [slider1, setSlider1] = useState({
        title: '',
        content: '',
        subContent: '',
        btnLink: '',
        btn: '',
        image: ''
    })

    const [slider2, setSlider2] = useState({
        image: '',
        link: ''
    })

    const [banner, setBanner] = useState({
        link: '',
        image: ''
    })

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

    function GetLayouts() {
        adminAxios((server) => {
            server.get('/admin/getLayouts').then((layout) => {
                if (layout.data.login) {
                    logOut()
                } else {
                    if (layout.data.sliderOne !== null) {
                        setSliderOne(layout.data.sliderOne)
                    }

                    if (layout.data.sliderTwo !== null) {
                        setSliderTwo(layout.data.sliderTwo)
                    }

                    if (layout.data.banner !== null) {
                        setBannerPage(layout.data.banner)
                    }
                }
            }).catch((err) => {
                console.log('error')
            })
        })
    }

    function slider1Form(e) {
        e.preventDefault();

        var formData = new FormData()
        var uni_id = Date.now() + Math.random()

        formData.append('for', 'sliderOne')
        formData.append('uni_id', uni_id)
        formData.append('details', JSON.stringify({
            title: slider1.title,
            content: slider1.content,
            subContent: slider1.subContent,
            btn: slider1.btn,
            btnLink: slider1.btnLink
        }))
        formData.append('image', slider1.image)

        adminAxios((server) => {
            server.post('/admin/addSlider/', formData, {
                headers: {
                    "Content-type": "multipart/form-data",
                },
            }).then((data) => {
                if (data.data.login) {
                    logOut()
                } else {
                    GetLayouts()

                    setActiveModal({
                        ...activeModal,
                        btn: false,
                        active: false,
                        for: ''
                    })
                }
            }).catch((err) => {
                alert("Sorry Server Has Some Problem")
            })
        })
    }

    function slider2Form(e) {
        e.preventDefault();

        var formData = new FormData()
        var uni_id = Date.now() + Math.random()

        formData.append('for', 'sliderTwo')
        formData.append('uni_id', uni_id)
        formData.append('details', JSON.stringify({
            type: 'banner/slider',
            link: slider2.link
        }))
        formData.append('image', slider2.image)

        adminAxios((server) => {
            server.post('/admin/addSlider/', formData, {
                headers: {
                    "Content-type": "multipart/form-data",
                },
            }).then((data) => {
                if (data.data.login) {
                    logOut()
                } else {
                    GetLayouts()

                    setActiveModal({
                        ...activeModal,
                        btn: false,
                        active: false,
                        for: ''
                    })
                }
            }).catch((err) => {
                alert("Sorry Server Has Some Problem")
            })
        })
    }

    function bannerForm(e) {
        e.preventDefault();

        var formData = new FormData()
        var uni_id = Date.now() + Math.random()

        formData.append('uni_id', uni_id)

        formData.append('link', banner.link)

        formData.append('image', banner.image)

        adminAxios((server) => {
            server.post('/admin/addBanner', formData, {
                headers: {
                    "Content-type": "multipart/form-data",
                },
            }).then((data) => {
                if (data.data.login) {
                    logOut()
                } else {
                    GetLayouts()

                    setActiveModal({
                        ...activeModal,
                        btn: false,
                        active: false,
                        for: ''
                    })
                }
            }).catch((err) => {
                alert("Sorry Server Has Some Problem")
            })
        })
    }

    return (
        <Fragment>
            {
                activeModal.for === "slider" && (
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
                                    <form onSubmit={slider1Form}>
                                        <div className="col-12">
                                            <label htmlFor="">Title</label>
                                            <br />
                                            <input value={slider1.title} onInput={(e) => {
                                                setSlider1({
                                                    ...slider1,
                                                    title: e.target.value
                                                })
                                            }} type="text" required />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="">Button Name</label>
                                            <br />
                                            <input value={slider1.btn} onInput={(e) => {
                                                setSlider1({
                                                    ...slider1,
                                                    btn: e.target.value
                                                })
                                            }} required type="text" />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="">Button Link</label>
                                            <br />
                                            <input value={slider1.btnLink} onInput={(e) => {
                                                setSlider1({
                                                    ...slider1,
                                                    btnLink: e.target.value
                                                })
                                            }} required type="text" />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="">Content</label>
                                            <br />
                                            <div>
                                                <JoditEditor
                                                    value={slider1.content}
                                                    tabIndex={100}
                                                    onBlur={newContent => setSlider1({
                                                        ...slider1,
                                                        content: newContent,
                                                    })}
                                                />
                                            </div>
                                            <br />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="">Sub Content</label>
                                            <br />
                                            <input value={slider1.subContent} onInput={(e) => {
                                                setSlider1({
                                                    ...slider1,
                                                    subContent: e.target.value
                                                })
                                            }} type="text" />
                                        </div>
                                        {
                                            thumb.length !== 0 && (
                                                <div>
                                                    <img src={thumb} className='thumnail' alt="" />
                                                </div>
                                            )
                                        }
                                        <div className="col-12">
                                            <label htmlFor="">Image</label>
                                            <br />
                                            <input onChange={(e) => {
                                                setSlider1({
                                                    ...slider1,
                                                    image: e.target.files[0]
                                                })
                                                setThumb(URL.createObjectURL(e.target.files[0]))
                                            }} type="file" accept='image/*' required />
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
                activeModal.for === "slidertwo" && (
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
                                    <form onSubmit={slider2Form}>
                                        <div className="col-12">
                                            <label htmlFor="">Link</label>
                                            <br />
                                            <input onChange={(e) => {
                                                setSlider2({
                                                    ...slider2,
                                                    link: e.target.value
                                                })
                                            }} type="text" />
                                        </div>
                                        {
                                            thumb.length !== 0 && (
                                                <div>
                                                    <img src={thumb} className='thumnail' alt="" />
                                                </div>
                                            )
                                        }
                                        <div className="col-12">
                                            <label htmlFor="">Image</label>
                                            <br />
                                            <input onChange={(e) => {
                                                setSlider2({
                                                    ...slider2,
                                                    image: e.target.files[0]
                                                })
                                                setThumb(URL.createObjectURL(e.target.files[0]))
                                            }} type="file" accept='image/*' required />
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
                activeModal.for === "banner" && (
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
                                    <form onSubmit={bannerForm}>
                                        <div className="col-12">
                                            <label htmlFor="">Link</label>
                                            <br />
                                            <input onChange={(e) => {
                                                setBanner({
                                                    ...banner,
                                                    link: e.target.value
                                                })
                                            }} type="text" />
                                        </div>
                                        {
                                            thumb.length !== 0 && (
                                                <div>
                                                    <img src={thumb} className='thumnail' alt="" />
                                                </div>
                                            )
                                        }
                                        <div className="col-12">
                                            <label htmlFor="">Image</label>
                                            <br />
                                            <input onChange={(e) => {
                                                setBanner({
                                                    ...banner,
                                                    image: e.target.files[0]
                                                })
                                                setThumb(URL.createObjectURL(e.target.files[0]))
                                            }} type="file" accept='image/*' required />
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

export default ExtraModals