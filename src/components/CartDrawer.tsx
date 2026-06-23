/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShieldCheck, Ticket, Check, ReceiptText, ChevronLeft, Calendar } from 'lucide-react';
import { CartItem, OrderDetails, Product } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQty: (productId: string, size: string, change: number) => void;
  onRemoveItem: (productId: string, size: string) => void;
  onCheckoutSuccess: (updatedProducts: Product[], invoice: any) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onRemoveItem,
  onCheckoutSuccess,
  onClearCart
}) => {
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shipping' | 'success'>('cart');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0); // 10% discount
  const [appliedPromo, setAppliedPromo] = useState('');
  
  // Invoice state after successful full-stack checkout
  const [invoice, setInvoice] = useState<any>(null);

  // Address/Customer state
  const [customer, setCustomer] = useState<OrderDetails>({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    pinCode: '',
    paymentMethod: 'upi',
  });

  if (!isOpen) return null;

  // Invoice pricing calculations strictly following Stitch.ai and user specifications
  const subtotal = cart.reduce((acc, item) => acc + item.product.price_inr * item.quantity, 0);
  const discountAmount = Math.round(subtotal * (promoDiscount / 100));
  const subtotalAfterDiscount = subtotal - discountAmount;
  
  // Specific GST instruction: "apply a flat placeholder 5% GST"
  const gst = Math.round(subtotalAfterDiscount * 0.05);
  const grandTotal = subtotalAfterDiscount + gst;

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'GMFESTIVE') {
      setPromoDiscount(10);
      setAppliedPromo('GMFESTIVE');
      setErrorMsg('');
    } else if (promoCode.trim().toUpperCase() === 'GM500') {
      setPromoDiscount(15);
      setAppliedPromo('GM500');
      setErrorMsg('');
    } else {
      setErrorMsg('Invalid promo code. Try "GMFESTIVE" (10% Off) or "GM500" (15% Off)');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCustomer(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.fullName || !customer.phone || !customer.address || !customer.city || !customer.pinCode) {
      setErrorMsg('Please populate all shipping fields correctly.');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: cart,
          customerDetails: {
            ...customer,
            promoApplied: appliedPromo || undefined
          }
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Server rejected checkout process.');
      }

      setInvoice(result.sale);
      onCheckoutSuccess(result.updatedProducts, result.sale);
      setCheckoutStep('success');
      onClearCart();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Network failure executing remote checkout logs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" id="cart-drawer-root">
      {/* Dimmed Background Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity" 
        onClick={onClose}
      />

      <div 
        className="relative flex h-full w-full max-w-lg flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-200"
        id="cart-drawer-panel"
      >
        {/* Drawer Headers */}
        <div className="flex items-center justify-between border-b border-zinc-100 p-5.5">
          <div className="flex items-center gap-2">
            {checkoutStep === 'shipping' && (
              <button 
                onClick={() => setCheckoutStep('cart')}
                className="mr-1 hover:text-luxury-red text-zinc-500"
                title="Go Back"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            <h2 className="font-display text-lg font-bold uppercase tracking-wider text-luxury-dark">
              {checkoutStep === 'success' 
                ? 'Order Placed!' 
                : checkoutStep === 'shipping' 
                  ? 'Delivery Protocols' 
                  : 'Shopping Bag'}
            </h2>
            <span className="rounded bg-luxury-lightpink px-2.5 py-0.5 font-mono text-[10px] font-bold text-luxury-red">
              {checkoutStep === 'success' ? 'COM' : cart.reduce((acc, i) => acc + i.quantity, 0)} Items
            </span>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-150 hover:text-luxury-red transition-all"
            id="close-cart-btn"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Dynamic Inner Panel Viewports */}
        <div className="flex-1 overflow-y-auto p-5.5">
          {errorMsg && (
            <div className="mb-4 bg-red-50 text-red-700 text-xs p-3.5 rounded-lg border border-red-200 flex items-start gap-1.5 font-sans">
              <span className="font-bold">Error:</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {checkoutStep === 'cart' ? (
            cart.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center py-10">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-50 text-zinc-400 mb-4">
                  <ReceiptText className="h-7 w-7" />
                </div>
                <h3 className="font-display text-base font-semibold text-luxury-dark">Your bag is empty</h3>
                <p className="mt-1.5 text-xs text-zinc-400 max-w-xs leading-normal">
                  Add custom clothing, footwear, and Slippers from our luxury Indian heritage catalog.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 rounded-lg bg-luxury-red px-5 py-2.5 font-display text-xs font-semibold text-white hover:bg-luxury-dark transition-all"
                >
                  Return to Collection
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item, idx) => (
                  <div 
                    key={`${item.product.id}-${item.selectedSize}`}
                    className="flex gap-4 p-3.5 border border-zinc-100 rounded-xl bg-[#FAF9F6]/50 hover:bg-white transition-colors"
                  >
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="h-20 w-16 rounded-lg object-cover object-top bg-zinc-50 flex-shrink-0"
                    />
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-display text-xs font-medium text-luxury-dark line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.product.id, item.selectedSize)}
                            className="text-zinc-400 hover:text-red-500"
                            title="Remove item"
                            id={`remove-item-${item.product.id}-${idx}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1 font-mono text-[10px] text-zinc-400">
                          <span>Size: <span className="font-semibold text-zinc-500">{item.selectedSize}</span></span>
                          <span className="h-1 w-1 rounded-full bg-zinc-300"></span>
                          <span>Category: {item.product.category}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2.5">
                        {/* Adjust qty */}
                        <div className="flex items-center border border-zinc-200 bg-white rounded-md overflow-hidden">
                          <button
                            onClick={() => onUpdateQty(item.product.id, item.selectedSize, -1)}
                            className="px-2 py-0.5 hover:bg-zinc-100 font-bold text-zinc-500"
                          >
                            -
                          </button>
                          <span className="px-3 font-mono text-xs font-semibold text-luxury-dark">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQty(item.product.id, item.selectedSize, 1)}
                            className="px-2 py-0.5 hover:bg-zinc-100 font-bold text-zinc-500"
                          >
                            +
                          </button>
                        </div>
                        
                        <span className="font-mono text-xs font-bold text-luxury-dark">
                          ₹{(item.product.price_inr * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Promo Code Fields */}
                <div className="border-t border-zinc-100 pt-4 mt-6">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Ticket className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 gap-1" />
                      <input
                        type="text"
                        placeholder="PROMO CODE (e.g. GMFESTIVE)"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="w-full rounded-lg border border-zinc-200 bg-zinc-50/50 py-2.5 pl-9.5 pr-4 text-xs font-mono tracking-wider placeholder:text-zinc-400 outline-none focus:bg-white focus:border-luxury-red transition-all"
                        id="promo-input"
                      />
                    </div>
                    <button
                      onClick={handleApplyPromo}
                      className="rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-luxury-red transition-colors"
                      id="apply-promo-btn"
                    >
                      Apply
                    </button>
                  </div>
                  {appliedPromo && (
                    <div className="mt-2 text-emerald-700 text-[11px] font-semibold bg-emerald-50 px-2.5 py-1.5 rounded flex items-center gap-1">
                      <Check className="h-3.5 w-3.5" />
                      Active: {appliedPromo} ({promoDiscount}% Discount Applied!)
                    </div>
                  )}
                </div>
              </div>
            )
          ) : checkoutStep === 'shipping' ? (
            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div className="rounded-xl border border-zinc-100 bg-[#FAF9F6]/50 p-4">
                <h3 className="font-display text-xs font-bold uppercase tracking-wider text-luxury-dark mb-3">
                  Summary Bill Breakdown
                </h3>
                <div className="space-y-2.5 font-mono text-xs">
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Promo Discount ({promoDiscount}%)</span>
                      <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {/* Strict spec flat 5% GST layout */}
                  <div className="flex justify-between text-zinc-400">
                    <span>GST Tax (5%)</span>
                    <span>₹{gst.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="border-t border-zinc-200/60 pt-2 flex justify-between font-bold text-luxury-red">
                    <span>Grand Total</span>
                    <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3.5 pt-2">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={customer.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter customer name"
                    className="w-full rounded-lg border border-zinc-250 bg-white p-3 text-xs outline-none focus:ring-1 focus:ring-luxury-red focus:border-luxury-red transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    maxLength={13}
                    value={customer.phone}
                    onChange={handleInputChange}
                    placeholder="Enter valid phone (e.g. +91 9876543210)"
                    className="w-full rounded-lg border border-zinc-250 bg-white p-3 text-xs outline-none focus:ring-1 focus:ring-luxury-red focus:border-luxury-red transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                    Street Address & House No
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={customer.address}
                    onChange={handleInputChange}
                    placeholder="E.g. Flat 304, Royal Elite Residency"
                    className="w-full rounded-lg border border-zinc-250 bg-white p-3 text-xs outline-none focus:ring-1 focus:ring-luxury-red focus:border-luxury-red transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={customer.city}
                      onChange={handleInputChange}
                      placeholder="Mumbai"
                      className="w-full rounded-lg border border-zinc-250 bg-white p-3 text-xs outline-none focus:ring-1 focus:ring-luxury-red focus:border-luxury-red transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                      PIN Code
                    </label>
                    <input
                      type="text"
                      name="pinCode"
                      required
                      maxLength={6}
                      value={customer.pinCode}
                      onChange={handleInputChange}
                      placeholder="400001"
                      className="w-full rounded-lg border border-zinc-250 bg-white p-3 text-xs outline-none focus:ring-1 focus:ring-luxury-red focus:border-luxury-red transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                    Secure Payment Protocol
                  </label>
                  <select
                    name="paymentMethod"
                    value={customer.paymentMethod}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-zinc-250 bg-white p-3 text-xs outline-none focus:ring-1 focus:ring-luxury-red focus:border-luxury-red transition-all"
                  >
                    <option value="upi">UPI Express / Netbanking (₹)</option>
                    <option value="card">Secured Credit/Debit Card</option>
                    <option value="cod">Cash On Delivery (COD)</option>
                  </select>
                </div>
              </div>
            </form>
          ) : (
            /* Success screen detailing dynamic invoice summary specifications */
            invoice && (
              <div className="flex flex-col items-stretch space-y-5 py-4">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm mb-3">
                    <ShieldCheck className="h-7 w-7" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#1c1b1b]">Invoice Authenticated</h3>
                  <p className="mt-1 text-xs text-zinc-400">Order Ref: {invoice.id}</p>
                </div>

                {/* Simulated Shipment Timeline */}
                <div className="rounded-2xl bg-zinc-55 border border-zinc-150 p-4 font-sans">
                  <div className="flex items-center gap-2 mb-3.5 text-xs font-semibold text-[#1c1b1b]">
                    <Calendar className="h-4 w-4 text-luxury-red" />
                    <span>Courier Tracking Summary</span>
                  </div>
                  <div className="relative border-l-2 border-zinc-200 ml-2 space-y-4 text-[11px]">
                    <div className="relative pl-5">
                      <div className="absolute left-[-5px] top-1.5 h-2 w-2 rounded-full bg-emerald-600" />
                      <p className="font-semibold text-zinc-700">Order Register Completed</p>
                      <p className="text-zinc-400">Database decremented stock counts instantly ({invoice.timestamp.split(' ')[0]})</p>
                    </div>
                    <div className="relative pl-5">
                      <div className="absolute left-[-5px] top-1.5 h-2 w-2 rounded-full bg-zinc-300" />
                      <p className="font-semibold text-zinc-400">Transit Processing Protocol</p>
                      <p className="text-zinc-400">Awaiting cargo assignment at central terminal</p>
                    </div>
                  </div>
                </div>

                {/* Final receipt layout strictly showing INR format */}
                <div className="rounded-2xl border border-zinc-150 bg-white p-5 space-y-3 font-mono text-xs">
                  <h4 className="font-display text-xs font-extrabold uppercase text-luxury-dark border-b border-zinc-100 pb-2">
                    Receipt Ledger
                  </h4>
                  {invoice.items.map((it: any, k: number) => (
                    <div key={k} className="flex justify-between text-zinc-500 text-[11px]">
                      <span>{it.productName} (x{it.quantity})</span>
                      <span>₹{(it.price * it.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                  <div className="border-t border-zinc-150/60 pt-2 space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-zinc-400">Subtotal</span>
                      <span>₹{invoice.subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-zinc-400">GST (5%)</span>
                      <span>₹{invoice.gst.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between font-bold text-luxury-red text-sm border-t border-zinc-100 pt-1.5">
                      <span>Total Billed</span>
                      <span>₹{invoice.total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setCheckoutStep('cart');
                    onClose();
                  }}
                  className="w-full rounded-xl bg-luxury-dark py-3.5 font-display text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-luxury-red transition-all text-center"
                >
                  Continue Shopping
                </button>
              </div>
            )
          )}
        </div>

        {/* Dynamic lower drawers with calculations */}
        {checkoutStep !== 'success' && cart.length > 0 && (
          <div className="border-t border-zinc-100 bg-[#FAF9F6] p-5.5 space-y-4">
            <div className="space-y-2 font-mono text-xs text-zinc-500">
              <div className="flex justify-between">
                <span>Total Items</span>
                <span>{cart.reduce((acc, i) => acc + i.quantity, 0)} units</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold text-[11px]">
                  <span>Active Code: {appliedPromo}</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              {/* Sells with the dynamic 5% GST tag */}
              <div className="flex justify-between">
                <span>GST Tax (5%)</span>
                <span>₹{gst.toLocaleString('en-IN')}</span>
              </div>
              <div className="border-t border-zinc-200/80 pt-2 flex justify-between font-display text-base font-bold text-luxury-red">
                <span>Total Bill</span>
                <span>₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {checkoutStep === 'cart' ? (
              <button
                onClick={() => setCheckoutStep('shipping')}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-luxury-red py-4 font-display text-sm font-semibold text-white shadow-lg shadow-luxury-red/10 hover:bg-luxury-dark transition-all"
                id="start-checkout-btn"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-4 font-display text-sm font-semibold text-white shadow-lg hover:bg-emerald-700 transition-all cursor-pointer"
                id="submit-order-btn"
              >
                {isSubmitting ? (
                  <span className="animate-pulse">Locking dataset logs...</span>
                ) : (
                  <>
                    <span>Place Order & Transact</span>
                    <ShieldCheck className="h-4.5 w-4.5 text-luxury-gold" />
                  </>
                )}
              </button>
            )}

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-zinc-400 font-mono">
              <ShieldCheck className="h-3.5 w-3.5 text-zinc-400" />
              <span>Full-Stack Persistent Ledger Verified</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
