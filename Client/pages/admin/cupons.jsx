import dynamic from 'next/dynamic'
import Head from 'next/head'
import { Fragment, useState } from 'react'
const Header = dynamic(() => import('@/Component/Admin/Header/Header'))
const CuponsComp = dynamic(() => import('@/Component/Admin/Cupons/Cupons'))

export default function Cupons() {
    const [loaded, setLoaded] = useState(false)
    return (
        <Fragment>
            <Head>
                <title>Aquariun - Admin Cupons</title>
                <meta name="description" content="Aquariun Admin" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <main className='Admin'>
                {
                    loaded && <Header />
                }
                <CuponsComp loaded={loaded} setLoaded={setLoaded} />
            </main>
        </Fragment>
    )
}
