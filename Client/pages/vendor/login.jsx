import ContentControl from '@/ContentControl/ContentControl'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Fragment, useContext, useEffect } from 'react'
const LoginComp = dynamic(() => import('@/Component/Vendor/Login/LoginComp'))

export default function Login() {
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
                <title>Aquariun - Vendor Login</title>
                <meta name="description" content="Aquariun Vendor" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <main className='Vendor'>
                <LoginComp />
            </main>
        </Fragment>
    )
}
