import dynamic from 'next/dynamic'
import Head from 'next/head'
import { Fragment, useState } from 'react'
const Header = dynamic(() => import('@/Component/Admin/Header/Header'))
const CategoriesComp = dynamic(() => import('@/Component/Admin/Categories/CategoriesComp'))

export default function Categories() {
    const [loaded,setLoaded] = useState(false)
    return (
        <Fragment>
            <Head>
                <title>Aquariun - Admin Categories</title>
                <meta name="description" content="Aquariun Admin" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <main className='Admin'>
               {
                loaded &&  <Header />
               }
                <CategoriesComp loaded={loaded} setLoaded={setLoaded} />
            </main>
        </Fragment>
    )
}
