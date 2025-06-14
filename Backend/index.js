const port = 3000;
const baseUrl = process.env.BASE_URL || `http://localhost:${port}`;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const multer = require("multer");
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(cors());

// Database connection with MongoDB
mongoose.connect("mongodb+srv://Nilesh:Nilesh3115@cluster0.zhpiu.mongodb.net/e-commerce", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Database Connected"))
    .catch((err) => console.error("Database Connection Error:", err));

// Root API
app.get("/", (req, res) => {
    res.send("Express App Is Running");
});

// Image Storage Engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({ storage: storage });

// Static folder for images
app.use('/images', express.static('upload/images'));

// Image upload endpoint
/* app.post("/upload", upload.single('product'), (req, res) => {
    res.json({
        success: 1,
           image_url: `http://localhost:${port}/images/${req.file.filename}`,
         image_url: `http://localhost:${port}/images/${req.file.filename}`
        image_url: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });
}); */

app.post("/upload", upload.single('product'), (req, res) => {
    
    res.json({
        success: 1,
        image_url: `${baseUrl}/images/${req.file.filename}`
    });
});

// Product Schema and Model
const Product = mongoose.model("Product", {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    new_price: { type: Number, required: true },
    old_price: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    available: { type: Boolean, default: true },
});

// Add Product API
app.post('/addproduct', async (req, res) => {
    try {
        const products = await Product.find({});
        const id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

        const product = new Product({
            id,
            name: req.body.name,
            image: req.body.image,
            category: req.body.category,
            new_price: req.body.new_price,
            old_price: req.body.old_price,
        });

        await product.save();
        res.json({ success: true, name: req.body.name });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete Product API
app.post('/removeproduct', async (req, res) => {
    try {
        await Product.findOneAndDelete({ id: req.body.id });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get All Products API
app.get('/allproducts', async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// User Schema and Model
const User = mongoose.model('User', {
    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    cartData: { type: Object },
    date: { type: Date, default: Date.now },
});

// Sign Up API
app.post('/signup', async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ success: false, errors: "User already exists" });
        }

        const cart = Array.from({ length: 300 }, () => 0);
        const user = new User({
            name: req.body.username,
            email: req.body.email,
            password: req.body.password,
            cartData: cart,
        });

        await user.save();
        const token = jwt.sign({ id: user.id }, 'secret_ecom');
        res.json({ success: true, token });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Login API
app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user && user.password === req.body.password) {
            const token = jwt.sign({ id: user.id }, 'secret_ecom');
            res.json({ success: true, token });
        } else {
            res.status(400).json({ success: false, errors: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});


// Creating endpoint for newcollection data
app.get('/newcollections', async (req, res) => {
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("NewCollection Fetched");
    res.send(newcollection);
})

// Creatin End point For popular in women collection
app.get('/popularinwomen', async (req, res) => {
    let products = await Product.find({ category: "women" });
    let popular_in_women = products.slice(0, 4);
    console.log("Popular In Women Fetched");
    res.send(popular_in_women);
})

// Middleware to Fetch User
const fetchUser = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).json({ errors: "Access denied, no token provided" });
    }
    try {
        const decoded = jwt.verify(token, 'secret_ecom');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ errors: "Invalid token" });
    }
};

// Cart Operations 
app.post('/addtocart', fetchUser, async (req, res) => {
    ``
    try {
        const user = await User.findById(req.user.id);
        user.cartData[req.body.itemId] += 1;
        await user.save();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/removefromcart', fetchUser, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.cartData[req.body.itemId] > 0) {
            user.cartData[req.body.itemId] -= 1;
        }
        await user.save();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get Cart Data API
app.post('/getcart', fetchUser, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user.cartData);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Start Server
app.listen(baseUrl, () => {
    console.log(`Server running on port ${baseUrl}`);
});

