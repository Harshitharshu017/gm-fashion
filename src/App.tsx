/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CustomerStorefront } from './components/CustomerStorefront';
import { AdminPortal } from './components/AdminPortal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { Product, CartItem, SalesHistory } from './types';

export default function App() {
  const [currentView, setView] = useState<'store' | 'admin'>('store');
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<SalesHistory[]>([]);
  
  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Cart & Wishlist state with localStorage fallbacks for outstanding quality of life
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('gmf_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('gmf_wishlist');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sync state to localStorage on modification
  useEffect(() => {
    localStorage.setItem('gmf_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('gmf_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Load database catalogues on layout mount
  const syncDatabase = async () => {
    try {
      const pRes = await fetch('/api/products');
      if (pRes.ok) {
        const pData = await pRes.json();
        setProducts(pData);
      }

      const sRes = await fetch('/api/sales');
      if (sRes.ok) {
        const sData = await sRes.json();
        setSales(sData);
      }
    } catch (error) {
      console.error('Remote sync warning: full-stack API server offline.', error);
    }
  };

  useEffect(() => {
    syncDatabase();
  }, []);

  // UI Handlers
  const handleToggleWishlist = (productId: string) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleAddToCart = (product: Product, quantity = 1, selectedSize?: string) => {
    const size = selectedSize || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Standard Size');
    
    setCart(prev => {
      const existingIdx = prev.findIndex(item => item.product.id === product.id && item.selectedSize === size);
      
      if (existingIdx !== -1) {
        const copy = [...prev];
        // Enforce max server stock limits during front add
        const currentQty = copy[existingIdx].quantity;
        copy[existingIdx].quantity = Math.min(product.stock_count, currentQty + quantity);
        return copy;
      } else {
        return [...prev, { product, quantity, selectedSize: size }];
      }
    });
  };

  const handleUpdateQty = (productId: string, size: string, change: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId && item.selectedSize === size) {
          const newQty = item.quantity + change;
          if (newQty <= 0) return null;
          // Guard maximum inventory limitations
          if (newQty > item.product.stock_count) return item;
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveItem = (productId: string, size: string) => {
    setCart(prev => prev.filter(item => !(item.product.id === productId && item.selectedSize === size)));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Synchronous refresh on full checkout operations
  const handleCheckoutSuccess = (updatedProducts: Product[], invoice: any) => {
    setProducts(updatedProducts);
    setSales(prev => [...prev, invoice]);
    // Keep active selectedProduct modal aligned if opened
    if (selectedProduct) {
      const updatedMatch = updatedProducts.find(p => p.id === selectedProduct.id);
      if (updatedMatch) setSelectedProduct(updatedMatch);
    }
  };

  // Administration actions
  const handleAddNewProduct = async (formData: Omit<Product, 'sizes' | 'colors'>) => {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Server error, could not save product logs.');
    }

    // Refresh products catalog instantly
    await syncDatabase();
    return result;
  };

  const handleDeleteProduct = async (id: string) => {
    const response = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Server database failure during delete action.');
    }

    // Remove deleted products from active shopping cart logs
    setCart(prev => prev.filter(item => item.product.id !== id));
    await syncDatabase();
    return result;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0c0a09] text-white">
      {/* Sticky Premium Navbar Header */}
      <Navbar
        currentView={currentView}
        setView={setView}
        cart={cart}
        setIsCartOpen={setIsCartOpen}
        wishlistCount={wishlist.length}
      />

      {/* Main Screen Layout transitions */}
      <main className="flex-grow">
        {currentView === 'store' ? (
          <CustomerStorefront
            products={products}
            onOpenDetails={setSelectedProduct}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
          />
        ) : (
          <AdminPortal
            products={products}
            sales={sales}
            onRefresh={syncDatabase}
            onAddProduct={handleAddNewProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        )}
      </main>

      {/* Shared Modals Overlay Panels */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        isWishlisted={selectedProduct ? wishlist.includes(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onCheckoutSuccess={handleCheckoutSuccess}
      />
    </div>
  );
}
