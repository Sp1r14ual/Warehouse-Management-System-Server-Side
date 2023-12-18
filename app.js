const express = require('express');
const { Client } = require('pg');
const cors = require('cors');
const session = require('express-session');

const app = express();
const port = 3000;

const whitelist = ['http://127.0.0.1:5500', 'http://127.0.0.1:3000'];

let current_user = null;

app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  })
);
app.use(express.json());
app.use(
  session({
    secret: 'super-secret-key',
    resave: false,
    saveUninitialized: true,
  })
);

const roles = {
  admin: {
    add: true,
    delete: true,
    search: true,
    changeVendorCode: true,
    changeLocation: true,
    changeQuantity: true,
    changeWeight: true,
    changeShelfLife: true,
    changeShipper: true,
  },
  manager: {
    add: false,
    delete: true,
    search: true,
    changeVendorCode: true,
    changeLocation: true,
    changeQuantity: true,
    changeWeight: true,
    changeShelfLife: true,
    changeShipper: true,
  },
  storekeeper: {
    add: false,
    delete: true,
    search: true,
    changeVendorCode: true,
    changeLocation: true,
    changeQuantity: true,
    changeWeight: true,
    changeShelfLife: true,
    changeShipper: true,
  },
  logistician: {
    add: false,
    delete: false,
    search: true,
    changeVendorCode: false,
    changeLocation: true,
    changeQuantity: false,
    changeWeight: false,
    changeShelfLife: false,
    changeShipper: false,
  },
};

const users = [
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'manager', password: 'manager123', role: 'manager' },
  { username: 'storekeeper', password: 'storekeeper123', role: 'storekeeper' },
  { username: 'logistician', password: 'logistician123', role: 'logistician' },
];

// Route to handle user login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (user) {
    current_user = user;
    // req.session.user = user; // Store user data in the session
    // req.session.save(() => {
    //   req.session.user = user;
    // });
    res.json({ success: true, role: user.role });
  } else {
    res.json({ success: false, message: 'Invalid username or password' });
  }
});

// Route to check user authentication
app.get('/api/check-auth', (req, res) => {
  if (req.session.user) {
    res.json({ authenticated: true, role: req.session.user.role });
  } else {
    res.json({ authenticated: false });
  }
});

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'warehouse',
  password: 'password123',
  port: 5432,
});

client.connect();

app.get('/get', (req, res) => {
  if (roles[current_user.role].search)
    try {
      const result = client
        .query('SELECT * FROM items')
        .then(data => res.json(data.rows));
    } catch (error) {
      console.error('Error fetching items:', error);
      res.status(500).send('Internal Server Error');
    }
  else throw new Error('403: Forbidden');
});

app.post('/insert', (req, res) => {
  const newItem = req.body;

  const insertDataQuery =
    'INSERT INTO items (name, vendor_code, location, quantity, weight, shelf_life, shipper) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';

  if (roles[current_user.role].add)
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
  else throw new Error('403 Forbidden');
});

app.put('/updateLocation', (req, res) => {
  const { id, location } = req.body;

  if (roles[current_user.role].changeLocation)
    client.query(`UPDATE items SET location = $1 WHERE id = $2 RETURNING *`, [
      location,
      id,
    ]);
  // .then(data => res.json(data.rows))
  // .catch(err =>
  //   console.error(`Error updating location for item ${id}:`, err)
  // );
  else throw new Error('403 Forbidden');
});

app.put('/updateQuantity', (req, res) => {
  const { id, quantity } = req.body;

  if (roles[current_user.role].changeQuantity)
    client.query(`UPDATE items SET quantity = $1 WHERE id = $2 RETURNING *`, [
      quantity,
      id,
    ]);
  // .then(data => res.json(data.rows))
  // .catch(err =>
  //   console.error(`Error updating location for item ${id}:`, err)
  // );
  else throw new Error('403 Forbidden');
});

