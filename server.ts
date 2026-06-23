/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { Product, SalesHistory, OrderDetails, CartItem, ProductCategory } from './src/types';

const app = express();
const PORT = 3000;

app.use(express.json());

// Set up directory for state files
const DATA_DIR = path.join(process.cwd(), '.data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const SALES_FILE = path.join(DATA_DIR, 'sales.json');

// Ensure database files exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Seed product definitions aligned with Stitch.ai visual specifications
const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'GMF-KUR-001',
    name: 'Embroidered Heritage Kurta',
    category: 'Clothes',
    price_inr: 1899,
    original_price_inr: 2499,
    stock_count: 142,
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9cAt8i5Q-QK3fkfxR3lCSUlvh7PCtQOpxFid5FA07Egaxb8VsYx5JDZkvYN5iABywVFzOe_57cNeIXYDQzxyID-uebx1pxTCL3XpF_PAd_1BCkRIhwH7KlK7i9BJyS4P2d-8p5vOPkTWW4ruoacCvLF4s5SRSGBdokjBs2WSin0QbtNrc7xIrnkPFEGpeSe3b3JVcxWysno23TihgD63W5ECAUcgfcDECSTK4AVl98Ni_t9oZykEofmkLun-EHhnAUTKzIyuT6F00',
    description: 'A professional studio photography shot of a high-end deep maroon Indian Kurta with intricate gold embroidery on the collar. The fabric texture is premium, smooth art silk, perfect for weddings and festive seasons.',
    badge: 'Premium Collection',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['#570013', '#ffdad6', '#1c1b1b']
  },
  {
    id: 'GMF-MOJ-002',
    name: 'Handcrafted Leather Mojaris',
    category: 'Shoes',
    price_inr: 1249,
    original_price_inr: 1999,
    stock_count: 58,
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqOADQECxhxFnWJK_JIbhwAcb0jPuQpR8xXCLtt5RisSSMP3xmfO0wZ5hj0n9jd4EWQUq0DxlpAM9OPw3UOt-QeYnKwMXTtHyetI4ASyEey3WMGarf1ZMsr389p9KzPIGB-b3XfduWuljnngE41sB33jmywwrIYOXxUk1E-aJN3lXr3ZAXqkZWZK2PAvJOiLRhVJE-zoSNuUUwL4XT8UgZ68YMghomWXg7huGRrFO-AHY_QpO_rYkdUxbeF6_3auvAmZDOfjvBeO9d',
    description: 'Beautifully crafted ethnic Mojaris using hand-polished vegan brown leather. Embellished with silver thread motifs demonstrating fine design and traditional Indian aesthetics.',
    badge: 'Best Seller',
    sizes: ['M', 'L', 'XL'],
    colors: ['#c8c6c5', '#000000', '#ffffff']
  },
  {
    id: 'GMF-SHR-003',
    name: 'Luxe Linen Casual Shirt',
    category: 'Clothes',
    price_inr: 1599,
    stock_count: 35,
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRpgLih5UL8TPwpVAEuTYf-8oE94-Am5pioNZKMxBdOnl6VjldsTls9J40Ni-yWNIeXmd_5juMelCJSQyPKluCWBRubKQ6WjEUrAmPbnngcmksKy2qAq_pHz6iiMM1IrHbsmbjPVsTvKOJwo7KwyoxfMFBBXaUgNL1SOraAzW1kT2ZiV_2_Jm4KToJiLWIHq7fb07pESgvkncGPssmN8Yzd4Nn5EkLIZgFhI4psOXzp-QeS49Uj8yX6Tpk5scqgnk08A-BFyJeC92o',
    description: 'Constructed from highly breathable organic flax plants, this casual champagne-gold shirt offers lightweight, tailored premium wear for sophisticated styles.',
    badge: 'Popular',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#ffe088', '#ffffff']
  },
  {
    id: 'GMF-SLP-004',
    name: 'Midnight Velvet Slippers',
    category: 'Slippers',
    price_inr: 799,
    original_price_inr: 1199,
    stock_count: 24,
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOELJ8TiD_xFikYmNRAkfegcNlTL-yJvdS0MM654xwEe44T4I-Sqt7l1FWW6TmyUUJNHVDYghU_vWr9WT71FFG8-OQceVFiCjcmGmeXQG0RChmZcsBoBKMVrbkq-k1QVzzkoZRWpHkkFPfsr-82b34ByhMKPIBeseCa0LRrHkd8KKPEyuqE1j0ah6_2NKXNinNmoUIara-xUDRczq5S0Nf0A5hMyEZPHlL1-6Hr9bbXtjepIRk0R26d_kAK-lJST6RUeXXuGE3GROX',
    description: 'Indulge in home comfort with these premium navy-blue slippers crafted from plush micro-velvet. Fastened with safe rubber anti-skid outsoles and styled with gold accents.',
    badge: 'Sale',
    sizes: ['M', 'L', 'XL'],
    colors: ['#241a00', '#000000']
  },
  {
    id: 'GMF-TUN-005',
    name: 'Breeze Cotton Tunic',
    category: 'Clothes',
    price_inr: 1449,
    stock_count: 16,
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGBjiB5Qa889t-HNVyrrn1tlnEwdForsKprxDlDCqpwwXXb72mDkfyfgMQ45ooAc8Ws5UqXa3LcSdMCIbmAW1CZLdlFsLUm711d2r99Fo4qBFSRrkNMzPLIGCjoG_3wVgf-XGa2jPK-jRDlLywFsKjR5LQ59VtXAOf2-vts5J-tdAYozHw2vnojzUMeDt2tyEwfpzzpxiUJKqH8iOJQg8m4a6Gi6GwAwgXbAuRzI80Wr0sCDFVrwCrTrpHIdFAAkT9WLpoTXkos7Xc',
    description: 'Tailored ethnic white cotton tunic with subtle tone-on-tone fine embroideries. Combines standard regional fabrics with an airy, fluid contemporary comfort.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['#ffffff']
  },
  {
    id: 'GMF-SNK-006',
    name: 'Urban Pulse Sneakers',
    category: 'Shoes',
    price_inr: 2499,
    original_price_inr: 3299,
    stock_count: 86,
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAy51AsYVBZR9BXhMAiiiU_LGPwi3TrsA8QWKtwbEEL71z45GlOthETayDqqG0zCqEpcpGpLDTAR-oKSEKwTYlCheABhd1AoDQO-4-LKkJp-5Jxcp1NEL3B_FmMfbflE5f4dw_4ObenSFPRCE5UPX8Xdjcsd_1n5V7tYuul-7o_gIrnops7h6gSu40YFJ2SXUX8LnODukJqJXJzzTu9BXYcpdEM5LpiIx8OOdk81MaXopUKX8wJ1Bk8kMNmm9Snpwu5t5-LyZzPjOfj',
    description: 'High-performance casual athletic sneakers featuring lightweight matte-black synthetic fabrics and dark red energetic accents for high-contrast e-commerce impact.',
    badge: 'Trending',
    sizes: ['UK 8', 'UK 9', 'UK 10'],
    colors: ['#000000', '#570013']
  },
  {
    id: 'GMF-MOC-007',
    name: 'Classic Tan Moccasins',
    category: 'Slippers',
    price_inr: 1899,
    original_price_inr: 2499,
    stock_count: 5,
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVUGdBcR9R2UYZFVa2QTbFeFC6167podU1sFXylWe4ZlSUxQn4NkwaQ9GcN3IBY_NXbmnnq5OuHVC8-h_JwHqGsR6-2M0dZODO86DBaW_kg8feA_NrmNPhZYwegevXZuTz8V-xDtf_KsdYs1Nx8ddbcI5ivrIzp_15m6ck7gpgPrzl5efIcZSd4x-U46gHwIAXghcD2mNFqf6_pJvyxL5gnezAgbr81f-iB_6buB3LDPCi91DEZxQV81m29PaatWK7OftohWYcbY4F',
    description: 'Traditional slip-on indoor/outdoor slippers crafted with supple tan-burnished calfskin leather. Accented with comfortable layered padding and precision lock stitching.',
    badge: 'Critical Stock',
    sizes: ['M', 'L', 'XL'],
    colors: ['#c8c6c5', '#000000']
  },
  {
    id: 'GMF-KUR-008',
    name: 'Luxury Silk Blend Kurta',
    category: 'Clothes',
    price_inr: 4299,
    original_price_inr: 5999,
    stock_count: 2,
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0sxFXaCprxCbhKo6HgcxeJ31HNBd5-R1_MNgNPLga6vsmTCz6B_tWcsiAr9Vjy6SoEbo7a8OQLoE3i6a7ZXBDY1CIBjyqTEw4nxu_B48-wJCGxOC7KsaRg-9fhB8WFig2D_0OobQlgN_sZZLzU15oEf6Z8heFf_wRveJ2AsJWtTesdygOr6UVZo4NOS6bCgYA1aZWetwKPbcP9yv7oqZ6b46-dpw6nuztH_A0PTUnm6pAnp0vzvKUPZOalQOC1fN4VjC9b8cdDgIJ',
    description: 'An premium editorial-grade deep maroon blend art-silk Kurta, showcasing fine drapes, elegant gold thread embroidered linings on front placket, matching perfectly with silk churidars.',
    badge: 'New Arrival',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#570013', '#ffe088']
  }
];

