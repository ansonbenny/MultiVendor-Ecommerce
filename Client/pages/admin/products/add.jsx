import dynamic from 'next/dynamic'
import Head from 'next/head'
import { Fragment } from 'react'
const Header = dynamic(() => import('@/Component/Admin/Header/Header'))
const AddProduct = dynamic(() => import('@/Component/Admin/Product/AddProduct'), {
    ssr: false
})

export default function ProductAdd() {

    return (
        <Fragment>
            <Head>
                <title>Aquariun - Admin Add Product</title>
                <meta name="description" content="Aquariun Admin" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <main className='Admin'>
                <Header />
                <AddProduct />
            </main>
        </Fragment>
    )
}
