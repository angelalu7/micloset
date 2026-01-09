const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const app = express();

// Increase body parser limit to handle large base64 image uploads (20MB for avatar uploads)
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
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

// define avatar scheme
const avatarSchema = new mongoose.Schema({
    imageURL: String,
    createdAt: { type: Date, default: Date.now }
});

const Avatar = mongoose.model('Avatar', avatarSchema);

// define item saving process
app.post('/api/items', async (req, res) => {
    const { name, category, image, imageURL } = req.body;
    
    if (!name || !category || !imageURL) {
        return res.status(400).json({ message: 'Missing required fields: name, category, imageURL' });
    }

    try {
        let imageBuffer = null;
        if (image && typeof image === 'string' && image.includes(',')) {
            try {
                const base64Data = image.split(',')[1];
                imageBuffer = Buffer.from(base64Data, 'base64');
            } catch (bufferError) {
                console.warn('Failed to convert image to buffer, storing URL only:', bufferError.message);
            }
        }

        const newItem = new Item({
            name,
            category: category.toLowerCase(),
            image: imageBuffer,
            imageURL
        });

        const storedItem = await newItem.save();
        res.status(201).json(storedItem);
    } catch (err) {
        console.error('Error creating item:', err);
        res.status(400).json({ message: err.message });
    }
});

// define item getting process
app.get('/api/items', async (req, res) => {
    try {
        const { category } = req.query;
        const query = category ? { category: category.toLowerCase() } : {};
        const items = await Item.find(query);
        res.json(items);
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
});

// define avatar getting process (get most recent avatar)
app.get('/api/avatar', async (req, res) => {
    try {
        const avatar = await Avatar.findOne().sort({ createdAt: -1 });
        res.json(avatar || { imageURL: null });
    } catch(err) {
        console.error('Error fetching avatar:', err);
        res.status(400).json({ message: err.message });
    }
});

// define avatar saving process
app.post('/api/avatar', async (req, res) => {
    const { imageURL } = req.body;
    
    if (!imageURL) {
        return res.status(400).json({ message: 'Missing required field: imageURL' });
    }

    try {
        // Delete old avatars and create new one
        await Avatar.deleteMany({});
        const newAvatar = new Avatar({ imageURL });
        const savedAvatar = await newAvatar.save();
        res.status(201).json(savedAvatar);
    } catch (err) {
        console.error('Error saving avatar:', err);
        res.status(400).json({ message: err.message });
    }
});

// define avatar deleting process
app.delete('/api/avatar', async (req, res) => {
    try {
        await Avatar.deleteMany({});
        res.json({ message: 'Avatar deleted' });
    } catch (err) {
        console.error('Error deleting avatar:', err);
        res.status(400).json({ message: err.message });
    }
});

const PORT = 4173;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
