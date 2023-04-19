import express, { response } from "express";
import product from "../Helpers/product.js";
import user from "../Helpers/user.js";
import jwt from 'jsonwebtoken'
import nodeMailer from "../Helpers/nodeMailer.js";
import getOTP from "../Helpers/getOTP.js";
import tokenShipRocket from "../ShipRocket/token.js";
import checkPincode from "../ShipRocket/checkPincode.js";
import ShipRocketOrder from "../ShipRocket/ShipRocketOrder.js";
import { fetchPayment, generateRazorpay, paymentVery, refundPayment } from "../Razorpay/razorpay.js";
import getInvoice from "../ShipRocket/getInvoice.js";
import trackProduct, { orderStatusControl } from "../ShipRocket/trackProduct.js";
import layout from "../Helpers/layout.js";
var router = express.Router()

function CheckUser(req, res, next) {
    const token = req.headers['x-access-token']
    try {
        let userTkn = jwt.verify(token, process.env.JWT_SECRET)

        user.getUser(userTkn._id).then((data) => {
            if (data) {
                req.body.userId = data._id.toString()
                req.query.userId = data._id.toString()
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

// Layout & Product 

router.get('/product/:slug/:proId', (req, res, next) => {
    if (req.params['proId'].length === 24) {
        product.getOneUserProduct(req.params.slug, req.params.proId).then(async (item) => {
            if (product !== null) {
                let similar = await product.getSimilarProduct(item.categorySlug).catch((err) => {
                    console.log(err)
                })
                res.status(200).json({
                    product: item,
                    similar: similar
                })
            } else {
                res.status(500).json('err')
            }
        }).catch((err) => {
            res.status(500).json('err')
        })
    } else {
        res.status(500).json('err')
    }
})

router.post('/addReview', CheckUser, (req, res) => {
    product.addReview(req.body).then(() => {
        res.status(200).json('done')
    }).catch(() => {
        res.status(500).json('err')
    })
})

router.get('/getReviews', async (req, res) => {
    let userReview = await product.getUserReview(req.query).catch(() => {
        res.status(500).json('err')
    })

    let total = await product.getTotalReviewCount(req.query.proId).catch(() => {
        res.status(500).json('err')
    })

    let stars = await product.getStarsRatingReviews(req.query.proId).catch(() => {
        res.status(500).json('err')
    })

    product.getAllReviews(req.query.proId, 0, 5).then((reviews) => {
        res.status(200).json({
            reviews: reviews,
            userReview: userReview,
            total: total,
            stars: stars
        })
    }).catch(() => {
        res.status(500).json('err')
    })
})

router.get('/loadMoreReviews', async (req, res) => {
    let total = await product.getTotalReviewCount(req.query.proId).catch(() => {
        res.status(500).json('err')
    })

    let reviews = await product.getAllReviews(req.query.proId, parseInt(req.query.skip), 5).catch(() => {
        res.status(500).json('err')
    })

    if (reviews && reviews.length !== 0) {
        res.status(200).json({
            reviews: reviews,
            total: total
        })
    } else {
        res.status(500).json('err')
    }
})

router.delete('/deleteReview', CheckUser, (req, res) => {
    product.deleteReview(req.body).then(() => {
        res.status(200).json('done')
    }).catch(() => {
        res.status(500).json('err')
    })
})

router.get('/getCategoryProducts/:category', async (req, res) => {
    let categories = await product.getCategories().catch(() => {
        res.status(500).json('err')
    })

    if (categories === undefined && categories === null) {
        categories = []
    }

    var details = {
        category: req.params.category,
        sort: req.query.sort,
        max: parseInt(req.query.max),
        min: parseInt(req.query.min)
    }

    let proCount = await product.getCategoryProductCount(details).catch((err) => {
        console.log(err)
    })

    var response = {
        products: [],
        pagination: false,
        totalPage: 1,
        currentPage: 1,
        pages: [],
        showNot: false,
        categories: categories
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

    product.getCategoryProduct(details, skip, limit).then((products) => {
        response.products = products
        res.status(200).json(response)
    }).catch((err) => {
        res.status(500).json('err')
    })

})

router.get('/searchProduct/', async (req, res) => {
    let categories = await product.getCategories().catch(() => {
        res.status(500).json('err')
    })

    if (categories === undefined && categories === null) {
        categories = []
    }

    var details = {
        search: req.query.search,
        sort: req.query.sort,
        max: parseInt(req.query.max),
        min: parseInt(req.query.min),
        category: req.query.category
    }

    let proCount = await product.getSearchProductCount(details).catch((err) => {
        console.log(err)
    })

    var response = {
        products: [],
        pagination: false,
        totalPage: 1,
        currentPage: 1,
        pages: [],
        showNot: false,
        categories: categories
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

    product.getSearchProduct(details, skip, limit).then((products) => {
        response.products = products
        res.status(200).json(response)
    }).catch((err) => {
        res.status(500).json('err')
    })

})

router.get('/getHeaderCategories/', async (req, res) => {
    let categories = await product.getHeaderCategories().catch((err) => {
        console.log(err)
    })
    product.getCategories().then((allCategories) => {
        res.status(200).json({
            allCategories: allCategories,
            categories: categories
        })
    }).catch((err) => {
        res.status(500).json('err')
    })
})

router.get('/getAllCategories', (req, res) => {
    product.getCategories().then((categories) => {
        res.status(200).json(categories)
    }).catch((err) => {
        res.status(500).json('err')
    })
})

router.get('/getLayouts', async (req, res) => {
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

// Account 

router.post('/sentOtpSignUp', (req, res) => {
    req.body.email = req.body.email.toLowerCase()
    user.CheckUser(req.body).then((data) => {
        if (data.found) {
            res.status(200).json({ found: true })
        } else {
            user.checkOtp(req.body, 'signup', 'user').then(async (data) => {
                if (data) {
                    let mailDetails = {
                        from: process.env.MAIL_FROM,
                        to: req.body.email,
                        subject: 'Test mail',
                        text: `your verification code is ${data.otp}`
                    }

                    nodeMailer.sendMail(mailDetails).then((done) => {
                        res.status(200).json({ found: false, mail: true })
                    }).catch(() => {
                        res.status(200).json({ found: false, mail: false })
                    })
                } else {
                    getOTP((otp) => {
                        if (otp) {
                            user.insertOtp(req.body.email, otp, 'signup', 'user').then(async (done) => {

                                let mailDetails = {
                                    from: process.env.MAIL_FROM,
                                    to: req.body.email,
                                    subject: 'Test mail',
                                    text: `your verification code is ${otp}`
                                }

                                nodeMailer.sendMail(mailDetails).then((done) => {
                                    res.status(200).json({ found: false, mail: true })
                                }).catch(() => {
                                    res.status(200).json({ found: false, mail: false })
                                })
                            }).catch((err) => {
                                res.status(500).json('err')
                            })
                        }
                    })

                }
            }).catch((err) => {
                res.status(500).json('err')
            })
        }
    }).catch((err) => {
        res.status(500).json('err')
    })
})

router.post('/resentOtpSignUp', (req, res) => {
    req.body.email = req.body.email.toLowerCase()
    user.checkOtp(req.body, 'signup', 'user').then(async (data) => {
        if (data) {
            let mailDetails = {
                from: process.env.MAIL_FROM,
                to: req.body.email,
                subject: 'Test mail',
                text: `your verification code is ${data.otp}`
            }

            nodeMailer.sendMail(mailDetails).then((done) => {
                res.status(200).json('done')
            }).catch(() => {
                res.status(500).json('err')
            })
        } else {
            getOTP((otp) => {
                if (otp) {
                    user.insertOtp(req.body.email, otp, 'signup', 'user').then(async (done) => {

                        let mailDetails = {
                            from: process.env.MAIL_FROM,
                            to: req.body.email,
                            subject: 'Test mail',
                            text: `your verification code is ${otp}`
                        }

                        nodeMailer.sendMail(mailDetails).then((done) => {
                            res.status(200).json('done')
                        }).catch(() => {
                            res.status(500).json('err')
                        })
                    }).catch((err) => {
                        res.status(500).json('err')
                    })
                }
            })

        }
    }).catch((err) => {
        res.status(500).json('err')
    })
})

router.post('/signup', (req, res) => {
    req.body.email = req.body.email.toLowerCase()
    user.CheckUser(req.body).then((data) => {
        if (data.found) {
            res.status(200).json({ found: true })
        } else {
            user.checkOtp(req.body, 'signup', 'user').then(async (data) => {
                if (data) {
                    user.matchOtp(req.body, 'signup', 'user').then((data) => {
                        if (data) {
                            user.CreateUser(req.body).then((response) => {
                                if (response) {
                                    res.status(200).json({ found: false, status: true, user: true })
                                } else {
                                    res.status(200).json({ found: false, status: true, user: false })
                                }
                            }).catch((err) => {
                                res.status(500).json('err')
                            })
                        } else {
                            res.status(200).json({ found: false, status: false })
                        }
                    }).catch((err) => {
                        res.status(500).json('err')
                    })

                } else {
                    res.status(200).json({ found: false, resent: true })
                }
            }).catch((err) => {
                res.status(500).json('err')
            })
        }
    }).catch((err) => {
        res.status(500).json('err')
    })
})

router.post('/login', (req, res) => {
    req.body.email = req.body.email.toLowerCase()

    user.LoginUser(req.body).then((data) => {
        if (data.login) {
            const { user } = data

            const expire = 60 * 60 * 24

            const token = jwt.sign({
                email: user.email,
                _id: user._id
            }, process.env.JWT_SECRET, {
                expiresIn: expire
            })

            res.status(200).json({ user: token })
        } else {
            res.status(200).json({ user: undefined })
        }
    }).catch((err) => {
        res.status(500).json('err')
    })
})

router.post('/sentOtpForgot', (req, res) => {
    req.body.email = req.body.email.toLowerCase()
    user.CheckUser(req.body).then((data) => {
        if (data.found) {
            user.checkOtp(req.body, 'forgot', 'user').then(async (data) => {
                if (data) {
                    let mailDetails = {
                        from: process.env.MAIL_FROM,
                        to: req.body.email,
                        subject: 'Test mail',
                        text: `your verification code is ${data.otp} for forgot password`
                    }

                    nodeMailer.sendMail(mailDetails).then((done) => {
                        res.status(200).json({ found: true, mail: true })
                    }).catch(() => {
                        res.status(200).json({ found: true, mail: false })
                    })
                } else {
                    getOTP((otp) => {
                        if (otp) {
                            user.insertOtp(req.body.email, otp, 'forgot', 'user').then(async (done) => {

                                let mailDetails = {
                                    from: process.env.MAIL_FROM,
                                    to: req.body.email,
                                    subject: 'Test mail',
                                    text: `your verification code is ${otp} for forgot password`
                                }

                                nodeMailer.sendMail(mailDetails).then((done) => {
                                    res.status(200).json({ found: true, mail: true })
                                }).catch(() => {
                                    res.status(200).json({ found: true, mail: false })
                                })
                            }).catch((err) => {
                                res.status(500).json('err')
                            })
                        }
                    })

                }
            }).catch((err) => {
                res.status(500).json('err')
            })
        } else {
            res.status(200).json({
                found: false
            })
        }
    }).catch((err) => {
        res.status(500).json('err')
    })
})

router.post('/resentOtpForgot', (req, res) => {
    req.body.email = req.body.email.toLowerCase()
    user.CheckUser(req.body).then((data) => {
        if (data.found) {
            user.checkOtp(req.body, 'forgot', 'user').then(async (data) => {
                if (data) {
                    let mailDetails = {
                        from: process.env.MAIL_FROM,
                        to: req.body.email,
                        subject: 'Test mail',
                        text: `your verification code is ${data.otp} for forgot password`
                    }

                    nodeMailer.sendMail(mailDetails).then((done) => {
                        res.status(200).json('done')
                    }).catch(() => {
                        res.status(500).json('err')
                    })
                } else {
                    getOTP((otp) => {
                        if (otp) {
                            user.insertOtp(req.body.email, otp, 'forgot', 'user').then(async (done) => {

                                let mailDetails = {
                                    from: process.env.MAIL_FROM,
                                    to: req.body.email,
                                    subject: 'Test mail',
                                    text: `your verification code is ${otp} for forgot password`
                                }

                                nodeMailer.sendMail(mailDetails).then((done) => {
                                    res.status(200).json('done')
                                }).catch(() => {
                                    res.status(500).json('err')
                                })
                            }).catch((err) => {
                                res.status(500).json('err')
                            })
                        }
                    })

                }
            }).catch((err) => {
                res.status(500).json('err')
            })
        } else {
            res.status(500).json('err')
        }
    }).catch(() => {
        res.status(500).json('err')
    })
})

router.put('/forgotPassword', (req, res) => {
    user.checkOtp(req.body, 'forgot', 'user').then(async (data) => {
        if (data) {
            user.matchOtp(req.body, 'forgot', 'user').then((data) => {
                if (data) {
                    user.forgotPassword(req.body).then(() => {
                        res.status(200).json({ status: true })
                    }).catch(() => {
                        res.status(500).json('err')
                    })
                } else {
                    res.status(200).json({ status: false })
                }
            }).catch((err) => {
                res.status(500).json('err')
            })

        } else {
            res.status(200).json({ resent: true })
        }
    }).catch((err) => {
        res.status(500).json('err')
    })
})

router.get('/getUserData', (req, res) => {
    const token = req.headers['x-access-token']

    try {
        let userTkn = jwt.verify(token, process.env.JWT_SECRET)

        user.getUser(userTkn._id).then((data) => {
            if (data) {
                data.status = true
                data.password = null
                res.status(200).json(data)
            } else {
                res.status(200).json({ status: false })
            }
        }).catch((err) => {
            res.status(500).json('err')
        })
    } catch (err) {
        res.status(200).json({ status: false })
    }
})

router.put('/changeUserInfo', CheckUser, (req, res) => {
    user.changeUserInfo(req.body).then((response) => {
        res.status(200).json(response)
    }).catch(() => {
        res.status(500).json('err')
    })
})

router.put('/changeEmail', CheckUser, (req, res) => {
    req.body.newEmail = req.body.newEmail.toLowerCase()
    user.changeEmail(req.body).then((response) => {
        res.status(200).json(response)
    }).catch(() => {
        res.status(500).json('err')
    })
})

router.put('/changePassword', CheckUser, (req, res) => {
    user.changePassword(req.body).then((response) => {
        res.status(200).json(response)
    }).catch(() => {
        res.status(500).json('err')
    })
})

router.get('/getAllAddress', CheckUser, (req, res) => {
    user.getAllAddress(req.body.userId).then((address) => [
        res.status(200).json(address)
    ]).catch(() => {
        res.status(500).json("err")
    })
})

router.put('/editAddress', CheckUser, (req, res) => {
    user.editAddress(req.body).then(() => {
        res.status(200).json('done')
    }).catch(() => {
        res.status(500).json('error')
    })
})

router.post('/addAddress', CheckUser, (req, res) => {
    let { userId } = req.body
    user.AddAddress(req.body, userId).then(() => {
        res.status(200).json('done')
    }).catch(() => {
        res.status(500).json('error')
    })
})

router.delete('/deleteAddress', CheckUser, (req, res) => {
    user.deleteAddress(req.body).then(() => {
        res.status(200).json("done")
    }).catch(() => {
        res.status(500).json('error')
    })
})

// Cart & Wishlist 

router.post('/addToCart', CheckUser, (req, res) => {
    user.addToCart(req.body).then((data) => {
        res.status(200).json(data)
    }).catch((err) => {
        res.status(500).json('err')
    })
})

router.post('/checkItemInCart', CheckUser, (req, res) => {
    user.checkItemInCart(req.body).then((data) => {
        res.status(200).json(data)
    }).catch((err) => {
        res.status(500).json('err')
    })
})

router.get('/getCartItems', CheckUser, (req, res) => {
    user.getCartItems(req.query.userId).then((response) => {
        res.status(200).json(response)
    }).catch((err) => {
        res.status(500).json('err')
    })
})

router.post('/addToWishlist', CheckUser, (req, res) => {
    user.addToWishlist(req.body).then((done) => {
        res.status(200).json('done')
    }).catch((err) => {
        res.status(500).json('err')
    })
})

router.get('/getWishlistItems', CheckUser, (req, res) => {
    user.getWishlistItems(req.query.userId).then((result) => {
        res.status(200).json(result)
    }).catch((err) => {
        res.status(500).json('err')
    })
})

router.put('/removeItemWihslist', CheckUser, (req, res) => {
    user.removeItemWihslist(req.body).then((done) => {
        res.status(200).json("done")
    }).catch(() => {
        res.status(500).json('err')
    })
})

router.put('/removeItemCart', CheckUser, (req, res) => {
    user.removeItemCart(req.body).then((done) => {
        res.status(200).json("done")
    }).catch(() => {
        res.status(500).json('err')
    })
})

router.put('/changeQuantityCart', CheckUser, (req, res) => {
    user.changeQuantityCart(req.body).then(() => {
        res.status(200).json('done')
    }).catch(() => {
        res.status(500).json('err')
    })
})

router.get('/getCartTotalPrice', (req, res) => {
    user.getCartTotalPrice(req.query.userId).then((amount) => {
        res.status(200).json(amount)
    }).catch((err) => {
        res.status(500).json('err')
    })
})

// Order 

router.get('/getCartTotalPriceCheckout', CheckUser, async (req, res) => {
    let address = await user.getAllAddress(req.query.userId).catch(() => {
        console.log("address get error")
    })

    user.getCartTotalPriceCheckout(req.query.userId, req.query.discount).then((amount) => {
        res.status(200).json({
            key: process.env.RAZORPAY_ID,
            amount: amount,
            address: address || { saved: [] }
        })
    }).catch((err) => {
        res.status(500).json('err')
    })
})

router.get('/getTotalPriceProduct', CheckUser, async (req, res) => {
    let details = req.query

    let address = await user.getAllAddress(req.query.userId).catch(() => {
        console.log("address get error")
    })

    user.getTotalPriceProduct(details).then((total) => {
        res.status(200).json({
            key: process.env.RAZORPAY_ID,
            amount: total,
            address: address || { saved: [] }
        })
    }).catch(() => {
        res.status(500).json('err')
    })
})

router.get('/findCupon', (req, res) => {
    product.findCupon(req.query.code.toUpperCase()).then((data) => {
        res.status(200).json(data)
    }).catch(() => {
        res.status(500).json('err')
    })
})

router.post('/checkPincode', async (req, res) => {
    let token = await tokenShipRocket().catch(() => {
        res.status(500).json('err')
    })

    const parameterGenerator = new URLSearchParams({
        pickup_postcode: 110001,
        delivery_postcode: req.body.pin,
        weight: 2,
        cod: 1
    });

    const parameter = parameterGenerator.toString();

    checkPincode(parameter, token).then((data) => {
        res.status(200).json(data)
    }).catch(() => {
        res.status(500).json('err')
    })
})

router.post('/createRazorpayPayment', CheckUser, (req, res) => {
    generateRazorpay(Math.trunc(req.body.totalAmount * 100), (razOrderId) => {
        if (razOrderId) {
            res.status(200).json({
                razOrderId: razOrderId,
                userId: req.body.userId,
                totalAmount: Math.trunc(req.body.totalAmount * 100)
            })
        } else {
            res.status(500).json('err')
        }
    })
})

router.post('/order-item-razorpay', async (req, res) => {
    let token = await tokenShipRocket().catch(() => {
        res.status(500).json('err')
    })

    let OrderId = `${Date.now() + Math.random()}`

    let { razorpayRes, order } = req.body

    let details = {
        name: order.name,
        number: order.number,
        pin: order.pin,
        locality: order.locality,
        address: order.address,
        city: order.city,
        state: order.state,
        payType: order.payType,
        email: order.email
    }

    let AddAddress = await user.AddAddress(details, razorpayRes.userId).catch(() => {
        console.log("Address Add Failed")
    })

    let payStatus = paymentVery(razorpayRes).catch(() => {
        res.status(500).json('payment')
    })

    if (payStatus) {
        var extraDiscount = 0
        fetchPayment(razorpayRes.razorpay_payment_id, async (data) => {

            if (data) {
                var totalAMT = order.totalAmount * 100
                extraDiscount = totalAMT - data
                extraDiscount = Math.trunc(extraDiscount / totalAMT * 100)
            }

            if (order['order'].type === 'cart') {

                let orderItems = await user.getCartProduct4Order({
                    userId: razorpayRes.userId,
                    payment_id: razorpayRes.razorpay_payment_id
                }, order, details, OrderId, extraDiscount).catch(() => {
                    res.status(500).json('err')
                })

                orderItems.order = await ShipRocketOrder('Prepaid', orderItems.order, token).catch(() => {
                    res.status(500).json('err')
                })

                user.createOrder(orderItems).then(() => {
                    user.emtyCart(razorpayRes.userId).then(() => {
                        res.status(200).json('done')
                    }).catch(() => {
                        res.status(500).json('err')
                    })
                }).catch(() => {
                    console.log("error")
                    res.status(500).json('err')
                })
            } else {
                let orderItems = await user.getBuyProduct4Order({
                    userId: razorpayRes.userId,
                    payment_id: razorpayRes.razorpay_payment_id
                }, order, details, OrderId, extraDiscount).catch(() => {
                    res.status(500).json('err')
                })

                orderItems.order = await ShipRocketOrder('Prepaid', orderItems.order, token).catch(() => {
                    res.status(500).json('err')
                })

                user.createOrder(orderItems).then(() => {
                    res.status(200).json('done')
                }).catch(() => {
                    console.log("error")
                    res.status(500).json('err')
                })
            }
        })
    } else {
        res.status(500).json('payment')
    }
})

router.post('/order-item-cod', async (req, res) => {
    let token = await tokenShipRocket().catch(() => {
        res.status(500).json('err')
    })

    let OrderId = `${Date.now() + Math.random()}`

    let { userId, order } = req.body

    let details = {
        name: order.name,
        number: order.number,
        pin: order.pin,
        locality: order.locality,
        address: order.address,
        city: order.city,
        state: order.state,
        payType: order.payType,
        email: order.email
    }

    let AddAddress = await user.AddAddress(details, userId).catch(() => {
        console.log("Address Add Failed")
    })

    var extraDiscount = 0

    if (order['order'].type === 'cart') {

        let orderItems = await user.getCartProduct4Order({
            userId: userId,
            payment_id: OrderId
        }, order, details, OrderId, extraDiscount).catch(() => {
            res.status(500).json('err')
        })

        orderItems.order = await ShipRocketOrder('Postpaid', orderItems.order, token).catch(() => {
            res.status(500).json('err')
        })

        user.createOrder(orderItems).then(() => {
            user.emtyCart(userId).then(() => {
                res.status(200).json('done')
            }).catch(() => {
                res.status(500).json('err')
            })
        }).catch(() => {
            console.log("error")
            res.status(500).json('err')
        })
    } else {
        let orderItems = await user.getBuyProduct4Order({
            userId: userId,
            payment_id: OrderId
        }, order, details, OrderId, extraDiscount).catch(() => {
            res.status(500).json('err')
        })

        orderItems.order = await ShipRocketOrder('Postpaid', orderItems.order, token).catch(() => {
            res.status(500).json('err')
        })

        user.createOrder(orderItems).then(() => {
            res.status(200).json('done')
        }).catch(() => {
            console.log("error")
            res.status(500).json('err')
        })
    }
})

router.get('/getOrders', CheckUser, async (req, res) => {
    let total = await user.getOrdersTotal(req.query).catch(() => {
        res.status(500).json('err')
    })

    let orders = await user.getOrders(req.query, 10).catch(() => {
        res.status(500).json('err')
    })

    res.status(200).json({
        total: total,
        orders: orders
    })
})

router.get('/getSpecificOrder', CheckUser, async (req, res) => {
    let token = await tokenShipRocket().catch(() => {
        res.status(500).json('err')
    })

    let order_current = await user.getSpecificOrder(req.query).catch(() => {
        res.status(500).json('err')
    })

    let invoice

    let track

    if (order_current) {
        invoice = await getInvoice(order_current.order_id_shiprocket, token).catch(() => {
            console.log('error invoice')
        })

        track = await trackProduct(order_current.shipment_id, token).catch(() => {
            console.log('error track')
        })

    }

    let order = await orderStatusControl(track, order_current).catch(() => {
        res.status(500).json('err')
    })

    if (order) {
        if (order.return === "true") {
            let updated = order.updated
            if (updated) {
                let returnEnd = new Date(updated)
                returnEnd.setDate(returnEnd.getDate() + 7)
                returnEnd = returnEnd.setHours(0, 0, 0, 0);

                let currDate = `${new Date().getMonth() + 1}-${new Date().getDate()}-${new Date().getFullYear()}`
                currDate = new Date(currDate)
                currDate = currDate.setHours(0, 0, 0, 0);

                if (currDate >= returnEnd) {
                    console.log(returnEnd)
                    order.returnAvailable = false
                } else {
                    order.returnAvailable = true
                }
            } else {
                order.returnAvailable = false
            }
        } else {
            order.returnAvailable = false
        }
    }


    if (order && invoice) {
        order.invoice = invoice
    } else {
        if (order) {
            order.invoice = {
                is_invoice_created: false
            }
        }
    }

    res.status(200).json(order)
})

router.put('/cancelOrder', CheckUser, (req, res) => {
    const { payType } = req.body
    payType.toLowerCase()

    user.cancelOrder(req.body).then(async () => {
        nodeMailer.sendMail({
            from: process.env.MAIL_FROM,
            to: process.env.ADMIN_MAIL,
            subject: 'PRODUCT CANCELLED',
            text: `PRODUCT CANCELLED SECRET ORDER ID ${req.body.secretOrderId}`
        }).catch(() => {
            console.log('MAIL FAIL')
        })

        if (payType === 'online') {

            refundPayment(req.body).then(() => {
                console.log("REFUND")
                res.status(200).json('done')
            }).catch(() => {
                console.log("ERR")
                res.status(200).json('done')
            })

        } else {
            res.status(200).json('done')
        }
    }).catch(() => {
        res.status(500).json('err')
    })
})

router.post('/returnOrder', CheckUser, (req, res) => {
    user.returnOrder(req.body).then(async () => {
        nodeMailer.sendMail({
            from: process.env.MAIL_FROM,
            to: process.env.ADMIN_MAIL,
            subject: 'PRODUCT RETURN',
            text: `${req.body.name} PRODUCT RETURN REQUESTED SECRET ORDER ID ${req.body.secretOrderId}`
        }).catch(() => {
            console.log('MAIL FAIL')
        })
        res.status(200).json('done')
    }).catch(() => {
        res.status(500).json('err')
    })
})

export default router;