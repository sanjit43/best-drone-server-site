const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
require('dotenv').config()
const cors = require('cors')
const port = process.env.PORT || 5000;


//Add midleware
app.use(cors())
app.use(express.json())

//Connect Mongo with server

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0bfuq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//Client connected
async function run() {
    try {
        await client.connect()
        const database = client.db('droneDB');
        const productCollection = database.collection('products')
        const ordersCollection = database.collection('orders')



        //POST API 
        app.post('/orders', async (req, res) => {
            const orders = req.body
            const result = await ordersCollection.insertOne(orders)
            console.log(result)
            res.json(result)
        })

        //GET Orders Api
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({})
            const result = await cursor.toArray();
            res.send(result)
        })
        //GET API
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find({})
            const result = await cursor.toArray();
            res.send(result)
        })
    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir)

//Check server connection

app.get('/', (req, res) => {
    res.send('Hellow World')
})

app.listen(port, () => {
    console.log('listening from port', port)
})