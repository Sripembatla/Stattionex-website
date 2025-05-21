"use client";
import { Icon } from "@iconify/react";
import React, { useState } from "react";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Majestic Man", price: 299, quantity: 1, imageUrl: "/assets/images/cart-img.png" },
    { id: 2, name: "Majestic Man", price: 399, quantity: 1, imageUrl: "/assets/images/cart-img2.png" },
    { id: 3, name: "Majestic Man", price: 199, quantity: 1, imageUrl: "/assets/images/cart-img3.png" }
  ]);

  const handleQuantityChange = (id, amount) => {
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 70; // assuming flat shipping cost
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen p-4 lg:p-8 bg-gray-100">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items Section */}
        <div className="lg:col-span-2 bg-white rounded-lg p-4 lg:p-6">
          {cartItems.map((item) => (
            <div key={item.id} className="flex flex-col md:flex-row items-center justify-between  py-4">
              <div className="flex items-center justify-between  w-full md:w-auto  space-x-4">
                <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
                <div className="flex flex-col justify-center">
                  <p className="font-bold text-sm sm:text-base">{item.name}</p>
                  <p className="text-xs sm:text-sm text-gray-500">Kurta for men</p>
                </div>
              </div>
              <div className="flex items-center justify-between w-full mt-2 md:mt-0 md:w-auto">
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleQuantityChange(item.id, -1)} 
                    className="bg-gray-300 w-8 h-8 flex items-center justify-center rounded">
                    -
                  </button>
                  <p className="text-sm text-center">{item.quantity}</p>
                  <button 
                    onClick={() => handleQuantityChange(item.id, 1)} 
                    className="bg-gray-300 w-8 h-8 flex items-center justify-center rounded">
                    +
                  </button>
                </div>
                <div className="ml-4 flex items-center space-x-2">
                  <p className="font-bold">Rs. {item.price * item.quantity}</p>
                  <button 
                    onClick={() => removeItem(item.id)} 
                    className="text-red-500 hover:text-red-700">
                    <Icon icon="carbon:trash-can" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="mt-4 text-center">
            <button className="bg-primary text-white px-4 py-2 rounded-lg w-full lg:w-auto">
              Checkout
            </button>
          </div>
        </div>

        {/* Summary Section */}
        <div className="bg-white rounded-lg p-4 lg:p-6 h-fit">
          <h3 className="font-bold mb-4">Do you have a voucher? (Optional)</h3>
          <div className="flex items-center space-x-2 mb-4">
            <input 
              type="text" 
              placeholder="Enter the code" 
              className="bg-gray-100 border border-gray-300 rounded py-2 px-4 w-full" 
            />
            <button className="bg-primary text-white px-4 py-2 rounded">
              Redeem
            </button>
          </div>
          <div className="border-t border-gray-300 py-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>Rs. {subtotal}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Shipping</span>
              <span>Rs. {shipping}</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-4">
              <span>Total</span>
              <span>Rs. {total}</span>
            </div>
          </div>
          <button className="bg-primary w-full text-white py-2 rounded-lg mt-4">
            Save And Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
