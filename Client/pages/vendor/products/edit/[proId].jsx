import Loading from '@/Component/Loading/Loading'
import Server, { ServerId, vendorAxios } from '@/Config/Server'
import ContentControl from '@/ContentControl/ContentControl'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Fragment, useContext, useEffect, useState } from 'react'
const Header = dynamic(() => import('@/Component/Vendor/Header/Header'))
const EditProductComp = dynamic(() => import('@/Component/Vendor/Product/EditProduct'), {
    ssr: false
})

export default function EditProduct() {
    const { venderLogged, setVendorLogged } = useContext(ContentControl)

    const router = useRouter()

    const [loaded, setLoaded] = useState(false)

    const [categories, setCategories] = useState([])

    const [images, setImages] = useState([])
    const [serverImg, setServerImg] = useState([])
    const [delImages, setDelImg] = useState([])
    const [uplodImages, setUploadImg] = useState([])

    const [productDetails, setProductDetails] = useState({
        name: '', price: '', mrp: '', available: 'true',
        category: '', categorySlug: '', srtDescription: '', description: '',
        seoDescription: '', seoTitle: '', seoKeyword: '', return: 'true', cancellation: 'true', variant: []
    })

    useEffect(() => {
        let token = localStorage.getItem('vendorToken')

        if (router.query.proId) {
            if (!token) {
                setLoaded(true)
                router.push('/vendor/login')
            } else {
                vendorAxios((server) => {
                    server.get(`/vendor/getOneProduct/${router.query.proId}`).then((res) => {
                        if (res.data.login) {
                            setVendorLogged({ status: false })
                            localStorage.removeItem('vendorToken')
                            setLoaded(true)
                            router.push('/vendor/login')
                        } else {
                            setProductDetails(res.data)
                            var files = res.data.files
                            var ImagesServer = files.map((ele, key) => {
                                var location = ServerId + '/product/' + res.data.uni_id_1 + res.data.uni_id_2 + '/' + files[key].filename
                                return location
                            })
                            setImages(ImagesServer)
                            setServerImg(files)
                            setLoaded(true)
                        }
                    }).catch((err) => {
                        setLoaded(true)
                        alert("Sorry you selected product not available")
                        router.push('/vendor/products')
                    })
                })

                Server.get('/vendor/getCategories').then((data) => {
                    setLoaded(true)
                    setCategories(data.data)
                }).catch((err) => {
                    setLoaded(true)
                    console.log('categories err')
                })
            }
        }
    }, [venderLogged, router.query])

    return (
        <Fragment>
            <Head>
                <title>Aquariun - Vendor Edit Product</title>
                <meta name="description" content="Aquariun Vendor" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <main className='Vendor'>
                {
                    loaded ? (
                        <>
                            <Header />
                            <EditProductComp
                                setProductDetails={setProductDetails} productDetails={productDetails}
                                categories={categories}
                                images={images} setImages={setImages}
                                serverImg={serverImg} setServerImg={setServerImg}
                                uplodImages={uplodImages} setUploadImg={setUploadImg}
                                delImages={delImages} setDelImg={setDelImg}
                                proId={router.query.proId}
                            />
                        </>
                    ) : <Loading />
                }
            </main>
        </Fragment>
    )
}
