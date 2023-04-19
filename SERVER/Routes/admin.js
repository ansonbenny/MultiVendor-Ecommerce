import express, { response } from "express";
import uploader from "../Helpers/uploader.js";
import product from "../Helpers/product.js";
import deleteFolder from "../Helpers/deleteFolder.js";
import deleteFile, { DeleteOneFile } from "../Helpers/deleteFile.js";
import jwt from 'jsonwebtoken'
import slugify from 'slug-generator'
import layout from "../Helpers/layout.js";
import admin from "../Helpers/admin.js";
import tokenShipRocket from '../ShipRocket/token.js'
import trackProduct, { orderStatusControl } from "../ShipRocket/trackProduct.js";
import addPickupAddress from "../ShipRocket/addPickupAddress.js";

var router = express.Router()

function CheckAdmin(req, res, next) {
    const token = req.headers['x-access-token']
    try {
        let AdminTkn = jwt.verify(token, process.env.JWT_SECRET)

        admin.getAdmin(AdminTkn._id).then((data) => {
            if (data) {
                req.body.adminId = data._id.toString()
                req.query.adminId = data._id.toString()
                next()
            } else {
                res.status(200).json({ login: true })
            }
        }).catch((err) => {
            res.status(500).json('err')
        })
    } catch (err) {
        res.status(200).json({ login: true })
    }
}

// Dashboard 

router.get('/getDashboard', CheckAdmin, async (req, res) => {
    let total = await admin.getDashboardTotal().catch(() => {
        res.status(500).json('err')
    })

    let orders = await admin.getAllOrders({ search: '', skip: 0 }, 10).catch(() => {
        res.status(500).json('err')
    })

    res.status(200).json({
        total: total,
        Orders: orders
    })
})

//Account 

router.post('/login', (req, res) => {
    req.body.email = req.body.email.toLowerCase()
    admin.loginAdmin(req.body).then((data) => {
        if (data.login) {
            const { admin } = data

            const expire = 60 * 60 * 24

            const token = jwt.sign({
                email: admin.email,
                _id: admin._id
            }, process.env.JWT_SECRET, {
                expiresIn: expire
            })

            res.status(200).json({ admin: token })
        } else {
            res.status(200).json({ admin: undefined })
        }
    }).catch(() => {
        res.status(500).json('err')
    })
})

router.get('/getAdminData', (req, res) => {
    let token = req.headers['x-access-token']
    try {
        let adminTkn = jwt.verify(token, process.env.JWT_SECRET)
        admin.getAdmin(adminTkn._id).then((adminData) => {
            if (adminData) {
                res.status(200).json({ status: true })
            } else {
                res.status(200).json({
                    status: false
                })
            }
        }).catch(() => {
            res.status(500).json('err')
        })
    } catch (err) {
        res.status(200).json({
            status: false
        })
    }
})

// Product & Category

router.post('/addProduct', CheckAdmin, uploader.products.array("images", 20), (req, res, next) => {
    req.body.pickup_location = process.env.SHIPROCKET_PICKUPID
    req.body.files = req.files

    req.body.variant = JSON.parse(req.body.variant)
    if (req.body.variant.length > 0) {
        req.body.price = req.body.variant[0].price
        req.body.mrp = req.body.variant[0].mrp
        req.body.variantDetails = req.body.variant[0].details
        req.body.variant[0].active = true
        req.body.currVariantSize = req.body.variant[0].size
    } else {
        req.body.currVariantSize = ""
    }

    req.body.slug = slugify(req.body.name)

    var orginalPrice = parseInt(req.body.mrp);
    var offerPrice = parseInt(req.body.price);
    var discount = orginalPrice - offerPrice;
    var discountPerc = Math.trunc(discount / orginalPrice * 100);
    req.body.mrp = parseInt(req.body.mrp)
    req.body.price = parseInt(req.body.price)
    req.body.discount = parseInt(discountPerc);
    req.body.vendor = false

    admin.addProduct(req.body).then((done) => {
        res.status(200).json(done)
    }).catch((err) => {
        res.status(500).json(err)
    })
})

