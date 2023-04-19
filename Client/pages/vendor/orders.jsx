import Loading from '@/Component/Loading/Loading'
import { vendorAxios } from '@/Config/Server'
import ContentControl from '@/ContentControl/ContentControl'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Fragment, useContext, useEffect, useState } from 'react'
const Header = dynamic(() => import('@/Component/Vendor/Header/Header'))
const OrdersComp = dynamic(() => import('@/Component/Vendor/Orders/OrdersComp'))

export default function Orders() {
    const { setVendorLogged } = useContext(ContentControl)
    const [loaded, setLoaded] = useState(false)
    const [search, setSearch] = useState('')
    const [Orders, setOrders] = useState([])
    const [total, setTotal] = useState(0)
    const navigate = useRouter()

    useEffect(() => {
        let token = localStorage.getItem('vendorToken')

        if (token) {
            vendorAxios((server) => {
                server.get('/vendor/getAllOrders', {
                    params: {
                        search: search,
                        skip: 0,
                    }
                }).then((res) => {
                    if (res.data.login) {
                        setLoaded(true)
                        setVendorLogged({ status: false })
                        localStorage.removeItem('vendorToken')
                        navigate.push('/vendor/login')
                    } else {
                        setOrders(res.data.orders)
                        setTotal(res.data.total)
                        setLoaded(true)
                    }
                }).catch(() => {
                    console.log('err')
                    setLoaded(true)
                })
            })
        } else {
            setLoaded(true)
            navigate.push('/vendor/login')
        }

    }, [search])
    return (
        <Fragment>
            <Head>
                <title>Aquariun - Vendor Orders</title>
                <meta name="description" content="Aquariun Vendor" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <main className='Vendor'>
                {
                    loaded ? (
                        <>
                            <Header />
                            <OrdersComp search={search} setSearch={setSearch}
                                Orders={Orders} setOrders={setOrders}
                                setTotal={setTotal} total={total} />
                        </>
                    ) : <Loading />
                }
            </main>
        </Fragment>
    )
}
