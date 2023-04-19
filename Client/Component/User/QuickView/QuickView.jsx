import React from 'react'
import { useContext } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import ContentControl from '../../../ContentControl/ContentControl'
import { ServerId } from '../../../Config/Server'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Thumbs } from 'swiper'
import { useState } from 'react'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useRouter } from 'next/router'

function QuickView() {
    const { setQuickVw, QuickVw } = useContext(ContentControl)

    const [images, setImages] = useState([])

    useEffect(() => {
       if(Array.isArray(QuickVw.product.files)){
        setImages(QuickVw.product.files)
       }
    }, [QuickVw.product.files])

    const [thumbsSwiper, setThumbsSwiper] = useState(null)

    var modalRef = useRef()

    const [magnifier, setMagnifier] = useState(false)
    const [[x, y], setXY] = useState([0, 0]);
    const [[imgWidth, imgHeight], setSize] = useState([0, 0]);

    var magnifierHeight = 150
    var magnifieWidth = 150
    var zoomLevel = 2

    const navigate = useRouter()

    useEffect(() => {
        if (QuickVw.btn === true) {
            setQuickVw({ ...QuickVw, btn: false })
        } else {
            window.addEventListener('click', closePopUpBody);
            function closePopUpBody(event) {
                if (!modalRef.current?.contains(event.target)) {
                    setQuickVw({ ...QuickView, active: false })
                }
            }
            return () => window.removeEventListener('click', closePopUpBody)
        }
    })

    const [windowSize, setWindowSize] = useState({ windowWidth: window.innerWidth });

    useEffect(() => {
        function handleWindowResize(e) {
            setWindowSize({ windowWidth: parseInt(window.innerWidth) });
        }

        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    });

    return (
        <div className='QuickView'>
            <div className='Item' ref={modalRef}>
                <div>
                    <button className='ExitBtn' onClick={() => {
                        setQuickVw({ ...QuickVw, active: false })
                    }}><i className="fa-solid fa-xmark fa-xl"></i></button>
                </div>

                <div className="Main">
                    <div className="Product">
                        <div className="leftDiv">

                            <div className="row">
                                <div className="col-12">

                                    <Swiper
                                        modules={[Thumbs]}
                                        grabCursor={true}
                                        loop={false}
                                        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }} >
                                        {
                                            images.map((item, key) => {
                                                return (
                                                    <SwiperSlide key={key} className="QuickMainImgDiv">
                                                        <img className='QuickMainImgs' src={ServerId + '/product/' + QuickVw.product.uni_id_1 + QuickVw.product.uni_id_2 + '/' + item.filename} alt={QuickVw.product.name} loading='lazy' onMouseEnter={(e) => {
                                                            if (windowSize.windowWidth > 500) {

                                                                setMagnifier(true)
                                                            } else {
                                                                setMagnifier(false)
                                                            }

                                                            const elem = e.currentTarget;
                                                            const { width, height } = elem.getBoundingClientRect();
                                                            setSize([width, height]);
                                                        }} onMouseMove={(e) => {
                                                            // update cursor position
                                                            const elem = e.currentTarget;
                                                            const { top, left } = elem.getBoundingClientRect();

                                                            // calculate cursor position on the image
                                                            const x = e.pageX - left - window.pageXOffset;
                                                            const y = e.pageY - top - window.pageYOffset;
                                                            setXY([x, y]);
                                                        }}

                                                            onMouseLeave={() => {
                                                                setMagnifier(false)
                                                            }} />

                                                        <div style={{
                                                            display: magnifier ? 'block' : 'none', position: "absolute",

                                                            // prevent magnifier blocks the mousemove event of img
                                                            pointerEvents: "none",
                                                            // set size of magnifier
                                                            height: `${magnifierHeight}px`,
                                                            width: `${magnifieWidth}px`,
                                                            // move element center to cursor pos
                                                            top: `${y - magnifierHeight / 2}px`,
                                                            left: `${x - magnifieWidth / 2}px`,
                                                            opacity: "1", // reduce opacity so you can verify position
                                                            backgroundColor: "white",
                                                            backgroundImage: `url(${ServerId}/product/${QuickVw.product.uni_id_1}${QuickVw.product.uni_id_2}/${item.filename})`,
                                                            backgroundRepeat: "no-repeat",

                                                            //calculate zoomed image size
                                                            backgroundSize: `${imgWidth * zoomLevel}px ${imgHeight * zoomLevel
                                                                }px`,

                                                            //calculate position of zoomed image.
                                                            backgroundPositionX: `${-x * zoomLevel + magnifieWidth / 2}px`,
                                                            backgroundPositionY: `${-y * zoomLevel + magnifierHeight / 2}px`
                                                        }} alt="" >
                                                        </div>
                                                    </SwiperSlide>
                                                )
                                            })
                                        }
                                    </Swiper>

                                    <Swiper
                                        modules={[Thumbs]}
                                        watchSlidesProgress
                                        slidesPerView={4}
                                        onSwiper={setThumbsSwiper}
                                        loop={false}
                                        className="QuickContainer"
                                    >
                                        {
                                            images.map((item, key) => {
                                                return (
                                                    <SwiperSlide key={key} className="QuickImgThumbDiv">
                                                        <img className='QuickImgThumb' src={ServerId + '/product/' + QuickVw.product.uni_id_1 + QuickVw.product.uni_id_2 + '/' + item.filename} alt={QuickVw.product.name} />
                                                    </SwiperSlide>
                                                )
                                            })
                                        }
                                    </Swiper>

                                </div>
                            </div>

                        </div>
                        <div className="rightDiv">
                            <h3 className='font-bolder UserBlackMain'><small>{QuickVw.product.name}</small></h3>
                            <h5 className='font-bolder pt-1'><small className='UserGrayMain'><del>₹{QuickVw.product.mrp}</del></small>
                                &nbsp;&nbsp;₹{QuickVw.product.price}</h5>
                            <div className="pt-2 pb-2" style={{ color: '#777' }} dangerouslySetInnerHTML={{ __html: QuickVw.product.srtDescription }}></div>

                            <h6 className='UserBlackMain'><span className='UserGrayMain font-normal text-small' >AVAILABILITY:</span>
                                &nbsp;
                                {
                                    QuickVw.product.available === "true" ? (
                                        <span className='font-bold'>AVAILABLE</span>
                                    ) : (
                                        <span className='font-bold'>OUT OF STOCK</span>
                                    )
                                }
                            </h6>
                            <h6 className='UserBlackMain'><span className='UserGrayMain font-normal text-small' >CATEGORY:</span>
                                &nbsp;<span className='font-bolder'>{QuickVw.product.category}</span></h6>

                            <div>
                                <button onClick={() => {
                                    navigate.push(`/p/${QuickVw.product.slug}/${QuickVw.product._id}`)
                                    setQuickVw({ ...QuickVw, active: false })
                                }} className='ShowMoreBtn'>SHOW MORE</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default QuickView