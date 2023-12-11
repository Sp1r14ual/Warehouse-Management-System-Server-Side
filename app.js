const express = require('express');
const { Client } = require('pg');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'warehouse',
  password: 'password123',
  port: 5432,
});

client.connect();

app.get('/get', (req, res) => {
  try {
    const result = client
      .query('SELECT * FROM items')
      .then(data => res.json(data.rows));
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/insert', (req, res) => {
  const newItem = req.body;
  console.log(newItem);

  const insertDataQuery =
    'INSERT INTO items (name, vendor_code, location, quantity, weight, shelf_life, shipper) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';

  client.query(
    insertDataQuery,
    [
      newItem.name,
      newItem.vendorCode,
      newItem.location,
      newItem.quantity,
      newItem.weight,
      newItem.shelfLife,
      newItem.shipper,
    ],
    err => {
      if (err) {
        console.error('Error inserting data:', err);
        res.send('Error inserting data');
      } else {
        res.send('Data inserted successfully');
      }
    }
  );
});

app.put('/updateLocation', (req, res) => {
  const { id, location } = req.body;

  const result = client
    .query(`UPDATE items SET location = $1 WHERE id = $2 RETURNING *`, [
      location,
      id,
    ])
    .then(data => res.json(data.rows))
    .catch(err =>
      console.error(`Error updating location for item ${id}:`, err)
    );
});

app.put('/updateQuantity', (req, res) => {
  const { id, quantity } = req.body;

  const result = client
    .query(`UPDATE items SET quantity = $1 WHERE id = $2 RETURNING *`, [
      quantity,
      id,
    ])
    .then(data => res.json(data.rows))
    .catch(err =>
      console.error(`Error updating location for item ${id}:`, err)
    );
});

app.put('/updateWeight', (req, res) => {
  const { id, weight } = req.body;

  const result = client
    .query(`UPDATE items SET weight = $1 WHERE id = $2 RETURNING *`, [
      weight,
      id,
    ])
    .then(data => res.json(data.rows))
    .catch(err =>
      console.error(`Error updating location for item ${id}:`, err)
    );
});

app.put('/updateShelfLife', (req, res) => {
  const { id, shelf_life } = req.body;

  const result = client
    .query(`UPDATE items SET shelf_life = $1 WHERE id = $2 RETURNING *`, [
      shelf_life,
      id,
    ])
    .then(data => res.json(data.rows))
    .catch(err =>
      console.error(`Error updating location for item ${id}:`, err)
    );
});

app.put('/updateShipper', (req, res) => {
  const { id, shipper } = req.body;

  const result = client
    .query(`UPDATE items SET shipper = $1 WHERE id = $2 RETURNING *`, [
      shipper,
      id,
    ])
    .then(data => res.json(data.rows))
    .catch(err =>
      console.error(`Error updating location for item ${id}:`, err)
    );
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