router.put('/editProduct/:id', CheckAdmin, uploader.products.array("images", 20), (req, res) => {
    if (req.params['id'].length === 24) {
        var data = req.body

        data.variant = JSON.parse(data.variant)
        if (data.variant.length > 0) {
            data.price = data.variant[0].price
            data.mrp = data.variant[0].mrp
            data.variantDetails = data.variant[0].details
            data.variant[0].active = true
            data.currVariantSize = data.variant[0].size
        } else {
            data.currVariantSize = ""
        }

        data.pickup_location = process.env.SHIPROCKET_PICKUPID
        data.slug = slugify(data.name)

        var orginalPrice = parseInt(data.mrp);
        var offerPrice = parseInt(data.price);
        var discount = orginalPrice - offerPrice;
        var discountPerc = Math.trunc(discount / orginalPrice * 100);
        data.mrp = parseInt(data.mrp)
        data.price = parseInt(data.price)
        data.discount = parseInt(discountPerc);

        var serverImg = JSON.parse(data.serverImg)
        data.serverImg = serverImg
        var delImgs = JSON.parse(data.deleteImg)

        serverImg.map(obj => {
            delImgs = delImgs.filter(obj2 => {
                if (obj.filename === obj2) {
                    return false
                } else {
                    return true
                }
            })
        })

        admin.updateProduct(data).then((succ) => {
            if (delImgs.length !== 0) {
                deleteFile(serverImg[0].destination + '/', delImgs, (done) => {
                    if (done) {
                        res.json(200).json(succ)
                    }
                })
            } else {
                res.json(200).json(succ)
            }
        }).catch(() => {
            res.status(500).json('err')
        })
    } else {
        res.status(500).json('err')
    }
})

router.get('/getProducts', CheckAdmin, async (req, res, next) => {
    if (req.query.search === undefined) {
        let proCount = await admin.getProductCount().catch((err) => {
            console.log(err)
        })

        var response = {
            data: [],
            pagination: false,
            totalPage: 1,
            currentPage: 1,
            pages: [],
            showNot: false,
            search: false
        }

        if (proCount === 0 || proCount === undefined || proCount === null) {
            response.showNot = true
        }

        var skip
        var limit = 12

        if (proCount > limit) {
            skip = 0
            response.totalPage = Math.ceil(proCount / limit)
            response.pagination = true
            var page = parseInt(req.query.page)
            if (page) {
                skip = (page - 1) * limit
                response.currentPage = page
                if (page + 2 <= response.totalPage) {
                    var max = page + 2
                    if (page === 1) {
                        for (var i = 0; i <= 2; i++) {
                            response.pages[i] = page + i
                        }
                    } else {
                        var oldPage = page - 1
                        for (var i = 0; i <= 3; i++) {
                            response.pages[i] = oldPage + i
                        }
                    }
                } else if (page + 1 <= response.totalPage) {
                    var max = page + 1
                    if (page === 1) {
                        for (var i = 0; i <= 1; i++) {
                            response.pages[i] = page + i
                        }
                    } else {
                        var oldPage = page - 1
                        for (var i = 0; i <= 2; i++) {
                            response.pages[i] = oldPage + i
                        }
                    }
                } else {
                    response.pages[0] = page - 1
                    response.pages[1] = page
                }
            }

        } else {
            skip = 0
            response.pagination = false
        }

        admin.getAdminProducts(skip, limit).then((data) => {
            response.data = data
            res.status(200).json(response)
        }).catch((err) => {
            res.status(500).json(err)
        })
    } else {
        let allProductCount = await admin.getProductCount().catch((err) => {
            console.log(err)
        })

        let proCount = await admin.getProductCountAdminSearch(req.query.search).catch((err) => {
            console.log(err)
        })

        var response = {
            data: [],
            pagination: false,
            totalPage: 1,
            currentPage: 1,
            pages: [],
            search: true,
            showNot: false
        }

        if (allProductCount === 0 || allProductCount === undefined || allProductCount === null) {
            response.showNot = true
        }

        var skip
        var limit = 12

        if (proCount > limit) {
            skip = 0
            response.totalPage = Math.ceil(proCount / limit)
            response.pagination = true
            var page = parseInt(req.query.page)
            if (page) {
                skip = (page - 1) * limit
                response.currentPage = page
                if (page + 2 <= response.totalPage) {
                    var max = page + 2
                    if (page === 1) {
                        for (var i = 0; i <= 2; i++) {
                            response.pages[i] = page + i
                        }
                    } else {
                        var oldPage = page - 1
                        for (var i = 0; i <= 3; i++) {
                            response.pages[i] = oldPage + i
                        }
                    }
                } else if (page + 1 <= response.totalPage) {
                    var max = page + 1
                    if (page === 1) {
                        for (var i = 0; i <= 1; i++) {
                            response.pages[i] = page + i
                        }
                    } else {
                        var oldPage = page - 1
                        for (var i = 0; i <= 2; i++) {
                            response.pages[i] = oldPage + i
                        }
                    }
                } else {
                    response.pages[0] = page - 1
                    response.pages[1] = page
                }
            }

        } else {
            skip = 0
            response.pagination = false
        }

        admin.getAdminProductsSearch(req.query.search, skip, limit).then((data) => {
            response.data = data
            res.status(200).json(response)
        }).catch((err) => {
            res.status(500).json(err)
        })
    }
})

