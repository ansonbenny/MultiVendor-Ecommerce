import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Fragment, useState } from 'react'
const Header = dynamic(() => import('@/Component/Admin/Header/Header'))
const VendorProduct = dynamic(() => import('@/Component/Admin/Vendor/VendorProduct'))

export default function VendorProducts() {
    let router = useRouter()
    const [loaded, setLoaded] = useState(false)
    return (
        <Fragment>
            <Head>
                <title>Aquariun - Admin Vendor Products</title>
                <meta name="description" content="Aquariun Admin" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <main className='Admin'>
                {
                    loaded && <Header />
                }
                <VendorProduct vendorId={router.query.vendorId} loaded={loaded} setLoaded={setLoaded} />
            </main>
        </Fragment>
    )
}
