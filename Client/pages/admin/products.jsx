import dynamic from 'next/dynamic'
import Head from 'next/head'
import { Fragment, useState } from 'react'
const Header = dynamic(() => import('@/Component/Admin/Header/Header'))
const ProductList = dynamic(() => import('@/Component/Admin/Product/ProductList'))

export default function Products() {
    const [loaded,setLoaded] = useState(false)
    return (
        <Fragment>
            <Head>
                <title>Aquariun - Admin Products</title>
                <meta name="description" content="Aquariun Admin" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <main className='Admin'>
                {
                    loaded && <Header />
                }
                <ProductList setLoaded={setLoaded} loaded={loaded} />
            </main>
        </Fragment>
    )
}
