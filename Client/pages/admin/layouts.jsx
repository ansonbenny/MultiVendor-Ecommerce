import dynamic from 'next/dynamic'
import Head from 'next/head'
import { Fragment, useState } from 'react'
const Header = dynamic(() => import('@/Component/Admin/Header/Header'))
const LayoutsComp = dynamic(() => import('@/Component/Admin/Layouts/LayoutsComp'), {
    ssr: false
})

export default function Layouts() {
    const [loaded, setLoaded] = useState(false)
    return (
        <Fragment>
            <Head>
                <title>Aquariun - Admin Layouts</title>
                <meta name="description" content="Aquariun Admin" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <main className='Admin'>
                {
                    loaded && <Header />
                }
                <LayoutsComp setLoaded={setLoaded} loaded={loaded} />
            </main>
        </Fragment>
    )
}
