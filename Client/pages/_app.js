import Loading from '@/Component/Loading/Loading';
import Server, { adminCheck, userCheck, vendorCheck } from '@/Config/Server';
import ContentControl from '@/ContentControl/ContentControl';
import '@/styles/global.scss'
import { Router, useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function App({ Component, pageProps }) {

  let router = useRouter()
  // User
  const [LoginModal, setLoginModal] = useState({
    btn: false,
    active: false,
    member: true,
    forgot: false,
  })

  const [QuickVw, setQuickVw] = useState({
    active: false,
    btn: false,
    product: {}
  })

  const [OrderType, setOrderType] = useState({
    order: false,
    type: '',
    exAction: false,
    exActionData: {
      failed: false,
      success: false
    }
  })

  const [userLogged, setUserLogged] = useState({
    status: false
  })

  const [cartTotal, setCartTotal] = useState(0)

  let check = router.pathname.split('/')

  // Vendor

  const [venderLogged, setVendorLogged] = useState({
    status: false
  })

  // Admin

  const [adminLogged, setAdminLogged] = useState({
    status: false
  })

  //Account Manage

  useEffect(() => {
    if (check[1] === 'vendor') {
      // Vendor

      let token = localStorage.getItem('vendorToken')
      vendorCheck(token, (data) => {
        setVendorLogged(data)
        if (data.status) {
          if (check[2] === 'login' || check[2] === 'register') {
            document.body.style.background = 'transparent'
            router.push('/vendor/dashboard')
          }
        }
      })
    } else if (check[1] === "admin") {
      // Admin

      let token = localStorage.getItem('adminToken')
      adminCheck(token, (data) => {
        setAdminLogged(data)
        if (data.status) {
          if (check[2] === 'login') {
            document.body.style.background = 'transparent'
            router.push('/admin/dashboard')
          }
        }
      })
    } else {
      // User

      document.body.style.background = 'white'

      let token = localStorage.getItem('token')
      if (token) {
        userCheck(token, (data) => {
          if (data.status) {
            setUserLogged(data)
            Server.get('/users/getCartTotalPrice', {
              params: {
                userId: data._id
              }
            }).then((total) => {
              setCartTotal(total.data.totalPrice)
            }).catch((err) => {
              console.log("Something Wrong")
            })
          } else {
            setUserLogged({ status: false })
            localStorage.removeItem('token')
          }
        })
      } else {
        setUserLogged({ status: false })
      }
    }
  }, [router.asPath])

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    Router.events.on('routeChangeStart', () => {
      setLoading(true)
    })

    Router.events.on('routeChangeComplete', () => {
      setLoading(false)
    })
  })

  if (loading) {
    return (
      <Loading />
    )
  }

  return (
    <ContentControl.Provider value={
      {
        QuickVw, setQuickVw,
        userLogged, setUserLogged,
        LoginModal, setLoginModal,
        cartTotal, setCartTotal,
        setOrderType, OrderType,
        setVendorLogged, venderLogged,
        setAdminLogged, adminLogged
      }
    }>
      <Component {...pageProps} />
    </ContentControl.Provider>
  )

}
