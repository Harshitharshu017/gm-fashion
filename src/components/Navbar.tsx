/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShoppingBag, ShieldAlert, Sparkles, Heart, Menu, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';

interface NavbarProps {
  currentView: 'store' | 'admin';
  setView: (view: 'store' | 'admin') => void;
  cart: CartItem[];
  setIsCartOpen: (open: boolean) => void;
  wishlistCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setView,
  cart,
  setIsCartOpen,
  wishlistCount
}) => {
  const totalCartQty = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#050505]/90 backdrop-blur-md">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Identity */}
        <button 
          onClick={() => setView('store')}
          className="group flex items-center gap-3 text-left focus:outline-none"
          id="nav-brand-logo"
        >
          <div className="flex h-12 w-12 items-center justify-center bg-[#F27D26] text-black shadow-lg shadow-[#F27D26]/10 transition-transform group-hover:scale-105">
            <span className="font-display text-2xl font-black tracking-tighter italic text-black">GM</span>
          </div>
          <div className="flex items-baseline gap-2">
            <h1 className="font-display text-3xl font-black tracking-tighter leading-none italic text-white uppercase sm:text-4xl">
              GM
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#F27D26] hidden sm:inline">
              Collection 2026
            </span>
          </div>
        </button>

        {/* View Switcher / Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Wishlist Link */}
          {currentView === 'store' && (
            <button 
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-[#F27D26] transition-colors"
              title="My Wishlist"
              id="wishlist-btn"
            >
              <Heart className="h-[21px] w-[21px]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#F27D26] text-[8px] font-black text-black antialiased">
                  {wishlistCount}
                </span>
              )}
            </button>
          )}

          {/* Shopping Bag / Cart Toggle */}
          {currentView === 'store' && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white transition-colors"
              title="Shopping Bag"
              id="cart-btn"
            >
              <ShoppingBag className="h-[21px] w-[21px]" />
              {totalCartQty > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#F27D26] text-[9px] font-black text-black antialiased">
                  {totalCartQty}
                </span>
              )}
            </button>
          )}

          <div className="h-6 w-[1px] bg-white/10"></div>

          {/* Mode Switching Toggle (Client storefront vs. Administrative portal) */}
          {currentView === 'store' ? (
            <button
              onClick={() => setView('admin')}
              className="flex items-center gap-1.5 border border-white/20 px-4 py-2 font-display text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white hover:text-black transition-colors duration-300"
              id="switch-admin-btn"
            >
              <ShieldAlert className="h-3.5 w-3.5 text-[#F27D26]" />
              <span>Admin Portal</span>
              <ArrowRight className="h-3 w-3 opacity-75" />
            </button>
          ) : (
            <button
              onClick={() => setView('store')}
              className="flex items-center gap-1.5 bg-[#F27D26] px-4 py-2 font-display text-[10px] font-bold uppercase tracking-widest text-black hover:bg-white hover:text-black transition-colors duration-300"
              id="switch-storefront-btn"
            >
              <Sparkles className="h-3.5 w-3.5 text-black" />
              <span>Shopper Storefront</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
