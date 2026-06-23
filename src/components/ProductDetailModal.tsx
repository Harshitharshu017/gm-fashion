/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Heart, ShoppingBag, Check, ShieldCheck, RefreshCw } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, selectedSize: string) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [successAnimation, setSuccessAnimation] = useState<boolean>(false);

  useEffect(() => {
    if (product) {
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      } else {
        setSelectedSize('Standard Size');
      }
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      }
      setQuantity(1);
      setSuccessAnimation(false);
    }
  }, [product]);

  if (!product) return null;

  const isOutOfStock = product.stock_count <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    onAddToCart(product, quantity, selectedSize);
    setSuccessAnimation(true);
    setTimeout(() => {
      setSuccessAnimation(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" id="product-detail-modal-bg">
      {/* Dark Dim Overlays */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      <div 
        className="relative flex w-full max-w-4xl flex-col items-stretch overflow-hidden rounded-3xl bg-white shadow-2xl md:flex-row animate-in fade-in zoom-in-95 duration-200"
        id="product-detail-modal-panel"
      >
        {/* Close Toggle */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-zinc-500 hover:text-luxury-red shadow-md hover:scale-105 transition-all"
          id="close-detail-modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Visual Showcase Stage */}
        <div className="relative md:w-1/2 aspect-square md:aspect-auto md:h-auto bg-zinc-50 overflow-hidden">
          <img
            src={product.image_url}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover object-top"
          />

          {product.badge && (
            <span className="absolute top-6 left-6 rounded-full bg-luxury-red px-4 py-1.5 font-mono text-[10px] font-bold tracking-wider uppercase text-white shadow-md">
              {product.badge}
            </span>
          )}

          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
              <span className="rounded-full bg-zinc-900 border border-zinc-700 px-5 py-2 font-display text-[12px] font-bold tracking-widest text-zinc-300 uppercase shadow-lg">
                SOLD OUT
              </span>
            </div>
          )}
        </div>

        {/* Configuration panel */}
        <div className="flex flex-col justify-between p-6 md:w-1/2 md:p-10 max-h-[85vh] sm:max-h-none overflow-y-auto">
          <div>
            {/* Headers */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">
                {product.category}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-300"></span>
              <span className="font-mono text-xs uppercase text-zinc-400">
                DB ID: {product.id}
              </span>
            </div>

            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-luxury-dark sm:text-3xl">
              {product.name}
            </h2>

            {/* Price Indicator */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-mono text-2xl font-bold text-luxury-red">
                ₹{product.price_inr.toLocaleString('en-IN')}
              </span>
              {product.original_price_inr && (
                <span className="font-mono text-sm text-zinc-400 line-through">
                  ₹{product.original_price_inr.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="mt-5 text-sm leading-relaxed text-zinc-500">
              {product.description || 'Elevate your seasonal catalog with this custom clothing release from GM Collections.'}
            </p>

            {/* Size Configuration Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-6.5">
                <div className="flex items-center justify-between">
                  <span className="font-display text-xs font-semibold uppercase tracking-wider text-luxury-dark">
                    Select Size
                  </span>
                  <span className="font-mono text-[11px] text-zinc-400">
                    Category: {product.category === 'Clothes' ? 'Apparel Chart' : 'Shoe Fit Chart'}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => !isOutOfStock && setSelectedSize(size)}
                      disabled={isOutOfStock}
                      className={`flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 font-mono text-xs font-medium transition-all focus:outline-none ${
                        isOutOfStock 
                          ? 'border-zinc-200 text-zinc-300 cursor-not-allowed'
                          : selectedSize === size
                            ? 'border-luxury-red bg-luxury-red text-white shadow-md shadow-luxury-red/10'
                            : 'border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50'
                      }`}
                      id={`modal-size-${size}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colorways Swatches */}
            {product.colors && product.colors.length > 0 && (
              <div className="mt-6">
                <span className="font-display text-xs font-semibold uppercase tracking-wider text-luxury-dark">
                  Artisanal Colorway
                </span>
                <div className="mt-2.5 flex items-center gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`relative flex h-7.5 w-7.5 items-center justify-center rounded-full border border-black/10 transition-transform hover:scale-110 focus:outline-none`}
                      style={{ backgroundColor: color }}
                      title={color}
                      id={`modal-color-${color}`}
                    >
                      {selectedColor === color && (
                        <Check className="h-3.5 w-3.5 text-white mix-blend-difference" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Inventory Count Indicator */}
            <div className="mt-6 flex items-center justify-between border-t border-b border-zinc-100 py-3 font-mono text-[11px] text-zinc-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Original Brand Guarantee
              </span>
              <span>
                Available: <span className="font-semibold text-luxury-dark">{product.stock_count} units</span>
              </span>
            </div>
          </div>

          <div className="mt-8">
            {!isOutOfStock && (
              <div className="flex items-center gap-4 mb-4">
                <span className="font-display text-xs font-semibold uppercase tracking-wider text-luxury-dark">
                  Quantity
                </span>
                <div className="flex items-center border border-zinc-200 rounded-lg bg-zinc-50 overflow-hidden">
                  <button
                    onClick={() => setQuantity(val => Math.max(1, val - 1))}
                    className="px-3.5 py-1.5 bg-white text-zinc-500 hover:bg-zinc-100 border-r border-zinc-200 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-5 font-mono text-sm font-semibold text-luxury-dark">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(val => Math.min(product.stock_count, val + 1))}
                    className="px-3.5 py-1.5 bg-white text-zinc-500 hover:bg-zinc-100 border-l border-zinc-200 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || successAnimation}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3.5 font-display text-sm font-semibold transition-all duration-300 ${
                  successAnimation 
                    ? 'bg-emerald-600 text-white'
                    : isOutOfStock
                      ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed border border-zinc-200'
                      : 'bg-luxury-red text-white hover:bg-luxury-dark hover:shadow-lg shadow-luxury-red/10'
                }`}
                id="modal-add-to-cart"
              >
                {successAnimation ? (
                  <>
                    <Check className="h-4 w-4 animate-bounce" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4 text-[#ffe088]" />
                    <span>{isOutOfStock ? 'Sold Out' : 'Add to Collection Bag'}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onToggleWishlist(product.id)}
                className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-all ${
                  isWishlisted 
                    ? 'bg-luxury-lightpink/40 border-luxury-red/30 text-luxury-red' 
                    : 'border-zinc-200 text-zinc-500 hover:bg-zinc-50'
                }`}
                id="modal-wishlist-toggle"
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
