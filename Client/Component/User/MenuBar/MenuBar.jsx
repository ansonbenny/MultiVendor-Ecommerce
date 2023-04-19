import React from 'react'
import { useEffect, useContext } from 'react'
import { useRef } from 'react'
import Link from 'next/link'
import ContentControl from '../../../ContentControl/ContentControl'

function MenuBar({ menuBar, setMenuBar }) {
  const { userLogged, setUserLogged,
    LoginModal, setLoginModal } = useContext(ContentControl)

  var headerCategories = menuBar.categories

  var modalRef = useRef()
  useEffect(() => {
    if (menuBar.btn === true) {
      setMenuBar({ ...menuBar, btn: false })
    } else {
      window.addEventListener('click', closePopUpBody);
      function closePopUpBody(event) {
        if (!modalRef.current?.contains(event.target)) {
          setMenuBar({ ...menuBar, active: false })
        }
      }
      return () => window.removeEventListener('click', closePopUpBody)
    }
  })

  return (
    <div className='MenuBar' ref={modalRef}>
      <div className='MenuContainer'>

        <div className='loginDiv'>
          <div>
            <i className="fa-solid fa-user color-white"></i>
          </div>
          <div>
            {
              userLogged.status ? (
                <a>{userLogged.name}</a>
              ) : (
                <a role='button'>
                  <span onClick={() => {
                    setMenuBar({
                      ...menuBar,
                      active: false,
                      btn: false
                    })

                    setLoginModal({
                      ...LoginModal,
                      member: true,
                      forgot: false,
                      btn: true,
                      active: true
                    })
                  }}>Login</span> / <span onClick={() => {
                    setMenuBar({
                      ...menuBar,
                      active: false,
                      btn: false
                    })

                    setLoginModal({
                      ...LoginModal,
                      member: false,
                      btn: true,
                      active: true
                    })
                  }}>Sign Up</span>
                </a>
              )
            }
          </div>
        </div>

        <div className='sectionOne'>
          <ul>
            <li>
              <i className="fa-solid fa-border-all UserBlackMain Icons"></i>
              <Link href={'/categories'} className='text-small font-bold'>All Categories</Link>
            </li>
            <li><h6 className='UserBlackMain font-bold'>
              <span><i className="fa-solid fa-arrow-trend-up UserBlackMain Icons"></i></span>
              <span className='text-small'>Trending Categories</span>
            </h6></li>
            {
              headerCategories.map((obj, key) => {
                return (
                  <li className='ExtraPad' key={key}>
                    <Link href={`/c/${obj.slug}`} className='text-small font-bold'>{obj.name}</Link>
                  </li>
                )
              })
            }

          </ul>
        </div>

        <div className='sectionLast'>
          <ul>
            <li>
              <i className="fa-solid fa-user UserBlackMain Icons"></i>
              <a className='text-small font-bold'>Account Details</a>
            </li>
            <li className='ExtraPad'><Link href={'/account'} className='text-small font-bold'>My Account</Link></li>
            <li className='ExtraPad'><Link href={'/wishlist'} className='text-small font-bold'>My Wishlist</Link></li>
            <li className='ExtraPad'><Link href={'/cart'} className='text-small font-bold'>My Cart</Link></li>
            <li className='ExtraPad'><Link href={'/orders'} className='text-small font-bold'>My Orders</Link></li>
            {
              userLogged.status && (
                <li className='ExtraPad'><a role='button' className='text-small font-bold' onClick={() => {
                  localStorage.removeItem('token')
                  setUserLogged({ status: false })
                }}>Logout</a></li>
              )
            }
            <li className='ExtraPad'><Link href='' className='text-small font-bold'>Help</Link></li>
          </ul>
        </div>

      </div>
    </div>
  )
}

export default MenuBar