import Loading from '@/Component/Loading/Loading'
import { adminAxios } from '@/Config/Server'
import ContentControl from '@/ContentControl/ContentControl'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Fragment, useContext, useEffect, useState } from 'react'
const Header = dynamic(() => import('@/Component/Admin/Header/Header'))
const EditOrder = dynamic(() => import('@/Component/Admin/Orders/EditOrder'))

export default function OrderEdit() {
    const router = useRouter()
    const { setAdminLogged } = useContext(ContentControl)

    const { orderId, userId } = router.query

    const [loaded, setLoaded] = useState(false)

    const [Order, setOrder] = useState({
        userId: '',
        proId: '',
        proName: '',
        secretOrderId: '',
        created: '',
        quantity: '',
        price: '',
        mrp: '',
        order_id_shiprocket: '',
        shipment_id: '',
        payId: '',
        OrderStatus: '',
        details: {
            name: "",
            number: "",
            pin: "",
            locality: "",
            address: "",
            city: "",
            state: "",
            payType: "",
            email: ""
        },
        slug: '',
        updated: null
    })

    useEffect(() => {
        if (orderId && userId) {
            adminAxios((server) => {
                server.get('/admin/getOrderSpecific', {
                    params: {
                        orderId: orderId,
                        userId: userId
                    }
                }).then((order) => {
                    if (order.data.login) {
                        setLoaded(true)
                        setAdminLogged({ status: false })
                        localStorage.removeItem('adminToken')
                        router.push('/admin/login')
                    } else {
                        setLoaded(true)
                        setOrder(order.data)
                    }
                }).catch(() => {
                    alert('errr')
                    setLoaded(true)
                    router.push('/admin/orders')
                })
            })
        }
    }, [router.query])

    return (
        <Fragment>
            <Head>
                <title>Aquariun - Admin Edit Order</title>
                <meta name="description" content="Aquariun Admin" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <main className='Admin'>
                {
                    loaded ? (
                        <>
                            <Header />
                            <EditOrder Order={Order} setOrder={setOrder} />
                        </>
                    ) : <Loading />
                }
            </main>
        </Fragment>
    )
}
