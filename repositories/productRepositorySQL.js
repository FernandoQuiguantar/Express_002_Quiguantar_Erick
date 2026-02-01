const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'express_003',
    password: 'password',
    port: 5435,
});

class ProductRepository {
    async findAll() {
        const result = await pool.query('SELECT * FROM products');
        return result.rows;
    }

    async findById(id) {
        const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
        return result.rows[0];
    }

    async findBySku(sku) {
        const result = await pool.query('SELECT * FROM products WHERE sku = $1', [sku]);
        return result.rows[0];
    }

    async findProductByExistence(min, max) {
        const result = await pool.query(
            'SELECT * FROM products WHERE stock >= $1 AND stock <= $2',
            [min, max]
        );
        return result.rows;
    }

    async create(product) {
        const { description, price, stock, sku } = product;
        const result = await pool.query(
            'INSERT INTO products (description, price, stock, sku) VALUES ($1, $2, $3, $4) RETURNING *',
            [description, price, stock, sku]
        );
        return result.rows[0];
    }

    async update(id, product) {
        const { description, price, stock, sku } = product;
        const result = await pool.query(
            'UPDATE products SET description = $1, price = $2, stock = $3, sku = $4 WHERE id = $5 RETURNING *',
            [description, price, stock, sku, id]
        );
        return result.rows[0];
    }

    async delete(id) {
        const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    }
}

module.exports = new ProductRepository();
