const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// midleware

app.use(cors());
app.use(express.json());

// connecte
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q8coo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db('travel-bd');
        const serviceCollection = database.collection('service');
        const orderCollection = database.collection('orders');

        app.post('/orders',async (req, res) => {
            const newOrder = req.body;
          const result= await orderCollection.insertOne(newOrder)
            res.json(result)

        })
        // total order API
        app.get('/totalOrder',async(req,res)=>{
            const allOrder = orderCollection.find({});
            const result =await allOrder.toArray();
            res.send(result);
        })

        // order delete API
        app.delete('/totalOrder/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        })
    

    // 
        app.get('/orders',async (req, res) => {
            const cursor = orderCollection.find({email: req.query.email})
            const order= await cursor.toArray();
           res.send(order);
           })
        
        // POST API
        app.post('/services', async (req, res) => {
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService);
            res.json(result);
        });

          // get service
          app.get('/services', async(req,res)=>{
            const coursor = serviceCollection.find({});
            const service = await coursor.toArray();
            res.send(service);
        })

        // get service id 
        app.get('/services/:id', async(req,res)=>{
            const id =req.params.id;
            const query = {_id: ObjectId(id)}
            const service = await serviceCollection.findOne(query);
            res.json(service);
        })

    }
    finally{
    //    await client.close();
    }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('database connected')
})

app.listen(port , ()=>{
    console.log('lissen');
})
