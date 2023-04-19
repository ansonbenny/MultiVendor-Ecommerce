import express from "express";
import vendor from "../Helpers/vendor.js";
import getOTP from '../Helpers/getOTP.js';
import nodeMailer from '../Helpers/nodeMailer.js'
import product from "../Helpers/product.js";
import jwt from "jsonwebtoken";
import uploader from "../Helpers/uploader.js";
import slugify from 'slug-generator'
import deleteFile from '../Helpers/deleteFile.js'
import deleteFolder from "../Helpers/deleteFolder.js";
import trackProduct, { orderStatusControl } from "../ShipRocket/trackProduct.js";
import tokenShipRocket from "../ShipRocket/token.js";

var router = express.Router()

function CheckVendor(req, res, next) {
    const token = req.headers['x-access-token']
    try {
        let vendorTkn = jwt.verify(token, process.env.JWT_SECRET)

        vendor.getVendor(vendorTkn._id).then((data) => {
            if (data) {
                req.body.vendorId = data._id.toString()
                req.query.vendorId = data._id.toString()
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

router.get('/getDashboard', CheckVendor, async (req, res) => {
    let total = await vendor.getDashboardTotal(req.body.vendorId).catch(() => {
        res.status(500).json('err')
    })

    let orders = await vendor.getAllOrders({ search: '', skip: 0, vendorId: req.body.vendorId }, 10).catch(() => {
        res.status(500).json('err')
    })

    res.status(200).json({
        total: total,
        Orders: orders,
        loaded: true
    })
})

// Account

router.post('/register', (req, res) => {
    req.body.email = req.body.email.toLowerCase()
    req.body.accept = false
    let date = new Date()
    req.body.date = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
    vendor.addVendor(req.body).then((data) => {
        res.status(200).json(data)
    }).catch(() => {
        res.status(500).json('err')
    })
})

router.post('/sentOtpLogin', (req, res) => {
    req.body.email = req.body.email.toLowerCase()
    vendor.checkVendorAccept(req.body.email).then((accept) => {
        if (accept) {
            vendor.checkOtp(req.body.email, 'login', 'vendor').then((oldOtp) => {
                if (oldOtp) {
                    let mailDetails = {
                        from: process.env.MAIL_FROM,
                        to: req.body.email,
                        subject: 'Vendor Login OTP',
                        text: `your verification code is ${oldOtp.otp}`
                    }

                    nodeMailer.sendMail(mailDetails).then((done) => {
                        res.status(200).json({ mail: true })
                    }).catch(() => {
                        res.status(200).json({ mail: false })
                    })
                } else {
                    getOTP((otp) => {
                        if (otp) {
                            vendor.insertOtp(req.body.email, otp, 'login', 'vendor').then(async (done) => {
                                let mailDetails = {
                                    from: process.env.MAIL_FROM,
                                    to: req.body.email,
                                    subject: 'Vendor Login OTP',
                                    text: `your verification code is ${otp}`
                                }

                                nodeMailer.sendMail(mailDetails).then((done) => {
                                    res.status(200).json({ mail: true })
                                }).catch(() => {
                                    res.status(200).json({ mail: false })
                                })
                            }).catch((err) => {
                                res.status(500).json('err')
                            })
                        }
                    })
                }
            }).catch(() => {
                res.status(500).json('err')
            })
        } else {
            res.status(200).json({
                request: true
            })
        }
    }).catch(() => {
        res.status(500).json('err')
    })
})

router.post('/login', (req, res) => {
    req.body.email = req.body.email.toLowerCase()
    vendor.getVendorAccepted(req.body.email).then((vendorAccepted) => {
        if (vendorAccepted) {
            vendor.checkOtp(req.body.email, 'login', 'vendor').then((oldOtp) => {
                if (oldOtp) {
                    vendor.matchOtp(req.body, 'login', 'vendor').then((data) => {
                        if (data) {
                            const expire = 60 * 60 * 24

                            const token = jwt.sign({
                                email: vendorAccepted.email,
                                _id: vendorAccepted._id
                            }, process.env.JWT_SECRET, {
                                expiresIn: expire
                            })
                            res.status(200).json({
                                status: true,
                                token: token
                            })
                        } else {
                            res.status(200).json({
                                status: false
                            })
                        }
                    })
                } else {
                    res.status(200).json({
                        resent: true
                    })
                }
            }).catch(() => {
                res.status(500).json('err')
            })
        } else {
            res.status(200).json({
                request: true
            })
        }
    }).catch(() => {
        res.status(500).json('err')
    })
})

router.get('/getVendorData', (req, res) => {
    let token = req.headers['x-access-token']
    try {
        let vendorTkn = jwt.verify(token, process.env.JWT_SECRET)
        vendor.getVendor(vendorTkn._id).then((vendorData) => {
            if (vendorData) {
                vendorData.status = true
                res.status(200).json(vendorData)
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

router.put('/updateUserDetails', CheckVendor, (req, res) => {
    req.body.email = req.body.email.toLowerCase()
    if (req.body.vendorIdCheck === req.body.vendorId) {
        vendor.updateUserDetails(req.body).then((data) => {
            res.status(200).json(data)
        }).catch(() => {
            res.status(500).json('err')
        })
    } else {
        res.status(500).json('err')
    }
})

router.put('/updateBankAccount', CheckVendor, (req, res) => {
    if (req.body.vendorIdCheck === req.body.vendorId) {
        vendor.updateBankAccount(req.body).then(() => {
            res.status(200).json('done')
        }).catch(() => {
            res.status(500).json("err")
        })
    } else {
        res.status(500).json("Err")
    }
})

// Product

router.get('/getCategories', (req, res) => [
    product.getCategories().then((categories) => {
        res.status(200).json(categories)
    }).catch(() => {
        res.status(500).json('err')
    })
])

router.post('/addProduct', CheckVendor, uploader.products.array("images", 20), (req, res, next) => {
    req.body.vendorId = req.query.vendorId
    req.body.vendor = true
    req.body.pickup_location = req.query.vendorId
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

    vendor.addProduct(req.body).then((done) => {
        res.status(200).json(done)
    }).catch((err) => {
        res.status(500).json(err)
    })
})

router.get('/getProducts', CheckVendor, async (req, res, next) => {
    if (req.query.search === undefined) {
        let proCount = await vendor.getProductVendorCount(req.query.vendorId).catch((err) => {
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

        vendor.getVendorProducts(skip, limit, req.query.vendorId).then((data) => {
            response.data = data
            res.status(200).json(response)
        }).catch((err) => {
            res.status(500).json(err)
        })
    } else {
        let allProductCount = await vendor.getProductVendorCount(req.query.vendorId).catch((err) => {
            console.log(err)
        })

        let proCount = await vendor.getProductCountVendorSearch(req.query.search, req.query.vendorId).catch((err) => {
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

        vendor.getVendorProductsSearch(req.query.search, skip, limit, req.query.vendorId).then((data) => {
            response.data = data
            res.status(200).json(response)
        }).catch((err) => {
            res.status(500).json(err)
        })
    }
})

router.get('/getOneProduct/:prodId', CheckVendor, (req, res) => {
    if (req.params['prodId'].length === 24) {
        vendor.getOneProduct(req.body.vendorId, req.params.prodId).then((product) => {
            res.status(200).json(product)
        }).catch(() => {
            res.status(500).json('err')
        })
    } else {
        res.status(500).json('err')
    }
})

router.put('/editProduct/:id', CheckVendor, uploader.products.array("images", 20), (req, res) => {
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

        data.pickup_location = req.query.vendorId
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

        vendor.updateProduct(data, req.query.vendorId).then((succ) => {
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

router.delete('/deleteProduct', CheckVendor, (req, res) => {
    var dir = `./uploads/product/${req.body.folderId}`
    if (req.body['proId'].length === 24) {
        vendor.deleteProduct(req.body).then(() => {
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

// Order 

router.get('/getAllOrders', CheckVendor, async (req, res) => {
    let total = await vendor.getTotalOrders(req.query).catch(() => {
        res.status(500).json('err')
    })

    let orders = await vendor.getAllOrders(req.query, 10).catch(() => {
        res.status(500).json('err')
    })

    if (Array.isArray(orders)) {
        res.status(200).json({
            total: total,
            orders: orders
        })
    }
})

router.get('/getOrderSpecific', CheckVendor, async (req, res) => {
    let token = await tokenShipRocket().catch(() => {
        res.status(500).json('err')
    })

    let order_current = await vendor.getOrderSpecific(req.query).catch(() => {
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

export default router