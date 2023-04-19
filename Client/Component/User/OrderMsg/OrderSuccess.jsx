import React from 'react'
import style from './OrderMsg.module.scss'
import TickIcon from '../../../Assets/TickIcon'
import Link from 'next/link'

function OrderSuccess() {
    return (
        <div className={style.OrderSuccess + ' pt-4 pb-3'}>
            <div className="container container-fluid">
                <div className={style.RoundBorder}>
                    <TickIcon color={'#22cc9d'} />
                </div>

                <h5>Success</h5>
                <Link href={'/orders'}>GO TO MY ORDERS</Link>
            </div>
        </div>
    )
}

export default OrderSuccess