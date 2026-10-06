const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Product = require('../models/Product');

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'forgeai-admin-secret-change-me';

// Middleware to verify admin authorization
const requireAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Forbidden: Invalid or expired token' });
      }
      req.admin = decoded;
      next();
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/products (Public) - List all products with optional filtering
router.get('/', async (req, res, next) => {
  try {
    const { discipline, bowType, search } = req.query;
    const query = {};

    if (discipline) {
      query.discipline = { $regex: new RegExp(`^${discipline}$`, 'i') };
    }
    if (bowType) {
      query.bowType = { $regex: new RegExp(`^${bowType}$`, 'i') };
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id (Public) - Get single product
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// POST /api/products (Public - Visitors & Admins can create)
router.post('/', async (req, res, next) => {
  try {
    const {
      sku,
      discipline,
      name,
      description,
      price,
      currency,
      carbonPercentage,
      bowType,
      weight,
      images,
      inventoryCount,
      technicalSpecs
    } = req.body;

    // Basic validation
    if (!name || !sku || !discipline || price === undefined) {
      return res.status(400).json({ error: 'Missing required fields: sku, discipline, name, price' });
    }

    // Adapt image format if it comes as a string comma-separated
    let imagesArray = [];
    if (Array.isArray(images)) {
      imagesArray = images;
    } else if (typeof images === 'string') {
      imagesArray = images.split(',').map(img => img.trim()).filter(Boolean);
    }
    if (imagesArray.length === 0) {
      imagesArray = ['https://picsum.photos/seed/ami-default/600/600'];
    }

    const newProduct = new Product({
      sku,
      discipline,
      name,
      description,
      price,
      currency: currency || 'EUR',
      carbonPercentage: carbonPercentage || 0,
      bowType: bowType || 'N/A',
      weight: weight || 'Light',
      images: imagesArray,
      inventoryCount: inventoryCount !== undefined ? inventoryCount : 10,
      technicalSpecs: Array.isArray(technicalSpecs) ? technicalSpecs : []
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
});

// PUT /api/products/:id (Admin only) - Update full or partial product details
router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const {
      sku,
      discipline,
      name,
      description,
      price,
      currency,
      carbonPercentage,
      bowType,
      weight,
      images,
      inventoryCount,
      technicalSpecs
    } = req.body;

    const updateFields = {
      sku,
      discipline,
      name,
      description,
      price,
      currency,
      carbonPercentage,
      bowType,
      weight,
      inventoryCount,
      technicalSpecs
    };

    if (images !== undefined) {
      let imagesArray = [];
      if (Array.isArray(images)) {
        imagesArray = images;
      } else if (typeof images === 'string') {
        imagesArray = images.split(',').map(img => img.trim()).filter(Boolean);
      }
      updateFields.images = imagesArray;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
});

// DELETE /api/products/:id (Admin only) - Delete product from collection
router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully', id: req.params.id });
  } catch (err) {
    next(err);
  }
});

module.exports = router;