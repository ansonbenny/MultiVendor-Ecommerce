import { MongoClient } from 'mongodb'
import * as dotenv from 'dotenv' 
dotenv.config()

let db = null

export default {
    connect: (done) => {
        const url = process.env.DB_URL
        const dbname = process.env.DB_NAME

        MongoClient.connect(url, (err, data) => {
            if (err) return done(err)
            db = data.db(dbname)
            done()
        })
    },
    get: () => {
        return db
    }
}
