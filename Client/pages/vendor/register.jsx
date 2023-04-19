import ContentControl from '@/ContentControl/ContentControl'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Fragment, useContext, useEffect } from 'react'
const RegisterComp = dynamic(() => import('@/Component/Vendor/Register/RegisterComp'))

export default function Register() {
    const { venderLogged } = useContext(ContentControl)
    const navigate = useRouter()

    useEffect(() => {
        if (venderLogged.status) {
            document.body.style.background = 'transparent'
            navigate.push('/vendor/dashboard')
        }
    }, [venderLogged])

    return (
        <Fragment>
            <Head>
                <title>Aquariun - Vendor Register</title>
                <meta name="description" content="Aquariun Vendor" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <main className='Vendor'>
                <RegisterComp />
            </main>
        </Fragment>
    )
}
