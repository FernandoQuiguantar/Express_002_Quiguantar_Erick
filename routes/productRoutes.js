const express = require('express');
const router = express.Router();
const productRepository = require('../repositories/productRepositorySQL');

// GET ALL
router.get('/', async (req, res) => {
    try {
        const products = await productRepository.findAll();
        res.json({
            products,
            total: products.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET BY ID
router.get('/:id', async (req, res) => {
    try {
        const product = await productRepository.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET BY EXISTENCE (stock range)
router.get('/existence/:min/:max', async (req, res) => {
    try {
        const { min, max } = req.params;
        const products = await productRepository.findProductByExistence(min, max);
        res.json({
            products,
            total: products.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// CREATE
router.post('/', async (req, res) => {
    try {
        const { description, price, stock, sku } = req.body;

        if (!description || !price || !stock || !sku) {
            return res.status(400).json({ message: 'Field missing' });
        }

        const existingSku = await productRepository.findBySku(sku);
        if (existingSku) {
            return res.status(400).json({ message: 'SKU provided already exists' });
        }

        const newProduct = await productRepository.create({
            description: description.trim(),
            price,
            stock,
            sku: sku.trim()
        });

        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
