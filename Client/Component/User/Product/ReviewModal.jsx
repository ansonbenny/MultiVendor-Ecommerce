import { useRef, useContext, useEffect } from 'react'
import { userAxios } from '../../../Config/Server'
import ContentControl from '../../../ContentControl/ContentControl'
import { useState } from 'react'

function ReviewModal({ setReviewModal, showReviewModal, proId, getReviews }) {

    let { setUserLogged } = useContext(ContentControl)

    const [formData, setFormData] = useState({
        proId: proId,
        title: '',
        review: '',
        stars: 'five',
        starInNum: 5
    })

    let modalRef = useRef(null)

    let oneStar = useRef()
    let twoStar = useRef()
    let threeStar = useRef()
    let fourStar = useRef()
    let fiveStar = useRef()

    function changeStarColors(one, two, three, four, five) {
        oneStar.current.style.color = one
        twoStar.current.style.color = two
        threeStar.current.style.color = three
        fourStar.current.style.color = four
        fiveStar.current.style.color = five
    }

    function formHandle(e) {
        e.preventDefault()
        userAxios((server) => {
            server.post('/users/addReview', formData).then((res) => {
                if (res.data.login) {
                    setUserLogged({ status: false })
                    localStorage.removeItem('token')
                    setReviewModal({ ...showReviewModal, active: false })
                    alert('Please Login')
                } else {
                    getReviews()
                    alert('Review Added')
                    setReviewModal({ ...showReviewModal, active: false })
                }
            }).catch(() => {
                alert('Error')
            })
        })
    }

    useEffect(() => {
        if (showReviewModal.btn === true) {
            setReviewModal({ ...showReviewModal, btn: false })
        } else {
            window.addEventListener('click', closePopUpBody);
            function closePopUpBody(event) {
                if (!modalRef.current?.contains(event.target)) {
                    setReviewModal({ ...showReviewModal, active: false })
                }
            }
            return () => window.removeEventListener('click', closePopUpBody)
        }
    })

    return (
        <div className="ReviewModal">
            <div className="Item" ref={modalRef} >
                <div className="Main">
                    <div className="ExitBtn">
                        <button type="button" onClick={() => {
                            setReviewModal({
                                ...showReviewModal,
                                active: false
                            })
                        }}>
                            <i className='fa-solid fa-x'></i>
                        </button>
                    </div>

                    <form onSubmit={formHandle}>
                        <div className="stars">
                            <button ref={oneStar} onClick={() => {
                                setFormData({
                                    ...formData,
                                    stars: 'one',
                                    starInNum: 1
                                })
                                changeStarColors('#ff9800', '#333', '#333', '#333', '#333')
                            }} type='button' ><span className='fa fa-star'></span></button>
                            <button ref={twoStar} onClick={() => {
                                setFormData({
                                    ...formData,
                                    stars: 'two',
                                    starInNum: 2
                                })
                                changeStarColors('#ff9800', '#ff9800', '#333', '#333', '#333')
                            }} type='button' ><span className='fa fa-star'></span></button>
                            <button ref={threeStar} onClick={() => {
                                setFormData({
                                    ...formData,
                                    stars: 'three',
                                    starInNum: 3
                                })
                                changeStarColors('#ff9800', '#ff9800', '#ff9800', '#333', '#333')
                            }} type='button' ><span className='fa fa-star'></span></button>
                            <button ref={fourStar} onClick={() => {
                                setFormData({
                                    ...formData,
                                    stars: 'four',
                                    starInNum: 4
                                })
                                changeStarColors('#ff9800', '#ff9800', '#ff9800', '#ff9800', '#333')
                            }} type='button' ><span className='fa fa-star'></span></button>

                            <button ref={fiveStar} onClick={() => {
                                setFormData({
                                    ...formData,
                                    stars: 'five',
                                    starInNum: 5
                                })
                                changeStarColors('#ff9800', '#ff9800', '#ff9800', '#ff9800', '#ff9800')
                            }} type='button' ><span className='fa fa-star'></span></button>
                        </div>

                        <div className='content'>
                            <input type="text" value={formData.title} onInput={(e) => {
                                setFormData({
                                    ...formData,
                                    title: e.target.value
                                })
                            }} placeholder='Enter Review Heading' required />
                            <textarea cols="30" rows="10" placeholder='Enter Review' value={formData.review} onInput={(e) => {
                                setFormData({
                                    ...formData,
                                    review: e.target.value
                                })
                            }} required></textarea>
                        </div>

                        <button type='submit' className='submit'>
                            post review
                        </button>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default ReviewModal