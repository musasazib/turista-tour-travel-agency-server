const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const cors = require("cors");
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iyv3j.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('turistaTravel');
        const servicesCollection = database.collection('services');
        const ordersCollection = database.collection('orders');

        // Get service API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        // Post service API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('Hit the post API', service);
            const result = await servicesCollection.insertOne(service);
            res.json(result);
        });


        // Post orders API
        app.post('/orders', async (req, res) => {
            const service = req.body;
            console.log('Hit the post API', service);
            const result = await ordersCollection.insertOne(service);
            res.json(result);
        });

         // Get order API
         app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        });

        // Get my booking API
        app.get("/myBooking/:email", async (req, res) => {
            const result = await ordersCollection.find({
              email: req.params.email,
            }).toArray();
            res.send(result);
          });

        // Delete API
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            // console.log('Delete success', result);
            res.json(result);
        });

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});