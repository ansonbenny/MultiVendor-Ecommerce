import Loading from '@/Component/Loading/Loading'
import { vendorAxios } from '@/Config/Server'
import ContentControl from '@/ContentControl/ContentControl'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Fragment, useContext, useEffect, useState } from 'react'
const Header = dynamic(() => import('@/Component/Vendor/Header/Header'))
const ProductsComp = dynamic(() => import('@/Component/Vendor/Product/ProductsComp'))

export default function Products() {
    const router = useRouter()

    const { venderLogged, setVendorLogged } = useContext(ContentControl)

    const [responseServer, setResponse] = useState({
        pagination: false
    })

    const [loaded, setLoaded] = useState(false)

    const [update, setUpdate] = useState(true)

    const [search, setSearch] = useState('')

    const [pages, setPages] = useState([])

    const [products, setProducts] = useState([])

    useEffect(() => {
        let token = localStorage.getItem('vendorToken')

        if (token) {
            setLoaded(false)
            if (!router.query.search && search.length === 0) {
                vendorAxios((server) => {
                    server.get('/vendor/getProducts', {
                        params: {
                            page: 1,
                            search: null
                        }
                    }).then((response) => {
                        if (response.data.login) {
                            setVendorLogged({ status: false })
                            localStorage.removeItem('vendorToken')
                            router.push('/vendor/login')
                        } else {
                            setProducts(response.data.data)
                            setResponse(response.data)
                            setPages(response.data.pages)
                        }
                    }).catch((err) => {
                        console.log("error")
                    })
                    setSearch('')
                })
                setLoaded(true)
            } else {
                vendorAxios((server) => {
                    server.get('/vendor/getProducts', {
                        params: {
                            page: 1,
                            search: router.query.search
                        }
                    }).then((response) => {
                        if (response.data.login) {
                            setVendorLogged({ status: false })
                            localStorage.removeItem('vendorToken')
                            router.push('/vendor/login')
                        } else {
                            setProducts(response.data.data)
                            setResponse(response.data)
                            setPages(response.data.pages)
                        }
                    }).catch((err) => {
                        console.log("error")
                    })
                })
                setLoaded(true)
            }
        } else {
            router.push('/vendor/login')
        }
    }, [search, router.asPath, venderLogged, update])

    return (
        <Fragment>
            <Head>
                <title>Aquariun - Vendor Products</title>
                <meta name="description" content="Aquariun Vendor" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <main className='Vendor'>
                {
                    loaded ? (
                        <>
                            <Header />
                            <ProductsComp
                                responseServer={responseServer} setResponse={setResponse}
                                setSearch={setSearch} search={search}
                                pages={pages} setPages={setPages}
                                products={products} setProducts={setProducts}
                                setUpdate={setUpdate}
                            />
                        </>
                    ) : <Loading />
                }
            </main>
        </Fragment>
    )
}
