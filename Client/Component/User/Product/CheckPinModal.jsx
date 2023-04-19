import React from 'react'
import { useState } from 'react'
import Server from '../../../Config/Server'

function CheckPinModal() {
    const [pin, setPin] = useState('')
    function formHandle(e) {
        e.preventDefault()
        if (pin.length !== 6) {
            alert("Pin Code Must Six Digit")
        } else {
            Server.post('/users/checkPincode',{
                pin : pin
            }).then((data)=>{
                if(data.data){
                    alert('Delivery Available On Your Selected Pin Code')
                }else{
                    alert('Delivery Not Available On Your Selected Pin Code')
                }
            }).catch(()=>{
                alert("Facing an error")
            })
        }
    }
    return (
        <div className="modal fade" id="checkPinModal" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-body">
                        <div className='ExitBtn'>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        <form onSubmit={formHandle}>
                            <div>
                                <input type="number" value={pin} onInput={(e) => {
                                    setPin(e.target.value)
                                }} placeholder='Enter Pin Code' required />
                            </div>
                            <div>
                                <button btn-type="submit" type='submit'>check</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CheckPinModal