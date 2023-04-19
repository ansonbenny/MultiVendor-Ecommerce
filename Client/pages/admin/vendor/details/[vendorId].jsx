import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Fragment } from 'react'
const Header = dynamic(() => import('@/Component/Admin/Header/Header'))
const VendorDetailsComp = dynamic(() => import('@/Component/Admin/Vendor/VendorDetailsComp'))

export default function VendorDetails() {
    let router = useRouter()
    return (
        <Fragment>
            <Head>
                <title>Aquariun - Admin Vendor Details</title>
                <meta name="description" content="Aquariun Admin" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <main className='Admin'>
                <Header />
                <VendorDetailsComp vendorId={router.query.vendorId} />
            </main>
        </Fragment>
    )
}
