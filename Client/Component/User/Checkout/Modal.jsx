import React from 'react'
import Xicon from '@/Assets/Xicon'

function Modal({ setOrderDetails, savedAddress }) {
    return (
        <div class="modal fade" id="addressModal" tabIndex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-body">
                        <div style={{ textAlign: 'right' }} className="pb-2" >
                            <button type="button" data-for="exit" data-bs-dismiss="modal">
                                <Xicon color={'#333'} />
                            </button>
                        </div>

                        {
                            savedAddress['saved'].map((obj, key) => {
                                return (
                                    <div className="AddressCard" key={key}>
                                        <div className='row'>
                                            <div className="col-md-8 col-7">
                                                <div>
                                                    <h6 className='font-bold text-small'>{obj.name} {obj.number}</h6>
                                                </div>
                                                <div>
                                                    <p className='text-small mb-1'>{obj.address}, {obj.locality}, {obj.city}</p>
                                                    <p className='text-small mb-1'>{obj.state} - <span className='font-bold' >{obj.pin}</span></p>
                                                </div>
                                            </div>
                                            <div className="col-md-4 col-5" style={{ textAlign: 'right' }}>
                                                <div className="row">
                                                    <div className="col-12">
                                                        <button type='button' data-for="select"
                                                            onClick={() => {
                                                                setOrderDetails(orderDetails => ({
                                                                    ...orderDetails,
                                                                    name: obj.name,
                                                                    number: obj.number,
                                                                    pin: obj.pin,
                                                                    locality: obj.locality,
                                                                    address: obj.address,
                                                                    city: obj.city,
                                                                    state: obj.state
                                                                }))

                                                                alert("Selected")
                                                            }} >Select</button>
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
        </div >
    )
}

export default Modal