app.put('/updateWeight', (req, res) => {
  const { id, weight } = req.body;

  if (roles[current_user.role].changeWeight)
    client.query(`UPDATE items SET weight = $1 WHERE id = $2 RETURNING *`, [
      weight,
      id,
    ]);
  // .then(data => res.json(data.rows))
  // .catch(err =>
  //   console.error(`Error updating location for item ${id}:`, err)
  // );
  else throw new Error('403 Forbidden');
});

app.put('/updateShelfLife', (req, res) => {
  const { id, shelf_life } = req.body;

  if (roles[current_user.role].changeShelfLife)
    client.query(`UPDATE items SET shelf_life = $1 WHERE id = $2 RETURNING *`, [
      shelf_life,
      id,
    ]);
  // .then(data => res.json(data.rows))
  // .catch(err =>
  //   console.error(`Error updating location for item ${id}:`, err)
  // );
  else throw new Error('403 Forbidden');
});

app.put('/updateShipper', (req, res) => {
  const { id, shipper } = req.body;

  if (roles[current_user.role].changeShipper)
    client.query(`UPDATE items SET shipper = $1 WHERE id = $2 RETURNING *`, [
      shipper,
      id,
    ]);
  // .then(data => res.json(data.rows))
  // .catch(err =>
  //   console.error(`Error updating location for item ${id}:`, err)
  // );
  else throw new Error('403 Forbidden');
});

app.put('/updateVendorCode', (req, res) => {
  const { id, vendor_code } = req.body;

  if (roles[current_user.role].changeVendorCode)
    client.query(
      `UPDATE items SET vendor_code = $1 WHERE id = $2 RETURNING *`,
      [vendor_code, id]
    );
  // .then(data => res.json(data.rows))
  // .catch(err =>
  //   console.error(`Error updating location for item ${id}:`, err)
  // );
  else throw new Error('403 Forbidden');
});

app.get('/search', (req, res) => {
  const searchTerm = req.query.searchTerm;
  const searchCriteria = req.query.searchCriteria;

  try {
    let result;
    if (roles[current_user.role].search)
      // Perform search based on the selected criteria
      switch (searchCriteria) {
        case 'itemName':
          result = client
            .query('SELECT * FROM items WHERE name ILIKE $1', [
              `%${searchTerm}%`,
            ])
            .then(data => res.json(data.rows));
          break;
        case 'vendorCode':
          result = client
            .query('SELECT * FROM items WHERE vendor_code ILIKE $1', [
              `%${searchTerm}%`,
            ])
            .then(data => res.json(data.rows));
          break;
        case 'quantity':
          result = client
            .query('SELECT * FROM items WHERE quantity = $1', [searchTerm])
            .then(data => res.json(data.rows));
          break;
        case 'weight':
          result = client
            .query('SELECT * FROM items WHERE weight = $1', [searchTerm])
            .then(data => res.json(data.rows));
          break;
        case 'shelfLife':
          result = client
            .query('SELECT * FROM items WHERE shelf_life = $1', [searchTerm])
            .then(data => res.json(data.rows));
          break;
        case 'shipper':
          result = client
            .query('SELECT * FROM items WHERE shipper ILIKE $1', [
              `%${searchTerm}%`,
            ])
            .then(data => res.json(data.rows));
          break;
        case 'location':
          result = client
            .query('SELECT * FROM items WHERE location ILIKE $1', [
              `%${searchTerm}%`,
            ])
            .then(data => res.json(data.rows));
          break;
        // Add more cases for other search criteria as needed
        default:
          res.status(400).json({ error: 'Invalid search criteria' });
          return;
      }
    else throw new Error('403 Forbidden');
  } catch (error) {
    console.error('Error searching items:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/deleteItem/:itemId', (req, res) => {
  const itemId = req.params.itemId;

  try {
    if (roles[current_user.role].delete)
      client.query('DELETE FROM items WHERE id = $1 RETURNING *', [itemId]);
    // .then(data => res.json(data))
    // .catch(err => console.error('Error'));
    else throw new Error('403 Forbidden');
  } catch (error) {
    console.error(`Error deleting item ${itemId}:`, error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
