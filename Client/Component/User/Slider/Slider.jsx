import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from "swiper";
import { ServerId } from '@/Config/Server';
import style from './Slider.module.scss'

function Slider({ layout }) {

    const { sliderOne } = layout

    return (
        <div className={style.UserSlider}>
            <div className='container'>
                <Swiper
                    autoplay={{
                        delay: 10000,
                        disableOnInteraction: false,
                    }}
                    modules={[Autoplay]}
                    slidesPerView={1}
                    spaceBetween={10}
                >

                    {
                        sliderOne['items'].map((obj, key) => {
                            return (
                                <SwiperSlide key={key}>
                                    <div>
                                        <div className={style.SlideImgDiv} style={{ background: `url(${ServerId}/${sliderOne.for}/${obj.uni_id}/${obj.file.filename})`, backgroundRepeat: 'no-repeat', backgroundSize: 'contain', backgroundPosition: 'center' }}>
                                            <div className={style.SlideTextDiv}>
                                                <div>
                                                    <h5 className={style.SlideSmallText}>{obj.title}</h5>
                                                    <div className={style.SlideMainText} dangerouslySetInnerHTML={{ __html: obj.content }}>
                                                    </div>
                                                    <h6>{obj.subContent}</h6>
                                                    <button onClick={() => {
                                                        window.open(obj.btnLink, '_blank')
                                                    }} className={style.shopNowBtn}>{obj.btn}</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            )
                        })
                    }

                </Swiper>

            </div>
        </div>
    )
}

export default Slider

