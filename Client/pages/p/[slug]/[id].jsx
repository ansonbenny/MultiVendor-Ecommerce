import Server, { userAxios } from "@/Config/Server"
import ContentControl from "@/ContentControl/ContentControl"
import dynamic from "next/dynamic"
import Head from "next/head"
import { useRouter } from "next/router"
import { Fragment, useContext, useEffect, useState } from "react"
const Footer = dynamic(() => import('@/Component/User/Footer/Footer'))
const Header = dynamic(() => import('@/Component/User/Header/Header'))
const ProductHead = dynamic(() => import('@/Component/User/Product/ProductHead'))
const QuickView = dynamic(() => import('@/Component/User/QuickView/QuickView'))
const ImageModal = dynamic(() => import('@/Component/User/Product/ImageModal'))
const ProductComp = dynamic(() => import('@/Component/User/Product/ProductComp'))

export const getServerSideProps = async ({ query }) => {
    try {
        let response = await Server.get(`/users/product/${query.slug}/${query.id}`)
        return {
            props: {
                response: response.data,
                error_res: false
            }
        }
    } catch (err) {
        return {
            redirect: {
                destination: '/404',
                permanent: false,
            },
        }
    }
}

function Product({ response }) {

    let route = useRouter()

    const { userLogged, setUserLogged,
        QuickVw, setQuickVw,
        LoginModal, setLoginModal,
        cartTotal, setCartTotal, setOrderType
    } = useContext(ContentControl)

    const [product, setProduct] = useState(response.product)
    const [similar, setSimilar] = useState(response.similar)

    const [OrderDetails, setOrderDetails] = useState({
        quantity: 1,
        proId: '',
        incart: false
    })

    const [ImgModal, setImgModal] = useState({
        active: false,
        url: ''
    })

    const [showProductHead, setProductHead] = useState(false)

    useEffect(() => {
        async function getResponse() {
            try {
                let token = localStorage.getItem('token')
                let response = await Server.get(`/users/product/${route.query.slug}/${route.query.id}`)
                if (token) {
                    userAxios(async (server) => {
                        let data = await server.post('/users/checkItemInCart', {
                            proId: response['data'].product._id
                        }).catch((err) => {
                            console.log("cart fetch error")
                            route.push('/error')
                        })

                        if (data.data.login) {
                            setUserLogged({ status: false })
                            localStorage.removeItem('token')
                        } else {
                            setOrderDetails(obj => ({
                                ...obj,
                                proId: response['data'].product._id,
                                incart: data['data'].incart
                            }))
                        }

                    })
                }
                setProduct(response.data.product)
                setSimilar(response.data.similar)
            } catch (err) {
                console.log(err)
            }
        }
        getResponse()
    }, [route.query])

    useEffect(() => {
        window.addEventListener("scroll", () => {
            if (window.scrollY >= 250) {
                setProductHead(true)
            } else {
                setProductHead(false)
            }
        })
    })

    return (
        <Fragment>
            <Head>
                <title>{`Aquariun - ${product.name}`}</title>
                <meta name="description" content={product.seoDescription} />
                <meta name="keywords" content={product.seoKeyword} />
                <meta name="title" content={product.seoTitle} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <main>
                <Header />
                <ContentControl.Provider value={{
                    OrderDetails, setOrderDetails,
                    ImgModal, setImgModal,
                    QuickVw, setQuickVw,
                    product, similar,
                    userLogged, setUserLogged,
                    LoginModal, setLoginModal, cartTotal, setCartTotal,
                    setOrderType, setProduct
                }} >
                    {showProductHead && <ProductHead />}
                    {QuickVw.active && <QuickView />}
                    {ImgModal.active && <ImageModal />}
                    <ProductComp />
                </ContentControl.Provider>
                <Footer />
            </main>
        </Fragment>
    )
}

export default Product