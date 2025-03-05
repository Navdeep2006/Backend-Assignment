const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3000;

app.use(express.json());

const productfile = "products.json";
const reviewfile = "reviews.json";

const readData = (file) => {
    if (!fs.existsSync(file)) return [];
    const data = fs.readFileSync(file);
    return JSON.parse(data);
};

const writeData = (file, data) => {
    fs.writeFileSync(file, JSON.stringify(data, null, 2)); // understand this line.
};

app.post("/products", (req, res) => {
    const { name, description } = req.body;
    if (!name || !description) {
        return res.status(400).json({ error: "Name and description are required" });
    }
    const products = readData(productfile);
    const newProduct = { id: Date.now().toString(), name, description, averageRating: 0 };
    products.push(newProduct);
    writeData(productfile, products);

    res.status(201).json(newProduct);
});

app.get("/products", (req, res) => {  // this part.
    let products = readData(productfile);
    if (req.query.sortBy === "rating") {
        products.sort((a, b) => b.averageRating - a.averageRating);
    }
    res.json(products);
});

app.post("/reviews", (req, res) => {
    const { productId, rating, message } = req.body;
    if (!productId || !rating || !message) return res.status(400).json({ error: "All fields are required" });
    if (rating < 1 || rating > 5) return res.status(400).json({ error: "Rating must be between 1 and 5" });

    const products = readData(productfile);
    const product = products.find(p => p.id === productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const reviews = readData(reviewfile);
    const newReview = { id: Date.now().toString(), productId, timestamp: new Date().toISOString(), rating, message };
    reviews.push(newReview);
    writeData(reviewfile, reviews);

    const productReviews = reviews.filter(r => r.productId === productId);
    product.averageRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
    writeData(productfile, products);

    res.status(201).json(newReview);
});

app.get("/reviews", (req, res) => {
    let reviews = readData(reviewfile);
    reviews.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    res.json(reviews);
});

app.get("/products/:id", (req, res) => {
    const { id } = req.params;
    const products = readData(productfile);
    const reviews = readData(reviewfile);

    const product = products.find(p => p.id === id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const productReviews = reviews.filter(r => r.productId === id);
    res.json({ ...product, reviews: productReviews });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});