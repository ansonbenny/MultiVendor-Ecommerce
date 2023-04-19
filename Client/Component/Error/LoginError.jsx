import React from 'react'
import ComputerIcon from '../../Assets/Computer'

function LoginError() {
    return (
        <div className="container container-fluid pt-3 pb-2">
            <div className='text-center'>
                <div className='ErrorSection'>
                    <ComputerIcon />
                    <h5 className='UserGrayMain pt-5'>Please login to vist this page</h5>
                </div>
            </div>
        </div>
    )
}

export default LoginError