import { vendorCheck } from '@/Config/Server'
import ContentControl from '@/ContentControl/ContentControl'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Fragment, useContext, useEffect, useState } from 'react'
const Header = dynamic(() => import('@/Component/Vendor/Header/Header'))
const AddProductComp = dynamic(() => import('@/Component/Vendor/Product/AddProduct'), {
    ssr: false
})

export default function AddProduct() {
    const { setVendorLogged, venderLogged } = useContext(ContentControl)

    const router = useRouter()

    useEffect(() => {
        let token = localStorage.getItem('vendorToken')
        if (token) {
            if(!venderLogged.status){
                vendorCheck(token, (data) => {
                    setVendorLogged(data)
                    if (!data.status) {
                        localStorage.removeItem('vendorToken')
                        router.push('/vendor/login')
                    }
                })
            }
        } else {
            router.push('/vendor/login')
        }
    }, [venderLogged])

    return (
        <Fragment>
            <Head>
                <title>Aquariun - Vendor Add Product</title>
                <meta name="description" content="Aquariun Vendor" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <main className='Vendor'>
                <Header />
                <AddProductComp />
            </main>
        </Fragment>
    )
}