// Helper functions to read & write JSON files securely
function readDb<T>(filePath: string, defaultData: T): T {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
      return defaultData;
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return defaultData;
  }
}

function writeDb<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Error writing to ${filePath}:`, error);
  }
}

// REST APIs
app.get('/api/products', (req, res) => {
  const products = readDb<Product[]>(PRODUCTS_FILE, DEFAULT_PRODUCTS);
  res.json(products);
});

app.post('/api/products', (req, res) => {
  const products = readDb<Product[]>(PRODUCTS_FILE, DEFAULT_PRODUCTS);
  const { id, name, category, price_inr, stock_count, image_url, description, original_price_inr, badge } = req.body;

  // Validation
  if (!id || !name || !category || price_inr === undefined || stock_count === undefined || !image_url) {
    res.status(400).json({ error: 'Missing required product fields: id, name, category, price_inr, stock_count, image_url' });
    return;
  }

  const validCategories: ProductCategory[] = ['Clothes', 'Shoes', 'Slippers'];
  if (!validCategories.includes(category)) {
    res.status(400).json({ error: `Invalid category. Must be one of: ${validCategories.join(', ')}` });
    return;
  }

  // Check unique key constraint
  const existingIdx = products.findIndex(p => p.id === id);
  if (existingIdx !== -1) {
    res.status(400).json({ error: `Product with unique ID "${id}" already exists.` });
    return;
  }

  const newProduct: Product = {
    id,
    name,
    category,
    price_inr: Number(price_inr),
    original_price_inr: original_price_inr ? Number(original_price_inr) : undefined,
    stock_count: Number(stock_count),
    image_url,
    description: description || 'Premium item crafted for the GM Fashion active catalog.',
    badge: badge || 'New Collection',
    sizes: category === 'Clothes' ? ['S', 'M', 'L', 'XL'] : category === 'Shoes' ? ['UK 8', 'UK 9', 'UK 10'] : ['M', 'L', 'XL'],
    colors: ['#570013', '#000000']
  };

  products.push(newProduct);
  writeDb(PRODUCTS_FILE, products);
  res.status(201).json(newProduct);
});

app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  let products = readDb<Product[]>(PRODUCTS_FILE, DEFAULT_PRODUCTS);
  const targetIndex = products.findIndex(p => p.id === id);

  if (targetIndex === -1) {
    res.status(404).json({ error: `Product with ID "${id}" not found.` });
    return;
  }

  products = products.filter(p => p.id !== id);
  writeDb(PRODUCTS_FILE, products);
  res.json({ message: 'Product successfully removed from database state.', id });
});

// Sales & Checkout State
app.get('/api/sales', (req, res) => {
  const sales = readDb<SalesHistory[]>(SALES_FILE, []);
  res.json(sales);
});

app.post('/api/checkout', (req, res) => {
  const products = readDb<Product[]>(PRODUCTS_FILE, DEFAULT_PRODUCTS);
  const sales = readDb<SalesHistory[]>(SALES_FILE, []);
  const { cartItems, customerDetails }: { cartItems: CartItem[]; customerDetails: OrderDetails } = req.body;

  if (!cartItems || cartItems.length === 0 || !customerDetails) {
    res.status(400).json({ error: 'Missing checkout specifications: cartItems, customerDetails' });
    return;
  }

  // Validate and decrement stock
  for (const item of cartItems) {
    const product = products.find(p => p.id === item.product.id);
    if (!product) {
      res.status(400).json({ error: `Product ${item.product.name} no longer exists in our catalog.` });
      return;
    }
    if (product.stock_count < item.quantity) {
      res.status(400).json({ error: `Insufficient stock for ${product.name}. Available: ${product.stock_count}, Requested: ${item.quantity}` });
      return;
    }
  }

  // Decrement stock in catalog
  for (const item of cartItems) {
    const product = products.find(p => p.id === item.product.id)!;
    product.stock_count -= item.quantity;
  }

  // Compute subtotal and sales summary
  let subtotal = 0;
  const itemLogs = cartItems.map(item => {
    const cost = item.product.price_inr * item.quantity;
    subtotal += cost;
    return {
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
      price: item.product.price_inr
    };
  });

  // Calculate taxes (Flat 5% GST as specifically outlined in instructions)
  const gst = Number((subtotal * 0.05).toFixed(2));
  const finalTotal = subtotal + gst;

  const newSale: SalesHistory = {
    id: `GMF-TXN-${Date.now().toString().slice(-6)}`,
    timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('en-IN'),
    items: itemLogs,
    subtotal,
    gst,
    total: finalTotal,
    status: customerDetails.paymentMethod === 'cod' ? 'Pending' : 'Paid',
    customer: {
      name: customerDetails.fullName,
      phone: customerDetails.phone,
      address: `${customerDetails.address}, ${customerDetails.city} - ${customerDetails.pinCode}`
    }
  };

  sales.push(newSale);
  writeDb(PRODUCTS_FILE, products);
  writeDb(SALES_FILE, sales);

  res.status(201).json({ sale: newSale, updatedProducts: products });
});

// App health check API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', datetime: new Date().toISOString() });
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server loaded successfully, listenting on http://localhost:${PORT}`);
  });
}

startServer();