router.get('/getOneProduct/:Id', CheckAdmin, (req, res) => {
    if (req.params['Id'].length === 24) {
        product.getOneProduct(req.params.Id).then((product) => {
            res.status(200).json(product)
        }).catch((err) => {
            res.status(500).json(err)
        })
    } else {
        res.status(500).json('err')
    }
})

router.delete('/deleteProduct/:id', CheckAdmin, (req, res) => {
    var dir = `./uploads/product/${req.body.folderId}`
    if (req.params['id'].length === 24) {
        admin.deleteProduct(req.params.id).then(() => {
            deleteFolder(dir, (data) => {
                if (data) {
                    res.status(200).json("done")
                } else {
                    res.status(200).json("done")
                }
            })
        }).catch(() => {
            res.status(500).json('err')
        })
    } else {
        res.status(500).json('err')
    }
})

router.post('/addCategory', CheckAdmin, uploader.categories.single('image'), (req, res) => {
    req.body.file = req.file
    req.body.header = 'false'
    req.body.slug = slugify(req.body.name)
    req.body.mainSub = []
    req.body.sub = []

    admin.addCategory(req.body).then((done) => {
        res.status(200).json('done')
    }).catch((err) => {
        res.status(500).json('err')
    })
})

router.get('/getCatgories', CheckAdmin, (req, res) => {
    product.getCategories().then((categories) => {
        res.status(200).json(categories)
    }).catch(() => {
        res.status(500).json('err')
    })
})

router.get('/getAllTypesCategory', CheckAdmin, async (req, res) => {
    let categories = await product.getCategories().catch(() => {
        res.status(500).json('err')
    })
    let mainSub = await product.getMainSubCategories().catch((err) => {
        res.status(500).json('err')
    })
    let subCategory = await product.getSubCategories().catch((err) => {
        res.status(500).json('err')
    })

    let response = {
        categories: [],
        mainSub: [],
        subCategory: []
    }

    if (categories !== null && categories !== undefined) {
        response.categories = categories
    }

    if (mainSub !== null && mainSub !== undefined) {
        response.mainSub = mainSub
    }

    if (subCategory !== null && subCategory !== undefined) {
        response.subCategory = subCategory
    }

    res.status(200).json(response)
})

router.delete('/deleteCategory/:id', CheckAdmin, (req, res) => {
    var dir = `./uploads/category/${req.body.folderId}`
    admin.deleteCategory(req.params.id).then(() => {
        deleteFolder(dir, (data) => {
            if (data) {
                res.status(200).json("done")
            } else {
                res.status(200).json("done")
            }
        })
    }).catch(() => {
        res.status(500).json('err')
    })
})

