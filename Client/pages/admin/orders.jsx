import dynamic from 'next/dynamic'
import Head from 'next/head'
import { Fragment, useContext, useState } from 'react'
const Header = dynamic(() => import('@/Component/Admin/Header/Header'))
const OrdersComp = dynamic(() => import('@/Component/Admin/Orders/OrdersComp'))

export default function Orders() {
    const [loaded, setLoaded] = useState(false)
    return (
        <Fragment>
            <Head>
                <title>Aquariun - Admin Orders</title>
                <meta name="description" content="Aquariun Admin" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <main className='Admin'>
                {
                    loaded && <Header />
                }
                <OrdersComp setLoaded={setLoaded} loaded={loaded} />
            </main>
        </Fragment>
    )
}
