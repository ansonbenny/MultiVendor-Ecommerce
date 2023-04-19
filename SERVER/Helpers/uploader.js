import multer from 'multer'
import fs from 'fs'

const productsStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        var dir = `./uploads/product/${req.body.uni_id_1}${req.body.uni_id_2}`;

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {
                recursive: true
            });
        }
        cb(null, `./uploads/product/${req.body.uni_id_1}${req.body.uni_id_2}`);
    },

    filename: function (req, file, cb) {
        cb(null, req.body.uni_id_1 + file.originalname);
    }
});

const categoryStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        var dir = `./uploads/category/${req.body.uni_id1}${req.body.uni_id2}`;

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {
                recursive: true
            });
        }
        cb(null, `./uploads/category/${req.body.uni_id1}${req.body.uni_id2}`);
    },

    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const extraStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        var dir = `./uploads/${req.body.for}/${req.body.uni_id}`;

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {
                recursive: true
            });
        }
        cb(null, `./uploads/${req.body.for}/${req.body.uni_id}`);
    },

    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const bannerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        var dir = `./uploads/banner`;

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {
                recursive: true
            });
        }
        cb(null, `./uploads/banner`);
    },

    filename: function (req, file, cb) {
        cb(null, `${req.body.uni_id}${file.originalname}`);
    }
});

export default {
    products: multer({
        storage: productsStorage
    }),
    categories: multer({
        storage: categoryStorage
    }),
    extra: multer({
        storage: extraStorage
    }),
    banner: multer({
        storage: bannerStorage
    })
}