import React from 'react'
import style from './OrderMsg.module.scss'
import Xicon from '../../../Assets/Xicon'
import Link from 'next/link'

function OrderFailed() {
    return (
        <div className={style.OrderFailed + ' pt-4 pb-3'}>
            <div className="container container-fluid">
                <div className={style.RoundBorder}>
                    <Xicon color={'red'} />
                </div>

                <h5>Failed</h5>
                <Link href={'/orders'}>GO TO MY ORDERS</Link>
            </div>
        </div>
    )
}

export default OrderFailed