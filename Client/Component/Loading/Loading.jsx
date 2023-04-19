import React from 'react'
import style from './Loading.module.scss'

function Loading() {
    return (
        <div className={style.loadingScreen}>
            <div className={style.center}>
                <div className="text-center">
                    <button className={style.spineer}></button>
                </div>
            </div>
        </div>
    )
}

export default Loading