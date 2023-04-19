import Loading from '@/Component/Loading/Loading'
import { vendorAxios } from '@/Config/Server'
import ContentControl from '@/ContentControl/ContentControl'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Fragment, useContext, useEffect, useState } from 'react'
const Header = dynamic(() => import('@/Component/Vendor/Header/Header'))
const OrderDetails = dynamic(() => import('@/Component/Vendor/Orders/OrderDetails'))

export default function Order() {
    const { setVendorLogged } = useContext(ContentControl)
    const [loaded, setLoaded] = useState(false)
    const [Order, setOrder] = useState({})
    const navigate = useRouter()

    useEffect(() => {
        let token = localStorage.getItem('vendorToken')

        if (token) {
            if (navigate.query.orderId && navigate.query.userId) {
                vendorAxios((server) => {
                    server.get('/vendor/getOrderSpecific', {
                        params: {
                            orderId: navigate.query.orderId,
                            userId: navigate.query.userId
                        }
                    }).then((order) => {
                        if (order.data.login) {
                            setLoaded(true)
                            setVendorLogged({ status: false })
                            localStorage.removeItem('vendorToken')
                            navigate.push('/vendor/login')
                        } else {
                            setLoaded(true)
                            setOrder(order.data)
                        }
                    }).catch((err) => {
                        alert('err')
                        setLoaded(true)
                        navigate.push('/vendor/orders')
                    })
                })
            }
        } else {
            setLoaded(true)
            navigate.push('/vendor/login')
        }

    }, [navigate.query])
    return (
        <Fragment>
            <Head>
                <title>Aquariun - Vendor Order Details</title>
                <meta name="description" content="Aquariun Vendor" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <main className='Vendor'>
                {
                    loaded ? (
                        <>
                            <Header />
                            <OrderDetails Order={Order} />
                        </>
                    ) : <Loading />
                }
            </main>
        </Fragment>
    )
}
