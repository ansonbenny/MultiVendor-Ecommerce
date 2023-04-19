import React, { useState, useRef, Fragment, useContext } from 'react';
import JoditEditor from 'jodit-react';
import { adminAxios } from '../../../Config/Server'
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import ContentControl from '@/ContentControl/ContentControl';
import ObjectId from 'bson-objectid';

function AddProduct() {
    const editor = useRef(null);

    const { setAdminLogged } = useContext(ContentControl)

    const navigate = useRouter()

    const logOut = () => {
        setAdminLogged({ status: false })
        localStorage.removeItem("adminToken")
        navigate.push('/admin/login')
    }

    const [categories, setCategories] = useState([])

    const [productDetails, setProductDetails] = useState(
        {
            name: '',
            price: '',
            mrp: '',
            available: 'true',
            cancellation: 'true',
            return: 'true',
            category: '',
            categorySlug: '',
            srtDescription: '',
            description: '',
            seoDescription: '',
            seoTitle: '',
            seoKeyword: '',
            variant: [],
            uni_id_1: Date.now() + Math.random()
        }
    )

    const [thumbPrev, setThumbPrev] = useState()
    const [thumb, setThumb] = useState()
    const [images, setImages] = useState()
    const [imagesPrev, setImagesPrev] = useState([])

    useEffect(() => {
        adminAxios((server) => {
            server.get('/admin/getCatgories').then((data) => {
                if (data.data.login) {
                    logOut()
                } else {
                    setCategories(data.data)

                    if (data.data !== undefined && data.data !== null && data.data.length !== 0) {
                        setProductDetails(productDetails => ({
                            ...productDetails,
                            category: data.data[0].name,
                            categorySlug: data.data[0].slug
                        }))
                    }
                }
            }).catch((err) => {
                console.log('categories err')
            })
        })
    }, [])

    function FormSubmit(e) {

        e.preventDefault();

        let formData = new FormData();

        formData.append("uni_id_1", productDetails.uni_id_1)
        formData.append("uni_id_2", Date.now() + Math.random())
        formData.append("name", productDetails.name)
        formData.append("price", productDetails.price)
        formData.append("mrp", productDetails.mrp)
        formData.append("variant", JSON.stringify(productDetails.variant))
        formData.append("available", productDetails.available)
        formData.append("cancellation", productDetails.cancellation)
        formData.append("category", productDetails.category)
        formData.append("categorySlug", productDetails.categorySlug)
        formData.append("srtDescription", productDetails.srtDescription)
        formData.append("description", productDetails.description)
        formData.append("seoDescription", productDetails.seoDescription)
        formData.append("seoKeyword", productDetails.seoKeyword)
        formData.append("seoTitle", productDetails.seoTitle)
        formData.append('return', productDetails.return)

        formData.append('images', thumb);

        for (var i = 0; i < images.length; i++) {
            formData.append('images', images[i]);
        }

        adminAxios((server) => {
            server.post('/admin/addProduct', formData, {
                headers: {
                    "Content-type": "multipart/form-data",
                },
            }).then((data) => {
                if (data.data.login) {
                    logOut()
                } else {
                    navigate.push('/admin/products')
                }
            }).catch((err) => {
                alert("Sorry Server Has Some Problem")
            })
        })
    }

    return (
        <div className='AdminContainer AddProduct'>
            <div className="innerDiv">
                <div className='ExitDiv'>
                    <button onClick={() => {
                        navigate.push('/admin/products')
                    }}>CLOSE</button>
                </div>
                <form onSubmit={FormSubmit}>

                    <div className="row">
                        <div className='col-12'>
                            <label >Product Name</label><br />
                            <input value={productDetails.name} type="text" required onInput={(e) => {
                                setProductDetails({ ...productDetails, name: e.target.value })
                            }} />
                        </div>

                        <div className='col-6'>
                            <label >Price</label><br />
                            <input value={productDetails.price} type="number" onInput={(e) => {
                                setProductDetails({ ...productDetails, price: e.target.value })
                            }} disabled={productDetails.variant.length > 0 ? true : false}
                                required={productDetails.variant.length === 0 ? true : false} />
                        </div>

                        <div className='col-6'>
                            <label >MRP</label><br />
                            <input value={productDetails.mrp} type="number" onInput={(e) => {
                                setProductDetails({ ...productDetails, mrp: e.target.value })
                            }} disabled={productDetails.variant.length > 0 ? true : false}
                                required={productDetails.variant.length === 0 ? true : false} />
                        </div>

                        <div className='col-12'>
                            <label>Cancellation</label><br />
                            <select value={productDetails.cancellation} onInput={(e) => {
                                setProductDetails({ ...productDetails, cancellation: e.target.value })
                            }} >
                                <option value="true">Available</option>
                                <option value="false">Not Available</option>
                            </select>
                        </div>

                        <div className='col-md-6'>
                            <label>Available</label><br />
                            <select value={productDetails.available} onInput={(e) => {
                                setProductDetails({ ...productDetails, available: e.target.value })
                            }} >
                                <option value="true">Available</option>
                                <option value="false">Not Available</option>
                            </select>
                        </div>

                        <div className='col-md-6'>
                            <label>Return</label><br />
                            <select value={productDetails.return} onInput={(e) => {
                                setProductDetails({ ...productDetails, return: e.target.value })
                            }} >
                                <option value="true">Available</option>
                                <option value="false">Not Available</option>
                            </select>
                        </div>

                        <div className="col-md-12">
                            <label>Variants</label><br />
                            {
                                productDetails['variant'].map((obj, key) => {
                                    return (
                                        <div key={key} className='variantBox' >
                                            <div className='row' >
                                                <div className="col-md-3">
                                                    <label>Size</label>
                                                    <select value={obj.size} onChange={(e) => {
                                                        var newArr = [...productDetails['variant']]
                                                        newArr[key].size = e.target.value
                                                        setProductDetails({
                                                            ...productDetails,
                                                            variant: newArr
                                                        })
                                                    }} required >
                                                        <option>S</option>
                                                        <option>M</option>
                                                        <option>L</option>
                                                        <option>XL</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-3">
                                                    <label>Price</label>
                                                    <input type="number" value={obj.price} onChange={(e) => {
                                                        var newArr = [...productDetails['variant']]
                                                        newArr[key].price = e.target.value
                                                        setProductDetails({
                                                            ...productDetails,
                                                            variant: newArr
                                                        })
                                                    }} required />
                                                </div>
                                                <div className="col-md-3">
                                                    <label>MRP</label>
                                                    <input type="number" value={obj.mrp} onChange={(e) => {
                                                        var newArr = [...productDetails['variant']]
                                                        newArr[key].mrp = e.target.value
                                                        setProductDetails({
                                                            ...productDetails,
                                                            variant: newArr
                                                        })
                                                    }} required />
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="row">
                                                        <div className="col-9 col-md-6">
                                                            <label>Details</label>
                                                            <input type="text" value={obj.details} onChange={(e) => {
                                                                var newArr = [...productDetails['variant']]
                                                                newArr[key].details = e.target.value
                                                                setProductDetails({
                                                                    ...productDetails,
                                                                    variant: newArr
                                                                })
                                                            }} required />
                                                        </div>
                                                        <div className="col-3 col-md-6">
                                                            <label>Action</label><br />
                                                            <button type='button' onClick={() => {
                                                                setProductDetails({
                                                                    ...productDetails,
                                                                    variant: productDetails['variant'].filter((old) => {
                                                                        return old.id !== obj.id
                                                                    })
                                                                })
                                                            }} >X</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            <button data-for="variantAdd" type='button' onClick={() => {
                                setProductDetails({
                                    ...productDetails,
                                    variant: [...productDetails.variant, {
                                        size: 'S',
                                        price: productDetails.price,
                                        mrp: productDetails.mrp,
                                        details: '',
                                        id: new ObjectId().toHexString()
                                    }]
                                })
                            }} >Add Variant</button>
                        </div>

                        <div className='col-md-12'>
                            <label>Category</label><br />
                            <select onInput={(e) => {
                                var category = JSON.parse(e.target.value)

                                setProductDetails({
                                    ...productDetails,
                                    category: category.name,
                                    categorySlug: category.slug
                                })

                            }} required >

                                {
                                    categories.map((obj, key) => {
                                        var mainSub = obj.mainSub
                                        var sub = obj.sub
                                        return (
                                            <Fragment key={key}>
                                                <option value={JSON.stringify(obj)}>{obj.name}</option>
                                                {
                                                    mainSub.map((obj2, key2) => {
                                                        return (
                                                            <option key={key2} value={JSON.stringify({
                                                                name: `${obj.name} > ${obj2.name}`,
                                                                slug: obj2.slug
                                                            })
                                                            }> {obj.name}{' > '}{obj2.name}</option>
                                                        )
                                                    })
                                                }

                                                {
                                                    sub.map((obj3, key3) => {
                                                        return (
                                                            <option key={key3} value={JSON.stringify({
                                                                name: `${obj.name} > ${obj3.mainSub} > ${obj3.name}`,
                                                                slug: obj3.slug
                                                            })}>{obj.name}{' > '}{obj3.mainSub}{' > '}{obj3.name}</option>
                                                        )
                                                    })
                                                }
                                            </Fragment>
                                        )
                                    })
                                }

                            </select>
                        </div>

                        {
                            thumbPrev && (
                                <div className='col-12'>
                                    <img className='thumnail' src={thumbPrev} alt="" />
                                </div>
                            )
                        }

                        <div className='col-md-12'>
                            <label>Thumbnail</label><br />
                            <input accept="image/*" type="file" required onChange={(e) => {
                                setThumb(e.target.files[0])
                                setThumbPrev(URL.createObjectURL(e.target.files[0]))
                            }} />
                        </div>

                        {
                            imagesPrev.map((obj, key) => {
                                return (
                                    <div className='col-12 col-md-6' key={key}>
                                        <div className="imagesProductDiv">
                                            <img src={obj} alt="" />
                                        </div>
                                    </div>
                                )
                            })
                        }

                        <div className='col-md-12'>
                            <label>Images</label><br />
                            <input accept='image/*' type="file" multiple required onChange={(e) => {
                                setImages(e.target.files)
                                var files = e.target.files
                                var i = 0
                                var newImages = []
                                while (i < files.length) {
                                    newImages.push(URL.createObjectURL(files[i]))
                                    i++
                                }
                                setImagesPrev(newImages)
                            }} />
                        </div>

                        <div className='col-12'>
                            <label>SEO Title</label><br />
                            <input value={productDetails.seoTitle} type="text" onInput={(e) => {
                                setProductDetails({
                                    ...productDetails,
                                    seoTitle: e.target.value
                                })
                            }} required />
                        </div>

                        <div className='col-12'>
                            <label>SEO Keyword</label><br />
                            <input value={productDetails.seoKeyword} type="text" onInput={(e) => {
                                setProductDetails({
                                    ...productDetails,
                                    seoKeyword: e.target.value
                                })
                            }} required />
                        </div>

                        <div className='col-12'>
                            <label>SEO Description</label><br />
                            <textarea value={productDetails.seoDescription} onInput={(e) => {
                                setProductDetails({
                                    ...productDetails,
                                    seoDescription: e.target.value
                                })
                            }} cols="30" rows="10" required></textarea>
                        </div>

                        <div className='col-12'>
                            <label>Short Description</label><br />
                            <JoditEditor
                                ref={editor}
                                value={productDetails.srtDescription}
                                tabIndex={1}
                                onBlur={newContent => setProductDetails({
                                    ...productDetails,
                                    srtDescription: newContent
                                })}
                                onChange={newContent => { }}
                            />
                            <br />
                        </div>

                        <div className='col-12'>
                            <label>Description</label><br />
                            <JoditEditor
                                ref={editor}
                                value={productDetails.description}
                                tabIndex={1}
                                onBlur={newContent => setProductDetails({
                                    ...productDetails,
                                    description: newContent
                                })}
                                onChange={newContent => { }}
                            />
                        </div>

                        <div className='col-12'>
                            <button className='submitBnt'>Add Product</button>
                        </div>

                    </div>

                </form>
            </div >
        </div >
    )
}

export default AddProduct