router.get('/searchCategory', CheckAdmin, (req, res) => {
    if (req.query.search.length !== 0) {
        product.searchCategory(req.query.search).then((data) => {
            res.status(200).json(data)
        }).catch((err) => {
            res.status(500).json('err')
        })
    } else {
        res.status(200).json([])
    }
})

router.put('/addHeaderCategory', CheckAdmin, (req, res) => {
    admin.addHeaderCategory(req.body).then((done) => {
        res.status(200).json('done')
    }).catch((err) => {
        res.status(500).json('err')
    })
})

router.put('/addMainSubCategory', CheckAdmin, (req, res) => {
    var mainCate = JSON.parse(req.body.main)

    var details = {
        name: req.body.name,
        category: mainCate.name,
        uni_id: Date.now() + Math.random(),
        slug: slugify(mainCate.slug + "-" + req.body.name)
    }

    admin.addMainSubCategory(details, mainCate._id).then((done) => {
        res.status(200).json('done')
    }).catch((err) => {
        res.status(500).json('err')
    })
})

router.get('/searchMainSubCategory', CheckAdmin, (req, res) => {
    if (req.query.search.length !== 0) {
        product.searchMainSubCategory(req.query.search).then((result) => {
            res.status(200).json(result)
        }).catch(() => {
            res.status(500).json('err')
        })
    } else {
        res.status(200).json([])
    }
})

router.put('/addSubCategory', CheckAdmin, (req, res) => {
    var mainSub = JSON.parse(req.body.main)
    var details = {
        uni_id: Date.now() + Math.random(),
        slug: slugify(mainSub.slug + '-' + req.body.name),
        name: req.body.name,
        mainSubSlug: mainSub.slug,
        mainSub: mainSub.name,
        category: mainSub.category
    }

    admin.addSubCategory(details, mainSub._id).then((done) => {
        res.status(200).json('done')
    }).catch((err) => {
        res.status(500).json('err')
    })
})

router.put('/deleteMainSubCategory/:id', CheckAdmin, (req, res) => {
    admin.deleteMainSubCategory(req.body, req.params.id).then((done) => {
        res.status(200).json("done")
    }).catch((err) => {
        res.status(500).json('err')
    })
})

router.put('/deleteSubCategory/:id', CheckAdmin, (req, res) => {
    admin.deleteSubCategory(req.body, req.params.id).then((done) => {
        res.status(200).json("done")
    }).catch((err) => {
        res.status(500).json('err')
    })
})

router.get('/getOneCategory/:id', CheckAdmin, (req, res) => {
    product.getOneCategory(req.params.id).then((category) => {
        res.status(200).json(category)
    }).catch((err) => {
        res.status(500).json('err')
    })
})

router.put('/editCategory', CheckAdmin, uploader.categories.single('image'), (req, res) => {
    var oldFile = JSON.parse(req.body.oldFile)

    var details = {
        name: req.body.name,
        cateId: req.body.cateId
    }

    if (req.file !== undefined) {
        details.file = req.file
    } else {
        details.file = oldFile
    }

    admin.editCategory(details).then((done) => {
        if (req.file !== undefined) {
            DeleteOneFile('./' + oldFile.path, (done) => {
                if (done) {
                    res.status(200).json('done')
                }
            })
        } else {
            res.status(200).json('done')
        }
    }).catch((err) => {
        res.status(500).json('err')
    })
})

// Layout

router.post('/addOneRowSection', CheckAdmin, (req, res) => {
    layout.addOneRowSection(req.body).then((done) => {
        res.status(200).json('done')
    }).catch((err) => {
        res.status(500).json('err')
    })
})

router.post('/addTwoRowSection', CheckAdmin, (req, res) => {
    layout.addTwoRowSection(req.body).then((done) => {
        res.status(200).json('done')
    }).catch((err) => {
        res.status(500).json('err')
    })
})

