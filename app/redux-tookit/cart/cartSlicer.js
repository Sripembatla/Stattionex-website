import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  totalQuantity: 0,
  totalPrice: 0,
  totalmrp : 0
};

const cartSlicer = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart(state, action) {
      const {
        productId,
        name,
        variants,
        quantity,
        img,
        variantId,
        offer,
        itemId
      } = action.payload;
      console.log('is it calling')

      const existingItem = state.cartItems.find(
        (item) =>
          item.productId === productId &&
          item.variantId === variantId &&
          item.itemId ===  itemId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cartItems.push({
          productId,
          name,
          variants,
          quantity,
          img,
          variantId,
          offer,
          itemId
        });
      }

      state.totalQuantity += quantity;
      state.totalPrice += variants?.sellingPrice * quantity;
      state.totalmrp += variants?.mrp * quantity;
    },

   

    removeItemFromCart(state, action) {
      const { productId, variantId } = action.payload;
      console.log('action.payload.variantId:', variantId);
      console.log('action.payload.productId:', productId);
    
      const itemIndex = state.cartItems.findIndex(
        (item) =>
          item.productId === productId &&
          item.variantId === variantId
      );
      console.log('itemIndex:', itemIndex);
    
      if (itemIndex !== -1) {
        const itemToRemove = state.cartItems[itemIndex];
        console.log('itemToRemove:', itemToRemove);
    
        console.log('Cart before removal:', JSON.stringify(state.cartItems, null, 2));
    
        state.totalQuantity = Math.max(0, state.totalQuantity - itemToRemove.quantity);
        state.totalPrice = Math.max(0, state.totalPrice - itemToRemove.variants?.sellingPrice * itemToRemove.quantity);
        state.totalmrp = Math.max(0, state.mrp - itemToRemove.variants?.mrp * itemToRemove.quantity);
    
        state.cartItems.splice(itemIndex, 1);
    
        console.log('Cart after removal:', JSON.stringify(state.cartItems, null, 2));
      } else {
        console.warn('Item not found in cart. Nothing removed.');
      }
      console.log('state', state)
    },    

    updateItemQuantity(state, action) {
      const { productId, variantId, quantity, operation } = action.payload;
      const existingItem = state.cartItems.find(
        (item) =>
          item.productId === productId &&
          item.variantId === variantId
      );

      if (existingItem) {
        const quantityDifference = quantity - existingItem.quantity;

        if (operation === "increment") {
          existingItem.quantity = quantity;
          state.totalQuantity += quantityDifference;
          state.totalPrice += existingItem.variants?.sellingPrice * quantityDifference;
          state.totalmrp += existingItem.variants?.mrp * quantityDifference;
        } else if (operation === "decrement" && existingItem.quantity > 1) {
          existingItem.quantity = quantity;
          state.totalQuantity += quantityDifference;
          state.totalPrice += existingItem.variants?.sellingPrice * quantityDifference;
          state.totalmrp += existingItem.variants?.mrp * quantity;

        }
      }
    },

    clearCart() {
      return initialState;
    },
  },
});

export const {
  addItemToCart,
  removeItemFromCart,
  updateItemQuantity,
  clearCart,
} = cartSlicer.actions;

export default cartSlicer.reducer;