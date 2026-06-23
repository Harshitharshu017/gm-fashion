/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowRight, Sparkles, Footprints, Grid, Shirt, Compass, Smile, Eye } from 'lucide-react';
import { Product, ProductCategory } from '../types';
import { ProductCard } from './ProductCard';

interface CustomerStorefrontProps {
  products: Product[];
  onOpenDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
}

export const CustomerStorefront: React.FC<CustomerStorefrontProps> = ({
  products,
  onOpenDetails,
  onAddToCart,
  wishlist,
  onToggleWishlist
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');
  const [storeSearch, setStoreSearch] = useState('');

  // Filtering products
  const filtered = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(storeSearch.toLowerCase()) || 
                          p.category.toLowerCase().includes(storeSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="customer-storefront-wrapper">
      
      {/* Luxury Hero Banner Section with Outfit & JetBrains Mono Fonts */}
      <section className="relative overflow-hidden bg-luxury-dark text-white px-6 py-20 md:py-28 lg:px-8 border-b-2 border-luxury-gold/20">
        {/* Abstract luxury gold decoration lines */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ffe088] to-[#570013] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>

        <div className="mx-auto max-w-7xl relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-luxury-gold/10 px-3.5 py-1 font-mono text-[10px] uppercase tracking-widest text-luxury-gold border border-luxury-gold/35">
              <Sparkles className="h-3.5 w-3.5 animate-spin" />
              Festive Season Catalog • 2026
            </span>
            <h2 className="mt-6 font-display text-4xl font-light tracking-wide text-white sm:text-6xl uppercase">
              GM FASHION <br/>
              <span className="font-semibold text-luxury-gold">HERITAGE LUXURY</span>
            </h2>
            <p className="mt-4 text-base text-zinc-300 font-sans leading-relaxed max-w-xl">
              Authentic Indian craftsmanship combined seamlessly with sophisticated contemporary style templates. Experience the finest embroidered kurtas, bespoke footwear, and cozy home slippers.
            </p>
            
            <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-4">
              <button 
                onClick={() => setSelectedCategory('Clothes')}
                className="rounded-xl bg-[#ffe088] px-5.5 py-3 font-display text-xs font-bold uppercase tracking-widest text-[#1c1b1b] hover:bg-white transition-all shadow-md"
              >
                Explore Apparel
              </button>
              <button 
                onClick={() => setSelectedCategory('Shoes')}
                className="rounded-xl border border-white/20 px-5.5 py-3 font-display text-xs font-semibold uppercase tracking-widest text-white hover:bg-white/10 transition-all"
              >
                Handcrafted Footwear
              </button>
            </div>
          </div>

          <div className="flex-1 w-full max-w-md relative">
            {/* Visual styling reflecting Stitch.ai brand alignment */}
            <div className="aspect-[4/5] overflow-hidden rounded-2xl border-4 border-luxury-gold/15 bg-zinc-800 shadow-2xl relative group">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9cAt8i5Q-QK3fkfxR3lCSUlvh7PCtQOpxFid5FA07Egaxb8VsYx5JDZkvYN5iABywVFzOe_57cNeIXYDQzxyID-uebx1pxTCL3XpF_PAd_1BCkRIhwH7KlK7i9BJyS4P2d-8p5vOPkTWW4ruoacCvLF4s5SRSGBdokjBs2WSin0QbtNrc7xIrnkPFEGpeSe3b3JVcxWysno23TihgD63W5ECAUcgfcDECSTK4AVl98Ni_t9oZykEofmkLun-EHhnAUTKzIyuT6F00"
                alt="GM Heritage Showcase"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover object-top transition-transform duration-[4000ms] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
                <span className="font-mono text-[9px] text-luxury-gold uppercase tracking-widest">Model: GMF-KUR-001</span>
                <h4 className="font-display font-bold text-white uppercase tracking-wide text-sm mt-0.5">Embroidered Heritage Kurta</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Aesthetic Category Highlight Cards */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h3 className="font-display text-sm font-extrabold uppercase tracking-widest text-luxury-dark text-center mb-8">
          Browse GM Collections By Style
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Clothes Card */}
          <button
            onClick={() => setSelectedCategory('Clothes')}
            className={`group text-left relative overflow-hidden rounded-2xl border p-6.5 transition-all focus:outline-none ${
              selectedCategory === 'Clothes' 
                ? 'bg-luxury-red text-white border-luxury-red shadow-xl shadow-luxury-red/15 scale-[1.02]' 
                : 'bg-white text-luxury-dark border-zinc-150 hover:border-luxury-red/40'
            }`}
            id="cat-clothes-bento-btn"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50/20 text-[#ffe088] group-hover:scale-110 transition-transform">
              <Shirt className="h-5.5 w-5.5" />
            </div>
            <h4 className="mt-5 font-display text-lg font-bold uppercase tracking-wider">
              Trending Apparel
            </h4>
            <p className="mt-1 text-xs opacity-80 leading-normal font-sans">
              Elegant Indian kurtas, shirts, tunics, and bespoke ceremonial wear templates.
            </p>
          </button>

          {/* Shoes Card */}
          <button
            onClick={() => setSelectedCategory('Shoes')}
            className={`group text-left relative overflow-hidden rounded-2xl border p-6.5 transition-all focus:outline-none ${
              selectedCategory === 'Shoes' 
                ? 'bg-luxury-red text-white border-luxury-red shadow-xl shadow-luxury-red/15 scale-[1.02]' 
                : 'bg-white text-luxury-dark border-zinc-150 hover:border-luxury-red/40'
            }`}
            id="cat-shoes-bento-btn"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50/20 text-[#ffe088] group-hover:scale-110 transition-transform">
              <Compass className="h-5.5 w-5.5" />
            </div>
            <h4 className="mt-5 font-display text-lg font-bold uppercase tracking-wider">
              Men's & Women's Shoes
            </h4>
            <p className="mt-1 text-xs opacity-80 leading-normal font-sans">
              Handcrafted leather mojaris, casual footwear, and sophisticated wedding shoes.
            </p>
          </button>

          {/* Slippers Card */}
          <button
            onClick={() => setSelectedCategory('Slippers')}
            className={`group text-left relative overflow-hidden rounded-2xl border p-6.5 transition-all focus:outline-none ${
              selectedCategory === 'Slippers' 
                ? 'bg-luxury-red text-white border-luxury-red shadow-xl shadow-luxury-red/15 scale-[1.02]' 
                : 'bg-white text-luxury-dark border-zinc-150 hover:border-luxury-red/40'
            }`}
            id="cat-slippers-bento-btn"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50/20 text-[#ffe088] group-hover:scale-110 transition-transform">
              <Footprints className="h-5.5 w-5.5" />
            </div>
            <h4 className="mt-5 font-display text-lg font-bold uppercase tracking-wider">
              Comfort Slippers
            </h4>
            <p className="mt-1 text-xs opacity-80 leading-normal font-sans">
              Plush velvet house slippers, tan moccasins, and lounge comfort collections.
            </p>
          </button>

        </div>
      </section>

      {/* Product Mesh, Filtering and Search */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 border-t border-zinc-100">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h3 className="font-display text-xl font-bold tracking-tight text-luxury-dark">
              Active Shopping Showcase
            </h3>
            <p className="font-mono text-[10px] text-zinc-400">
              Showing {filtered.length} products aligned in the active database
            </p>
          </div>

          {/* Inline filters */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`rounded-lg px-3.5 py-1.5 font-display text-xs font-semibold transition-all ${
                selectedCategory === 'All' 
                  ? 'bg-luxury-red text-white' 
                  : 'bg-white text-zinc-550 border border-zinc-200 hover:bg-zinc-50'
              }`}
              id="filter-all-btn"
            >
              All Arrivals
            </button>
            <button
              onClick={() => setSelectedCategory('Clothes')}
              className={`rounded-lg px-3.5 py-1.5 font-display text-xs font-semibold transition-all ${
                selectedCategory === 'Clothes' 
                  ? 'bg-luxury-red text-white' 
                  : 'bg-white text-zinc-550 border border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              Apparel
            </button>
            <button
              onClick={() => setSelectedCategory('Shoes')}
              className={`rounded-lg px-3.5 py-1.5 font-display text-xs font-semibold transition-all ${
                selectedCategory === 'Shoes' 
                  ? 'bg-luxury-red text-white' 
                  : 'bg-white text-zinc-550 border border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              Footwear
            </button>
            <button
              onClick={() => setSelectedCategory('Slippers')}
              className={`rounded-lg px-3.5 py-1.5 font-display text-xs font-semibold transition-all ${
                selectedCategory === 'Slippers' 
                  ? 'bg-luxury-red text-white' 
                  : 'bg-white text-zinc-550 border border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              Slippers
            </button>

            <div className="h-6 w-[1px] bg-zinc-200 mx-1"></div>

            <input
              type="text"
              placeholder="Search storefront..."
              value={storeSearch}
              onChange={(e) => setStoreSearch(e.target.value)}
              className="rounded-lg border border-zinc-200 bg-white py-1.5 px-3 text-xs outline-none focus:border-luxury-red"
              id="storefront-search"
            />
          </div>
        </div>

        {/* Dynamic Fallback Loop and Products Grid */}
        {products.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-zinc-300 p-16 text-center animate-pulse" id="empty-launching-soon-fallback">
            <Smile className="mx-auto h-12 w-12 text-luxury-red mb-4" />
            <span className="font-display text-lg font-bold text-luxury-red uppercase tracking-wider block" id="fallback-message">
              New collection launching soon!
            </span>
            <p className="mt-2 text-xs text-zinc-400 font-sans max-w-sm mx-auto leading-relaxed">
              We are currently reorganizing our luxury catalogs. Please click on the Administrative Portal in the top-right to register fresh fashion entities.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-zinc-400 text-xs">
            No items in selected categories match: "{storeSearch}".
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" id="products-mesh-grid">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenDetails={onOpenDetails}
                onAddToCart={onAddToCart}
                isWishlisted={wishlist.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        )}
      </section>

      {/* Trust guarantees footer elements */}
      <footer className="bg-zinc-50 border-t border-zinc-150 mt-16 font-sans">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h5 className="font-display text-xs font-bold uppercase tracking-widest text-[#1c1b1b] mb-3">Authenticity Check</h5>
              <p className="text-xs text-zinc-400 leading-relaxed">Every item in our collection is crafted by certified master weavers and cobblers, preserving age-old regional traditional methods.</p>
            </div>
            <div>
              <h5 className="font-display text-xs font-bold uppercase tracking-widest text-[#1c1b1b] mb-3">Complimentary Handover</h5>
              <p className="text-xs text-zinc-400 leading-relaxed">Complimentary courier shipment and tracking across India. Fast 3-day premium velvet packaging handover on prepaid UPI logs.</p>
            </div>
            <div>
              <h5 className="font-display text-xs font-bold uppercase tracking-widest text-[#1c1b1b] mb-3">Secure Ledger Gate</h5>
              <p className="text-xs text-zinc-400 leading-relaxed">Full-stack database node ensures real-time secure ledger checks. No double-allocation of stock occurs.</p>
            </div>
          </div>
          <p className="mt-12 text-center text-[10px] text-zinc-400 font-mono">
            © 2026 GM FASHION CO. Ltd. All rights reserved. Registered Indian boutique identifier.
          </p>
        </div>
      </footer>

    </div>
  );
};
