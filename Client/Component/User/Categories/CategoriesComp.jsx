import { useEffect } from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { ServerId } from '../../../Config/Server'
import ComputerIcon from '../../../Assets/Computer'
import style from './Categories.module.scss'

function CategoriesComp({ categories }) {
    const [width, setWidth] = useState(500)

    useEffect(() => {
        setWidth(window.innerWidth)
    }, [])

    useEffect(() => {
        window.addEventListener('resize', () => {
            setWidth(window.innerWidth)
        })
    })

    return (
        <div className={style.CategoriesCompUserMob + ' container container-fluid pt-3 pb-2'} >
            {
                width <= 767 ? (

                    <>
                        {
                            categories === null || categories === undefined || categories.length === 0 ? (
                                <>
                                    <h1 className='UserBlackMain font-bold text-center pt-2'>!</h1>
                                    <h2 className='UserBlackMain font-bold text-center pb-2'>Categories Not Found</h2>
                                </>
                            ) : (
                                <div className='row'>
                                    {
                                        categories.map((obj, key) => {
                                            return (
                                                <div className="col-6 mb-2" key={key}>
                                                    <Link className='LinkTagNonDec' href={`/c/${obj.slug}`}>
                                                        <div className={style.CardMob}>

                                                            <div className={style.ImgDiv}>
                                                                <img src={`${ServerId}/category/${obj.uni_id1}${obj.uni_id2}/${obj.file.filename}`} alt="" />
                                                            </div>

                                                            <div className={style.textArea}>
                                                                <h6
                                                                    className='text-center oneLineTxt UserBlackMain2nd text-small font-bold'>
                                                                    {obj.name}
                                                                </h6>
                                                            </div>

                                                        </div>
                                                    </Link>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            )
                        }
                    </>

                ) : (
                    <div className='text-center'>
                        <div className={style.ErrorSection}>
                            <ComputerIcon />
                            <h5 className='UserGrayMain pt-5'>We're sorry, but the page is only for mobile users.</h5>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default CategoriesComp