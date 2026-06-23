/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, ArrowUpRight, TrendingUp, AlertTriangle, ShieldCheck, RefreshCw, FileSpreadsheet, Box, IndianRupee, Search } from 'lucide-react';
import { Product, SalesHistory, ProductCategory } from '../types';

interface AdminPortalProps {
  products: Product[];
  sales: SalesHistory[];
  onRefresh: () => void;
  onAddProduct: (product: Omit<Product, 'sizes' | 'colors'>) => Promise<any>;
  onDeleteProduct: (id: string) => Promise<any>;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  products,
  sales,
  onRefresh,
  onAddProduct,
  onDeleteProduct,
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'ledger'>('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Add Item form states
  const [newItem, setNewItem] = useState({
    id: '',
    name: '',
    category: 'Clothes' as ProductCategory,
    price_inr: '',
    stock_count: '',
    image_url: '',
    description: '',
    badge: 'New Collection'
  });

  // Safe preset image URLs for testing easily
  const STATIC_ASSETS_PRESETS = [
    {
      name: 'Festive Red Kurta',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9cAt8i5Q-QK3fkfxR3lCSUlvh7PCtQOpxFid5FA07Egaxb8VsYx5JDZkvYN5iABywVFzOe_57cNeIXYDQzxyID-uebx1pxTCL3XpF_PAd_1BCkRIhwH7KlK7i9BJyS4P2d-8p5vOPkTWW4ruoacCvLF4s5SRSGBdokjBs2WSin0QbtNrc7xIrnkPFEGpeSe3b3JVcxWysno23TihgD63W5ECAUcgfcDECSTK4AVl98Ni_t9oZykEofmkLun-EHhnAUTKzIyuT6F00'
    },
    {
      name: 'Breeze Cotton Shirt',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRpgLih5UL8TPwpVAEuTYf-8oE94-Am5pioNZKMxBdOnl6VjldsTls9J40Ni-yWNIeXmd_5juMelCJSQyPKluCWBRubKQ6WjEUrAmPbnngcmksKy2qAq_pHz6iiMM1IrHbsmbjPVsTvKOJwo7KwyoxfMFBBXaUgNL1SOraAzW1kT2ZiV_2_Jm4KToJiLWIHq7fb07pESgvkncGPssmN8Yzd4Nn5EkLIZgFhI4psOXzp-QeS49Uj8yX6Tpk5scqgnk08A-BFyJeC92o'
    },
    {
      name: 'Heritage Silk Sherwani',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0sxFXaCprxCbhKo6HgcxeJ31HNBd5-R1_MNgNPLga6vsmTCz6B_tWcsiAr9Vjy6SoEbo7a8OQLoE3i6a7ZXBDY1CIBjyqTEw4nxu_B48-wJCGxOC7KsaRg-9fhB8WFig2D_0OobQlgN_sZZLzU15oEf6Z8heFf_wRveJ2AsJWtTesdygOr6UVZo4NOS6bCgYA1aZWetwKPbcP9yv7oqZ6b46-dpw6nuztH_A0PTUnm6pAnp0vzvKUPZOalQOC1fN4VjC9b8cdDgIJ'
    }
  ];

  // Auto-generate a descriptive ID based on item Name and category
  useEffect(() => {
    if (newItem.name) {
      const acronym = newItem.name.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, 'ITM');
      const categoryAbbr = newItem.category.slice(0, 3).toUpperCase();
      const randomSfx = Math.floor(100 + Math.random() * 900);
      setNewItem(prev => ({
        ...prev,
        id: `GMF-${categoryAbbr}-${acronym}-${randomSfx}`
      }));
    }
  }, [newItem.name, newItem.category]);

  // Calculations
  const totalStock = products.reduce((acc, p) => acc + p.stock_count, 0);
  const totalValuation = products.reduce((acc, p) => acc + (p.price_inr * p.stock_count), 0);
  const lowStockCount = products.filter(p => p.stock_count <= 10).length;
  const totalRevenue = sales.reduce((acc, s) => acc + s.total, 0);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const { id, name, category, price_inr, stock_count, image_url, description, badge } = newItem;

    // Strict requirements validation
    if (!id || !name || !category || !price_inr || !stock_count || !image_url) {
      setErrorMsg('Mandatory schema error: All product attributes are required.');
      return;
    }

