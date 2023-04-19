import Loading from '@/Component/Loading/Loading'
import Server, { vendorCheck } from '@/Config/Server'
import ContentControl from '@/ContentControl/ContentControl'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Fragment, useContext, useEffect, useState } from 'react'
const Header = dynamic(() => import('@/Component/Vendor/Header/Header'))
const SettingsComp = dynamic(() => import('@/Component/Vendor/Settings/SettingsComp'))

export default function Settings() {
    const { venderLogged, setVendorLogged } = useContext(ContentControl)
    const [loaded, setLoaded] = useState(false)
    let router = useRouter()
    useEffect(() => {
        let token = localStorage.getItem('vendorToken')
        if (token) {
            if (!venderLogged.status) {
                vendorCheck(token, (data) => {
                    setVendorLogged(data)
                    if (!data.status) {
                        localStorage.removeItem('vendorToken')
                        router.push('/vendor/login')
                    }
                    setLoaded(true)
                })
            } else {
                setLoaded(true)
            }
        } else {
            setLoaded(true)
            router.push('/vendor/login')
        }
    }, [venderLogged])

    return (
        <Fragment>
            <Head>
                <title>Aquariun - Vendor Settings</title>
                <meta name="description" content="Aquariun Vendor" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <main className='Vendor'>
                {
                    loaded ? (
                        <>
                            <Header />
                            <SettingsComp venderLogged={venderLogged} setVendorLogged={setVendorLogged} />
                        </>
                    ) : <Loading />
                }
            </main>
        </Fragment>
    )
}
