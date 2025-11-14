const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const app = express();

app.use(bodyParser.json());
app.use(cors());

// connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// define clothing item scheme
const itemSchema = new mongoose.Schema({
    name: String,
    category: String,
    image: Buffer,
    imageURL: String
});

const Item = mongoose.model('Item', itemSchema);

// define item saving process
app.post('/api/items', async (req, res) => {
    const { name, category, image, imageURL } = req.body;
    
    try {
        let imageBuffer = null;
        if (image && image.includes(',')) {
            imageBuffer = Buffer.from(image.split(',')[1], 'base64');
        }

        const newItem = new Item({
            name,
            category,
            image: imageBuffer,
            imageURL
        });

        const storedItem = await newItem.save();
        // Return item without image buffer
        const responseItem = storedItem.toObject();
        delete responseItem.image;
        res.status(201).json(responseItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// define item getting process
app.get('/api/items', async (req, res) => {
    try {
        const { category } = req.query;
        const query = category ? { category: category.charAt(0).toUpperCase() + category.slice(1) } : {};
        const items = await Item.find(query).select('-image'); // Exclude image buffer from response
        res.json(items);
    } catch(err) {
        res.status(400).json({ message: err.message });
    }
});

// define item getting by ID
app.get('/api/items/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id).select('-image');
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json(item);
    } catch(err) {
        res.status(400).json({ message: err.message });
    }
});

// define item deleting process
app.delete('/api/items/:id', async (req, res) => {
    const itemId = req.params.id;

    try {
        const itemToDelete = await Item.findByIdAndDelete(itemId);
        if (!itemToDelete) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json({ message: 'Item deleted' });
    } catch (err) {
        console.error('Error deleting item:', err);
        res.status(400).json({ message: err.message });
    }
})

const PORT = 4173;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));

