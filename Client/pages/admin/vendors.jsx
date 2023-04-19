import dynamic from 'next/dynamic'
import Head from 'next/head'
import { Fragment, useContext, useState } from 'react'
const Header = dynamic(() => import('@/Component/Admin/Header/Header'))
const VendorComp = dynamic(() => import('@/Component/Admin/Vendor/Vendors'))

export default function Vendors() {
    const [loaded,setLoaded] = useState(false)
    return (
        <Fragment>
            <Head>
                <title>Aquariun - Admin Vendors</title>
                <meta name="description" content="Aquariun Admin" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <main className='Admin'>
                {
                    loaded && <Header />
                }
                <VendorComp setLoaded={setLoaded} loaded={loaded}  />
            </main>
        </Fragment>
    )
}
