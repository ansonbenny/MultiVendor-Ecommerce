import UserIcon from '../../../Assets/UserIcon'
import TruckIcon from '../../../Assets/TruckIcon'
import HeartIcon from '../../../Assets/HeartIcon'
import CartIcon from '../../../Assets/CartIcon'
import LocationIcon from '../../../Assets/LocationIcon'
import EllipsisIcon from '../../../Assets/ellipsisIcon'
import LogoutIcon from '../../../Assets/logoutIcon'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import ContentControl from '../../../ContentControl/ContentControl'
import Modal from './Modal'
import { userAxios } from '@/Config/Server'

function AddressComp({ address, setUpdate }) {
    const [editAddress, setEditAddress] = useState({})
    const { setUserLogged } = useContext(ContentControl)
    const navigate = useRouter()

    return (
        <div className='AddressComp'>
            <Modal Address={editAddress} setUpdate={setUpdate} setUserLogged={setUserLogged} />
            <div className="container container-fluid pt-5 pb-5">

                <div>
                    <div className='pb-4 MobNon'>
                        <h3 className='UserBlackMain font-bold'>My Account</h3>
                    </div>

                    <div className="row">

                        <div className="col-12 col-md-3">
                            <div className="Menu">

                                <div className='BtnDiv'>
                                    <button onClick={() => {
                                        navigate.push('/account')
                                    }}>
                                        <span><UserIcon color={'#333'} /></span>
                                        <span className='span2'>My Details</span>
                                    </button>
                                </div>

                                <div className='BtnDiv'>
                                    <button className='active'>
                                        <span><LocationIcon color={'#ffffff'} /></span>
                                        <span className='span2'>My Address</span>
                                    </button>
                                </div>

                                <div className='BtnDiv'>
                                    <button onClick={() => {
                                        navigate.push('/orders')
                                    }}>
                                        <span><TruckIcon color={'#333'} /></span>
                                        <span className='span2'>My Orders</span>
                                    </button>
                                </div>

                                <div className='BtnDiv'>
                                    <button onClick={() => {
                                        navigate.push('/wishlist')
                                    }}>
                                        <span><HeartIcon color={'#333'} /></span>
                                        <span className='span2'>My Wishlist</span>
                                    </button>
                                </div>

                                <div className='BtnDiv'>
                                    <button onClick={() => {
                                        navigate.push('/cart')
                                    }}>
                                        <span><CartIcon color={'#333'} /></span>
                                        <span className='span2'>My Cart</span>
                                    </button>
                                </div>

                                <div className='BtnDiv'>
                                    <button onClick={() => {
                                        setUserLogged({ status: false })
                                        localStorage.removeItem('token')
                                    }}>
                                        <span><LogoutIcon color={'#333'} /></span>
                                        <span className='span2'>Logout</span>
                                    </button>
                                </div>

                            </div>
                        </div>

                        <div className="col-12 col-md-9">
                            <div className="MainCard">
                                <div className='pb-1'>
                                    <h4 className='UserBlackMain font-bold'>Saved Address</h4>
                                </div>
                                <button data-for="addAddress" type='button'
                                    data-bs-toggle="modal" data-bs-target="#addressModal"
                                    onClick={() => {
                                        setEditAddress({
                                            new: true
                                        })
                                    }}>Add Address</button>

                                <div className="row">
                                    {
                                        address['saved'].map((obj, key) => {
                                            return (
                                                <div className="col-12" key={key}>
                                                    <div className="AddressCard">
                                                        <div className='row'>
                                                            <div className="col-10">
                                                                <div>
                                                                    <h6 className='font-bold text-small'>{obj.name} {obj.number}</h6>
                                                                </div>
                                                                <div>
                                                                    <p className='text-small mb-1'>{obj.address}, {obj.locality}, {obj.city}</p>
                                                                    <p className='text-small mb-1'>{obj.state} - <span className='font-bold' >{obj.pin}</span></p>
                                                                </div>
                                                            </div>
                                                            <div className="col-2">
                                                                <div className="dropdown">
                                                                    <button
                                                                        style={{ background: 'none', border: 'none', outline: 'none', textAlign: 'right', width: '100%' }}
                                                                        type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                                        <EllipsisIcon />
                                                                    </button>
                                                                    <ul className="dropdown-menu">
                                                                        <li><a className="dropdown-item text-small UserBlackMain" type='button'
                                                                            data-bs-toggle="modal" data-bs-target="#addressModal" onClick={() => {
                                                                                setEditAddress(obj)
                                                                            }}>Edit</a></li>
                                                                        <li><a className="dropdown-item text-small UserBlackMain" type='button'
                                                                            onClick={() => {
                                                                                userAxios((server) => {
                                                                                    server.delete('/users/deleteAddress', {
                                                                                        data: {
                                                                                            id: obj.id
                                                                                        }
                                                                                    }).then((res) => {
                                                                                        if (res.data.login) {
                                                                                            setUserLogged({ status: false })
                                                                                            localStorage.removeItem('token')
                                                                                        } else {
                                                                                            setUpdate(update => !update)
                                                                                            alert("Updated")
                                                                                        }
                                                                                    }).catch(() => {
                                                                                        alert("Error")
                                                                                    })
                                                                                })
                                                                            }} >Delete</a></li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }

                                </div>

                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    )
}

export default AddressComp