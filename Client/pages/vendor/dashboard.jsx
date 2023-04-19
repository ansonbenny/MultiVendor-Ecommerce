import Loading from '@/Component/Loading/Loading'
import Server, { vendorAxios } from '@/Config/Server'
import ContentControl from '@/ContentControl/ContentControl'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Fragment, useContext, useEffect, useState } from 'react'
const Header = dynamic(() => import('@/Component/Vendor/Header/Header'))
const DashboardComp = dynamic(() => import('@/Component/Vendor/Dashboard/DashboardComp'))

export default function Dashboard() {
  const { venderLogged, setVendorLogged } = useContext(ContentControl)

  const [response, setResponse] = useState({
    total: {
      totalDelivered: '',
      totalCancelled: '',
      totalReturn: '',
      totalAmount: ''
    },
    Orders: [],
    loaded: false
  })

  const navigate = useRouter()

  useEffect(() => {
    let token = localStorage.getItem('vendorToken')
    if (token) {
      vendorAxios((server) => {
        server.get('/vendor/getDashboard').then((res) => {
          if (res.data.login) {
            setResponse({
              ...response,
              loaded: true
            })
            localStorage.removeItem('vendorToken')
            setVendorLogged({ status: false })
            navigate.push('/vendor/login')
          } else {
            setResponse(res.data)
          }
        }).catch(() => {
          alert("error")
        })
      })
    } else {
      setResponse({
        ...response,
        loaded: true
      })
      navigate.push('/vendor/login')
    }
  }, [venderLogged])
  return (
    <Fragment>
      <Head>
        <title>Aquariun - Vendor Dashboard</title>
        <meta name="description" content="Aquariun Vendor" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className='Vendor'>
        {
          response.loaded ? (
            <>
              <Header />
              <DashboardComp response={response} />
            </>
          ) : <Loading />
        }
      </main>
    </Fragment>
  )
}