router.get('/getLayouts', CheckAdmin, async (req, res) => {
    let sectionone = await layout.getSectionsCategory('sectionone').catch((err) => {
        res.status(500).json('err')
    })

    let sectionfour = await layout.getSectionsRowOne('sectionfour').catch((err) => {
        res.status(500).json('err')
    })

    let sectiontwo = await layout.getSectionsRowTwo('sectiontwo').catch((err) => {
        res.status(500).json('err')
    })

    let sectionthree = await layout.getSectionsRowTwo('sectionthree').catch((err) => {
        res.status(500).json('err')
    })

    let sliderOne = await layout.getSliderOrBanner('sliderOne').catch((err) => {
        res.status(500).json('err')
    })

    let sliderTwo = await layout.getSliderOrBanner('sliderTwo').catch((err) => {
        res.status(500).json('err')
    })

    let banner = await layout.getSliderOrBanner('banner').catch((err) => {
        res.status(500).json('err')
    })

    let response = {
        sectionone: sectionone,
        sectionfour: sectionfour,
        sectiontwo: sectiontwo,
        sectionthree: sectionthree,
        sliderOne: sliderOne,
        sliderTwo: sliderTwo,
        banner: banner
    }

    res.status(200).json(response)
})

router.put('/removeItemRowOne', CheckAdmin, (req, res) => {
    layout.removeRowOneSection(req.body).then((done) => {
        res.status(200).json('done')
    }).catch((err) => {
        res.status(500).json('err')
    })
})

router.put('/removeItemRowTwo', CheckAdmin, (req, res) => {
    layout.removeRowTwoSection(req.body).then((done) => {
        res.status(200).json('done')
    }).catch((err) => {
        res.status(500).json('err')
    })
})

router.get('/searchProductSimple', CheckAdmin, (req, res) => {
    product.searchProductSimple(req.query.search).then((products) => {
        res.status(200).json(products)
    }).catch((err) => {
        res.status(500).json('err')
    })
})

router.post('/addSlider', CheckAdmin, uploader.extra.single('image'), (req, res) => {

    var details = JSON.parse(req.body.details)
    details.file = req.file
    details.uni_id = req.body.uni_id

    layout.addSlider(req.body.for, details).then((done) => {
        res.status(200).json('done')
    }).catch((err) => {
        res.status(500).json('err')
    })

})

router.put('/removeSlider', CheckAdmin, (req, res) => {
    var dir = `./uploads/${req.body.for}/${req.body.item.uni_id}`
    layout.removeSlider(req.body.for, req.body.item).then(() => {
        deleteFolder(dir, (data) => {
            if (data) {
                res.status(200).json("done")
            } else {
                res.status(200).json("done")
            }
        })
    }).catch(() => {
        res.status(500).json('err')
    })
})

router.post('/addBanner', CheckAdmin, uploader.banner.single('image'), (req, res) => {
    layout.addBanner(req.file, req.body.link).then(() => {
        res.status(200).json('done')
    }).catch((err) => {
        res.status(500).json('err')
    })
})

router.delete('/deleteBanner', CheckAdmin, (req, res) => {
    var dir = `./uploads/banner`

    layout.deleteBanner().then(() => {
        deleteFolder(dir, (data) => {
            if (data) {
                res.status(200).json("done")
            } else {
                res.status(200).json("done")
            }
        })
    }).catch((err) => {
        res.status(500).json('err')
    })
})

// Order

router.post('/addCupon', CheckAdmin, (req, res) => {
    req.body.code = req.body.code.toUpperCase()
    admin.addCupon(req.body).then(() => {
        res.status(200).json('done')
    }).catch(() => {
        res.status(500).json('err')
    })
})

router.get('/getCupons', CheckAdmin, (req, res) => {
    admin.getCupons().then((data) => {
        res.status(200).json(data)
    }).catch(() => {
        res.status(500).json('err')
    })
})

router.delete('/deleteCupon', CheckAdmin, (req, res) => {
    admin.deleteCupon(req.body.Id).then(() => {
        res.status(200).json('done')
    }).catch(() => {
        res.status(500).json('err')
    })
})

