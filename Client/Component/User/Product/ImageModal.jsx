import React from 'react'
import { useContext } from 'react'
import ContentControl from '../../../ContentControl/ContentControl'

function ImageModal() {
    const { ImgModal, setImgModal } = useContext(ContentControl)
    return (
        <div className='ImageModal'>
            <div className="ImagesDiv">
            <div className='exitDiv'>
                <button className='ExitBtn' onClick={() => {
                    setImgModal({ ...ImgModal, active: false })
                }}>
                    <i className="fa-solid fa-xmark fa-xl"></i>
                </button>
            </div>
                <img src={ImgModal.url} loading="lazy" alt="" />
            </div>
        </div>
    )
}

export default ImageModal