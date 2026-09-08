const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure upload directory exists
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

// Multer Storage Configuration for Real-time Camera & Gallery Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// In-Memory Fallback State (Connect to Postgres/Mongo in production)
let products = [
  {
    id: "p1",
    name: "Samsung Galaxy A15 5G",
    condition: "Brand New",
    actualPrice: 19499,
    offerPrice: 16499,
    desc: "6GB RAM, 128GB, AMOLED Display, 50MP Triple Camera.",
    imageUrl: "/uploads/sample-phone.jpg"
  }
];

let ebills = [
  {
    invoiceNumber: "INV-1001",
    customerPhone: "6360509055",
    customerName: "Muthu Kumar",
    item: "Original Display Combo",
    amount: 2200,
    status: "PAID",
    date: new Date().toISOString().split('T')[0]
  }
];

let activeOffer = {
  title: "Special Festival Discount",
  description: "Get best prices on mobile accessories and display replacement.",
  bannerUrl: "",
  isActive: true
};

// Owner Auth Middleware
const verifyOwnerSecret = (req, res, next) => {
  const token = req.headers['x-owner-token'];
  if (token !== 'charan10') {
    return res.status(401).json({ error: "Unauthorized access to Owner Corner." });
  }
  next();
};

// --- PUBLIC ROUTES (No Login Required) ---
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/offer', (req, res) => {
  res.json(activeOffer);
});

app.get('/api/ebill/:query', (req, res) => {
  const query = req.params.query.trim();
  const bill = ebills.find(b => b.customerPhone === query || b.invoiceNumber.toLowerCase() === query.toLowerCase());
  if (!bill) return res.status(404).json({ error: "Invoice not found." });
  res.json(bill);
});

// --- OWNER ROUTES (Protected with charan10) ---
app.post('/api/owner/products', verifyOwnerSecret, upload.single('image'), (req, res) => {
  const { name, condition, actualPrice, offerPrice, desc } = req.body;
  const newProduct = {
    id: "p_" + Date.now(),
    name,
    condition,
    actualPrice: Number(actualPrice),
    offerPrice: Number(offerPrice),
    desc,
    imageUrl: req.file ? `/uploads/${req.file.filename}` : ''
  };
  products.unshift(newProduct);
  res.status(201).json({ message: "Product published successfully.", product: newProduct });
});

app.delete('/api/owner/products/:id', verifyOwnerSecret, (req, res) => {
  products = products.filter(p => p.id !== req.params.id);
  res.json({ message: "Product deleted." });
});

app.post('/api/owner/ebill', verifyOwnerSecret, (req, res) => {
  const { customerPhone, customerName, item, amount, status } = req.body;
  const newBill = {
    invoiceNumber: "INV-" + Math.floor(1000 + Math.random() * 9000),
    customerPhone,
    customerName,
    item,
    amount: Number(amount),
    status: status || 'PAID',
    date: new Date().toISOString().split('T')[0]
  };
  ebills.push(newBill);
  res.status(201).json({ message: "E-Bill generated.", bill: newBill });
});

app.listen(PORT, () => {
  console.log(`Charan Mobiles Backend running on http://localhost:${PORT}`);
});