router.get('/getAllOrders', CheckAdmin, async (req, res) => {
    let total = await admin.getTotalOrders(req.query).catch(() => {
        res.status(500).json('err')
    })

    let orders = await admin.getAllOrders(req.query, 10).catch(() => {
        res.status(500).json('err')
    })

    if (Array.isArray(orders)) {
        res.status(200).json({
            total: total,
            orders: orders
        })
    }
})

router.get('/getOrderSpecific', CheckAdmin, async (req, res) => {
    let token = await tokenShipRocket().catch(() => {
        res.status(500).json('err')
    })

    let order_current = await admin.getOrderSpecific(req.query).catch(() => {
        res.status(500).json('err')
    })

    let track

    if (order_current) {
        track = await trackProduct(order_current.shipment_id, token).catch(() => {
            console.log('error track')
        })
    }

    let order = await orderStatusControl(track, order_current).catch(() => {
        res.status(500).json('err')
    })

    res.status(200).json(order)
})

router.put('/editOrder', CheckAdmin, (req, res) => {
    let updated
    if (!req.body.updated && req.body.OrderStatus === 'Delivered') {
        console.log("HI")
        updated = `${new Date().getMonth() + 1}-${new Date().getDate()}-${new Date().getFullYear()}`
    } else {
        updated = req.body.updated || null
    }

    admin.editOrder(req.body, updated).then(() => {
        res.status(200).json('done')
    }).catch(() => {
        res.status(500).json('err')
    })
})

// Vendor

router.get('/getVendors', CheckAdmin, async (req, res) => {
    var accept = false
    if (req.query.accept === 'true') {
        accept = true
    }

    let total = await admin.getTotalVendors(accept).catch(() => {
        res.status(500).json('err')
    })

    let vendors = await admin.getAllVendors(accept, req.query.skip, 10).catch(() => {
        res.status(500).json('err')
    })

    res.status(200).json({
        total: total,
        vendors: vendors
    })
})

router.put('/acceptVendor', CheckAdmin, async (req, res) => {
    let token = await tokenShipRocket().catch(() => {
        res.status(500).json('err')
    })

    addPickupAddress(req.body.address, token).then(() => {
        admin.acceptVendor(req.body.email).then(() => {
            res.status(200).json('done')
        }).catch(() => {
            res.status(500).json('err')
        })
    }).catch(() => {
        res.status(500).json('err')
    })
})

router.delete('/deleteVendor', CheckAdmin, (req, res) => {
    admin.deleteVendor(req.body.email).then(() => {
        admin.hideVendorProducts(req.body.vendorId).then(() => {
            res.status(200).json('done')
        }).catch(() => {
            res.status(200).json('done')
        })
    }).catch(() => {
        res.status(500).json('err')
    })
})

router.get('/getSpecificVendor', CheckAdmin, (req, res) => {
    if (req.query.vendorId.length === 24) {
        admin.getSpecificVendor(req.query.vendorId).then((data) => {
            if (data) {
                res.status(200).json(data)
            } else {
                res.status(404).json({
                    status: 404
                })
            }
        }).catch(() => {
            res.status(500).json('err')
        })
    } else {
        res.status(404).json({
            status: 404
        })
    }
})

router.get('/getOneVendorProducts', CheckAdmin, async (req, res) => {
    if (req.query.vendorId.length === 24) {
        let vendor = await admin.getSpecificVendor(req.query.vendorId).catch(() => {
            res.status(500).json('err')
        })

        if (vendor) {
            let total = await admin.getSpecificVendorProductsTotal(req.query).catch(() => {
                res.status(500).json('err')
            })

            let products = await admin.getSpecificVendorProducts(req.query, 10).catch(() => {
                res.status(500).json('err')
            })

            res.status(200).json({
                total: total,
                products: products
            })
        } else {
            res.status(404).json({
                status: 404
            })
        }
    } else {
        res.status(404).json({
            status: 404
        })
    }
})

export default router;
