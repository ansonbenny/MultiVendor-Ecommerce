import dynamic from 'next/dynamic'
import Head from 'next/head'
import { Fragment} from 'react'
const Header = dynamic(() => import('@/Component/Admin/Header/Header'))
const EditProduct = dynamic(() => import('@/Component/Admin/Product/EditProduct'), {
    ssr: false
})

export default function ProductEdit() {

    return (
        <Fragment>
            <Head>
                <title>Aquariun - Admin Edit Product</title>
                <meta name="description" content="Aquariun Admin" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <main className='Admin'>
                <Header />
                <EditProduct />
            </main>
        </Fragment>
    )
}
