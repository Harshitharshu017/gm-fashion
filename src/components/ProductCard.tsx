/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Heart, ShoppingCart, Info, Eye } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetails,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
}) => {
  const isOutOfStock = product.stock_count <= 0;
  const isCriticalStock = product.stock_count > 0 && product.stock_count <= 5;

  return (
    <div 
      className="group relative flex flex-col overflow-hidden bg-[#0A0A0A] border border-white/10 transition-all duration-300 hover:border-[#F27D26]/70"
      id={`product-card-${product.id}`}
    >
      {/* Product Image Stage */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#111]">
        <img
          src={product.image_url}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
          id={`product-image-${product.id}`}
        />

        {/* Shadow overlays for styling */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Heart/Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className={`absolute top-4 right-4 flex h-9 w-9 items-center justify-center transition-all duration-300 active:scale-95 ${
            isWishlisted 
              ? 'bg-[#F27D26] text-black' 
              : 'bg-black/60 border border-white/10 text-white hover:bg-white hover:text-black hover:border-white'
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          id={`wishlist-toggle-${product.id}`}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Badge Indicator */}
        {product.badge && (
          <span 
            className="absolute top-4 left-4 bg-[#F27D26] text-black text-[9px] px-2 py-0.5 font-bold uppercase tracking-widest"
            id={`badge-${product.id}`}
          >
            {product.badge}
          </span>
        )}

        {/* Out Of Stock Overlay */}
        {isOutOfStock ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 p-4 text-center">
            <span className="bg-black border border-white/20 px-4 py-1.5 font-display text-[10px] font-black tracking-widest uppercase text-white">
              Sold Out
            </span>
            <p className="mt-2 text-[10px] uppercase font-bold tracking-wider text-zinc-500">RE-INDEXING INCOMING</p>
          </div>
        ) : isCriticalStock ? (
          <span className="absolute bottom-4 left-4 bg-orange-950/80 border border-[#F27D26]/30 px-2 py-0.5 font-mono text-[9px] font-bold tracking-wider text-[#F27D26] uppercase">
            ONLY {product.stock_count} LEFT!
          </span>
        ) : null}

        {/* Hover Action Layer */}
        {!isOutOfStock && (
          <div className="absolute inset-x-4 bottom-4 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenDetails(product);
                }}
                className="flex flex-1 items-center justify-center gap-1.5 bg-white py-2.5 font-display text-[10px] font-black uppercase tracking-wider text-black hover:bg-[#F27D26] hover:text-white transition-colors"
                id={`quick-view-${product.id}`}
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Quick View</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(product);
                }}
                className="flex items-center justify-center bg-[#F27D26] p-2.5 text-black hover:bg-white transition-colors animate-none"
                title="Add to Cart"
                id={`add-cart-icon-${product.id}`}
              >
                <ShoppingCart className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Information Grid */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
            {product.category}
          </p>
          <span className="font-mono text-[9px] text-zinc-650 uppercase tracking-widest">
            ID: {product.id.split('-').pop()}
          </span>
        </div>

        <button
          onClick={() => onOpenDetails(product)}
          className="mt-1.5 flex-1 text-left font-display text-base font-bold tracking-tight text-white hover:text-[#F27D26] transition-colors focus:outline-none"
          id={`product-title-${product.id}`}
        >
          {product.name}
        </button>

        {/* Pricing Layout strictly matching requirements */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-mono text-[17px] font-extrabold text-[#F27D26]" id={`product-price-${product.id}`}>
            ₹{product.price_inr.toLocaleString('en-IN')}
          </span>
          {product.original_price_inr && (
            <span className="font-mono text-xs text-[#F5F5F5]/40 line-through" id={`product-original-price-${product.id}`}>
              ₹{product.original_price_inr.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
