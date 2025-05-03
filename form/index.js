const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();

  
app.use(cors());
app.use(express.json());


const uri = process.env.MONGO_URI; 
const port = process.env.PORT;
const client = new MongoClient(uri);
const dbName = 'contactFormDB';

app.post('/contact', async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const contacts = db.collection('messages');

    const { name, email, subject, message } = req.body;

    const result = await contacts.insertOne({
      name,
      email,
      subject,
      message,
      createdAt: new Date()
    });

    res.status(200).json({ message: 'Message stored successfully', id: result.insertedId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to store message' });
  } finally {
    await client.close(); 
  }
});

app.listen(port, () => {
  console.log('Server is running on', port);
});