    const parsedPrice = Number(price_inr);
    const parsedStock = Number(stock_count);

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setErrorMsg('Price validation error: Must provide valid positive rupee values.');
      return;
    }

    if (isNaN(parsedStock) || parsedStock < 0) {
      setErrorMsg('Inventory stock error: Count must be a valid non-negative integer.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddProduct({
        id,
        name,
        category,
        price_inr: parsedPrice,
        stock_count: parsedStock,
        image_url,
        description: description || undefined,
        badge: badge || undefined,
      });

      setSuccessMsg(`Database updated. Product "${name}" registered successfully.`);
      
      // Clear form except for categories defaults
      setNewItem({
        id: '',
        name: '',
        category: 'Clothes',
        price_inr: '',
        stock_count: '',
        image_url: '',
        description: '',
        badge: 'New Collection'
      });
      onRefresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'Server rejected product creation form logs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async (id: string, name: string) => {
    let confirmed = false;
    try {
      confirmed = window.confirm(`Permanently delete "${name}" from inventory data models?`);
    } catch (e) {
      // Graceful fallback for iframe sandbox restriction
      confirmed = true;
    }
    if (!confirmed) return;
    try {
      await onDeleteProduct(id);
      setSuccessMsg(`Product "${name}" successfully deleted from current schema state.`);
      onRefresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'Database error, failed to delete catalog entity.');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" id="admin-portal-dashboard">
      
      {/* Upper Notification Banners */}
      {successMsg && (
        <div className="mb-6 bg-[#0A0A0A] border border-[#F27D26]/20 p-4 text-[#F27D26] text-xs font-mono uppercase tracking-wider flex items-center justify-between">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="text-[#F27D26] hover:text-white font-black font-mono">X</button>
        </div>
      )}
      {errorMsg && (
        <div className="mb-6 bg-[#0A0A0A] border border-red-500/20 p-4 text-red-500 text-xs font-mono uppercase tracking-wider flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg('')} className="text-red-500 hover:text-white font-black font-mono">X</button>
        </div>
      )}

      {/* Bento Stats Banner Map */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
        
        {/* Total Valuations */}
        <div className="border border-white/10 bg-[#0A0A0A] p-5">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="font-display text-[10px] font-black uppercase tracking-widest">Catalog Value</span>
            <div className="flex h-8 w-8 items-center justify-center bg-white/5 text-[#F27D26]">
              <IndianRupee className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2.5 font-mono text-lg font-bold text-white sm:text-xl">
            ₹{totalValuation.toLocaleString('en-IN')}
          </p>
          <p className="mt-1 text-[9px] text-[#F27D26] uppercase font-bold tracking-wider flex items-center gap-0.5">
            <TrendingUp className="h-3 w-3" />
            Live Inventory Audit
          </p>
        </div>

        {/* Sum of Products */}
        <div className="border border-white/10 bg-[#0A0A0A] p-5">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="font-display text-[10px] font-black uppercase tracking-widest">Total Stock</span>
            <div className="flex h-8 w-8 items-center justify-center bg-white/5 text-white/60">
              <Box className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2.5 font-mono text-lg font-bold text-white sm:text-xl">
            {totalStock} <span className="text-xs text-zinc-400 font-normal uppercase">units</span>
          </p>
          <p className="mt-1 text-[9px] text-zinc-500 uppercase font-mono tracking-wider">
            Across {products.length} registered models
          </p>
        </div>

        {/* Low Stock Warning */}
        <div className="border border-white/10 bg-[#0A0A0A] p-5">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="font-display text-[10px] font-black uppercase tracking-widest">Stock Alerts</span>
            <div className="flex h-8 w-8 items-center justify-center bg-[#F27D26]/10 text-[#F27D26]">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2.5 font-mono text-lg font-bold text-white sm:text-xl">
            {lowStockCount} <span className="text-xs text-zinc-400 font-normal uppercase">items</span>
          </p>
          <p className="mt-1 text-[9px] text-[#F27D26] uppercase font-bold tracking-widest">
            Requires attention (Stock ≤ 10)
          </p>
        </div>

        {/* Total Earned */}
        <div className="border border-white/10 bg-[#0A0A0A] p-5">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="font-display text-[10px] font-black uppercase tracking-widest">Processed Funds</span>
            <div className="flex h-8 w-8 items-center justify-center bg-white/5 text-white/60">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2.5 font-mono text-lg font-bold text-white sm:text-xl">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </p>
          <p className="mt-1 text-[9px] text-zinc-500 uppercase font-mono tracking-wider">
            Confirmed: {sales.length} customer orders
          </p>
        </div>
      </div>

      {/* Tabs Header Switchers */}
      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-4">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`font-display text-xs font-black uppercase tracking-widest pb-2 relative transition-all ${
              activeTab === 'inventory' 
                ? 'text-[#F27D26] border-b-2 border-[#F27D26]' 
                : 'text-zinc-500 hover:text-[#F27D26]'
            }`}
            id="tab-inventory-btn"
          >
            Inventory Schema
          </button>
          <button
            onClick={() => setActiveTab('ledger')}
            className={`font-display text-xs font-black uppercase tracking-widest pb-2 relative transition-all ${
              activeTab === 'ledger' 
                ? 'text-[#F27D26] border-b-2 border-[#F27D26]' 
                : 'text-zinc-500 hover:text-[#F27D26]'
            }`}
            id="tab-ledger-btn"
          >
            Transactions Ledger ({sales.length})
          </button>
        </div>

        {/* Utility panel controls */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onRefresh}
            className="flex items-center gap-1.5 border border-white/20 bg-transparent px-3.5 py-2 text-[10px] font-black uppercase tracking-widest text-[#F27D26] hover:bg-white hover:text-black transition-colors"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Sync DB</span>
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#F27D26]" />
            <input
              type="text"
              placeholder="Filter list..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#151515] text-[#F5F5F5] border border-white/15 py-1.5 pl-9 pr-3 text-xs outline-none focus:border-[#F27D26] tracking-wide placeholder-zinc-650 font-mono"
            />
          </div>
        </div>
      </div>

      {activeTab === 'inventory' ? (
        <div className="mt-8 flex flex-col gap-8 lg:flex-row">
          
          {/* Action form side: "Add New Item" */}
          <div className="lg:w-1/3">
            <div className="rounded-2xl border border-zinc-150 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 border-b border-zinc-100 pb-3 mb-5">
                <PlusCircle className="h-5 w-5 text-luxury-red" />
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-luxury-dark">
                  Add New Item
                </h3>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                
                {/* Product Name */}
                <div>
                  <label className="block font-display text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={newItem.name}
                    onChange={handleFormInputChange}
                    placeholder="E.g. Traditional Linen Kurta"
                    className="w-full rounded-lg border border-zinc-250 bg-zinc-50/50 p-2.5 text-xs outline-none focus:bg-white focus:border-luxury-red transition-all"
                    id="add-product-name"
                  />
                </div>

                {/* Schema database code */}
                <div>
                  <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-0.5">
                    Schema Unique ID (Automated)
                  </label>
                  <input
                    type="text"
                    name="id"
                    required
                    readOnly
                    value={newItem.id}
                    placeholder="GMF-CLO-XYZ-010"
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-100 p-2.5 font-mono text-[11px] text-zinc-500 cursor-not-allowed select-all outline-none"
                    id="add-product-id"
                  />
                </div>

                {/* Category & Badge */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-display text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={newItem.category}
                      onChange={handleFormInputChange}
                      className="w-full rounded-lg border border-zinc-250 bg-zinc-50/50 p-2.5 text-xs outline-none focus:bg-white focus:border-luxury-red transition-all cursor-all"
                      id="add-product-category"
                    >
                      <option value="Clothes">Clothes</option>
                      <option value="Shoes">Shoes</option>
                      <option value="Slippers">Slippers</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-display text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1 font-sans">
                      Badge Text
                    </label>
                    <input
                      type="text"
                      name="badge"
                      value={newItem.badge}
                      onChange={handleFormInputChange}
                      placeholder="E.g. New Launch"
                      className="w-full rounded-lg border border-zinc-250 bg-zinc-50/50 p-2.5 text-xs outline-none focus:bg-white focus:border-luxury-red transition-all"
                    />
                  </div>
                </div>

                {/* Price (INR) & Stock count */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-display text-[10px] font-bold uppercase tracking-wider text-[#1c1b1b] mb-1">
                      Price (₹ INR) *
                    </label>
                    <input
                      type="number"
                      name="price_inr"
                      required
                      min={10}
                      value={newItem.price_inr}
                      onChange={handleFormInputChange}
                      placeholder="₹ 1499"
                      className="w-full rounded-lg border border-zinc-250 bg-zinc-50/50 p-2.5 text-xs outline-none focus:bg-white focus:border-luxury-red transition-all font-mono"
                      id="add-product-price"
                    />
                  </div>

                  <div>
                    <label className="block font-display text-[10px] font-bold uppercase tracking-wider text-[#1c1b1b] mb-1">
                      Stock Level *
                    </label>
                    <input
                      type="number"
                      name="stock_count"
                      required
                      min={0}
                      value={newItem.stock_count}
                      onChange={handleFormInputChange}
                      placeholder="100"
                      className="w-full rounded-lg border border-zinc-250 bg-zinc-50/50 p-2.5 text-xs outline-none focus:bg-white focus:border-luxury-red transition-all font-mono"
                      id="add-product-stock"
                    />
                  </div>
                </div>

                {/* Image URL Specification */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-display text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                      Image Asset URL *
                    </label>
                    <span className="font-mono text-[9px] text-zinc-400">Pasted or Selected presets</span>
                  </div>
                  <input
                    type="url"
                    name="image_url"
                    required
                    value={newItem.image_url}
                    onChange={handleFormInputChange}
                    placeholder="https://..."
                    className="w-full rounded-lg border border-zinc-250 bg-zinc-50/50 p-2.5 text-xs outline-none focus:bg-white focus:border-luxury-red transition-all font-mono"
                    id="add-product-image"
                  />

                  {/* High Quality quick clicks for testing assets */}
                  <div className="mt-2.5 p-3 rounded-xl bg-[#FAF9F6] border border-zinc-150 sm:block">
                    <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wide mb-1.5 font-sans">
                      Quick Preset Testing Images
                    </p>
                    <div className="space-y-1.5 flex flex-col">
                      {STATIC_ASSETS_PRESETS.map((asset, k) => (
                        <button
                          key={k}
                          type="button"
                          onClick={() => setNewItem(prev => ({ ...prev, image_url: asset.url }))}
                          className="w-full text-left text-[11px] text-luxury-red font-medium hover:underline truncate"
                        >
                          Use: {asset.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Product Description */}
                <div>
                  <label className="block font-display text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                    Item Description
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    value={newItem.description}
                    onChange={handleFormInputChange}
                    placeholder="Describe fine craftsmanship details..."
                    className="w-full rounded-lg border border-zinc-250 bg-zinc-50/50 p-2.5 text-xs outline-none focus:bg-white focus:border-luxury-red transition-all"
                  />
                </div>

                {/* Submit actions */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-luxury-red py-3 text-xs font-bold uppercase tracking-wide text-white hover:bg-luxury-dark transition-all shadow-md shadow-luxury-red/10 animate-fade-in"
                  id="submit-product-btn"
                >
                  {isSubmitting ? 'Registering catalog logs...' : 'Save & Register Product'}
                </button>
              </form>
            </div>
          </div>

          {/* Database management grid list */}
          <div className="flex-1">
            <div className="overflow-hidden rounded-2xl border border-zinc-150 bg-white">
              <div className="border-b border-zinc-100 p-5.5 flex items-center justify-between bg-[#FAF9F6]/40">
                <h4 className="font-display text-sm font-bold uppercase tracking-wider text-luxury-dark">
                  Registered Inventory Database ({filteredProducts.length})
                </h4>
                <p className="font-mono text-[10px] text-zinc-400">Showing active models in JSON store</p>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="p-12 text-center text-zinc-400 text-xs">
                  No products match current schema queries.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-b border-zinc-100 bg-zinc-50 font-display text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                        <th className="p-4.5">Entity</th>
                        <th className="p-4.5">ID & Category</th>
                        <th className="p-4.5">Price</th>
                        <th className="p-4.5">Stock level</th>
                        <th className="p-4.5 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 font-sans">
                      {filteredProducts.map((p) => {
                        const isOutOfStock = p.stock_count <= 0;
                        const isLowStock = p.stock_count > 0 && p.stock_count <= 10;
                        return (
                          <tr key={p.id} className="hover:bg-zinc-52 transition-colors">
                            <td className="p-4.5 flex items-center gap-3">
                              <img
                                src={p.image_url}
                                alt={p.name}
                                referrerPolicy="no-referrer"
                                className="h-12 w-10 rounded object-cover object-top bg-zinc-100"
                              />
                              <div>
                                <p className="font-display font-semibold text-luxury-dark text-[13px]">{p.name}</p>
                                {p.badge && (
                                  <span className="inline-block rounded bg-luxury-lightpink px-1.5 py-0.2 font-mono text-[9px] font-semibold text-luxury-red uppercase">
                                    {p.badge}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="p-4.5 font-mono text-zinc-400 text-[11px]">
                              <p className="text-zinc-600 font-semibold">{p.id}</p>
                              <p>{p.category}</p>
                            </td>
                            <td className="p-4.5 font-mono font-bold text-luxury-dark text-[13px]">
                              ₹{p.price_inr.toLocaleString('en-IN')}
                            </td>
                            <td className="p-4.5 font-mono">
                              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                                isOutOfStock 
                                  ? 'bg-rose-50 text-rose-700 font-bold border border-rose-100'
                                  : isLowStock
                                    ? 'bg-amber-50 text-amber-700 font-semibold border border-amber-100'
                                    : 'text-zinc-650 bg-zinc-50'
                              }`}>
                                {p.stock_count} units
                              </span>
                            </td>
                            <td className="p-4.5 text-center">
                              <button
                                onClick={() => handleDeleteItem(p.id, p.name)}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-50 hover:text-red-600 transition-colors"
                                title="Remove item permanently"
                                id={`delete-product-${p.id}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Ledger tab representing transaction histories */
        <div className="mt-8">
          <div className="overflow-hidden rounded-2xl border border-zinc-150 bg-white">
            <div className="border-b border-zinc-105 bg-[#FAF9F6]/40 p-5.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-luxury-red" />
                <h4 className="font-display text-sm font-bold uppercase tracking-wider text-luxury-dark">
                  Executed Sales Ledger
                </h4>
              </div>
              <span className="font-mono text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded">
                Server-Validated Secure Logs
              </span>
            </div>

            {sales.length === 0 ? (
              <div className="p-16 text-center text-zinc-400 text-xs">
                No purchases executed on this browser session yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-100 bg-zinc-50 font-display text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                      <th className="p-4.5">Sale ID</th>
                      <th className="p-4.5">Timestamp</th>
                      <th className="p-4.5">Client Details</th>
                      <th className="p-4.5">Order Breakdown</th>
                      <th className="p-4.5">Taxes (5%)</th>
                      <th className="p-4.5">Total Paid</th>
                      <th className="p-4.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 font-mono text-zinc-600 text-[11px]">
                    {[...sales].reverse().map((sale) => (
                      <tr key={sale.id} className="hover:bg-zinc-52 transition-colors">
                        <td className="p-4.5 font-bold text-luxury-dark text-[12px]">{sale.id}</td>
                        <td className="p-4.5 font-mono text-zinc-400">{sale.timestamp}</td>
                        <td className="p-4.5 font-sans leading-relaxed text-[11px]">
                          <p className="font-bold text-luxury-dark">{sale.customer.name}</p>
                          <p className="text-zinc-500 text-[10px]">{sale.customer.phone}</p>
                          <p className="text-zinc-400 text-[9px] truncate max-w-[150px]">{sale.customer.address}</p>
                        </td>
                        <td className="p-4.5 font-sans">
                          {sale.items.map((it, idx) => (
                            <p key={idx} className="text-zinc-550 text-[11px]">
                              • <span className="font-semibold">{it.productName}</span> x{it.quantity}
                            </p>
                          ))}
                        </td>
                        <td className="p-4.5 text-zinc-400 font-mono">₹{sale.gst}</td>
                        <td className="p-4.5 font-bold text-luxury-red font-mono text-[13px]">
                          ₹{sale.total.toLocaleString('en-IN')}
                        </td>
                        <td className="p-4.5 text-center">
                          <span className={`inline-block rounded-full px-2.5 py-0.5 text-[9px] font-semibold uppercase ${
                            sale.status === 'Paid' 
                              ? 'bg-emerald-50 text-emerald-700' 
                              : 'bg-amber-50 text-amber-700'
                          }`}>
                            {sale.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
