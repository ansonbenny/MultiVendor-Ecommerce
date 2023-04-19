import React from 'react'
import { useRef, useState } from 'react'
import { useEffect } from 'react'
import { adminAxios } from '../../../Config/Server'

function MainModal({ mainModal, setMainModal, setCategories, logOut }) {
    const [thumbPrev, setThumbPrev] = useState()
    const [thumb, setThumb] = useState()

    const [category, setCategory] = useState({
        uni_id1: Date.now() + Math.random(),
        name: ''
    })

    var modalRef = useRef()

    useEffect(() => {
        if (mainModal.btn === true) {
            setMainModal({ ...mainModal, btn: false })
        } else {
            window.addEventListener('click', closePopUpBody);
            function closePopUpBody(event) {
                if (!modalRef.current?.contains(event.target)) {
                    setMainModal({ ...mainModal, active: false })
                }
            }
            return () => window.removeEventListener('click', closePopUpBody)
        }
    })

    function formhandler(e) {
        e.preventDefault()

        let formData = new FormData()
        formData.append('uni_id1', category.uni_id1)
        formData.append('uni_id2', Date.now() + Math.random())
        formData.append('name', category.name)
        formData.append('image', thumb)

        adminAxios((server) => {
            server.post('/admin/addCategory', formData, {
                headers: {
                    "Content-type": "multipart/form-data",
                },
            }).then((done) => {
                if (done.data.login) {
                    logOut()
                } else {
                    alert("Added")

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

                        setMainModal({
                            ...mainModal,
                            btn: false,
                            active: false,
                        })
                    })
                }
            }).catch((err) => {
                alert('Facing An Error')
            })
        })

    }

    return (
        <div className='CategoryModal'>
            <div className='inner'>
                <div className="innerMain" ref={modalRef}>
                    <div className='ExitDiv'>
                        <button onClick={() => {
                            setMainModal({
                                ...mainModal,
                                btn: false,
                                active: false,
                            })
                        }}>CLOSE</button>
                    </div>
                    <div className="row">
                        <form onSubmit={formhandler}>
                            <div className="col-12">
                                <label htmlFor="">Name</label>
                                <br />
                                <input value={category.name} type="text" onInput={(e) => {
                                    setCategory({
                                        ...category,
                                        name: e.target.value
                                    })
                                }} required />
                            </div>
                            {
                                thumbPrev && (
                                    <div className='col-12'>
                                        <img className='thumnail' src={thumbPrev} alt="" />
                                    </div>
                                )
                            }
                            <div className="col-12">
                                <label htmlFor="">Image</label>
                                <br />
                                <input type="file" onChange={(e) => {
                                    setThumb(e.target.files[0])
                                    setThumbPrev(URL.createObjectURL(e.target.files[0]))
                                }} accept='image/*' required />
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

export default MainModal