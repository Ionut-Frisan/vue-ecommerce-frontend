import {defineStore} from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: {
      items: []
    }
  }),
  getters: {
    getCartItems() {
      return this.cart.items;
    },
    getCartLength() {
      return this.cart.items.length;
    },
    getCartTotalPrice() {
      return this.cart.items.reduce((current, item) => {
        return ((100 - item.product.discount) /100 * item.product.price) * item.quantity + current
      }, 0)
    },
    getSubtotalById: (state) => (id) => {
      const item = state.cart.items.filter((it) => {
        return it.product._id === id
      });
      if(item){
        return (item[0]?.product?.price || 0) * item[0].quantity * (1 - item[0]?.product?.discount / 100)
      }
      return 0.00
    }
  },
  actions: {
    initializeStore() {
      if (localStorage.getItem("cart")) {
        this.cart = JSON.parse(localStorage.getItem("cart"));
      } else {
        localStorage.setItem("cart", JSON.stringify(this.cart));
      }
    },
    addToCart(item) {
      const exists = this.cart.items.filter(
        (i) => i.product._id === item.product._id
      );
      if (exists.length) {
        exists[0].quantity =
          parseInt(exists[0].quantity) + parseInt(item.quantity);
      } else {
        this.cart.items.push(item);
      }
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },
    clearCart() {
      this.cart = {items: []};
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },
    updateQuantity(item, newQuantity) {
      if(newQuantity === 0){
        this.cart.items = this.cart.items.filter((i) => {
          return i.product._id !== item.product._id
        })
      }
      else{
        const exists = this.cart.items.filter(
          (i) => i.product._id === item.product._id
        );
        if (exists.length) {
          exists[0].quantity =
            parseInt(newQuantity);
        } else {
          this.cart.items.push({product: item.product, quantity: newQuantity});
        }
      }
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },
    removeFromCart(item){
      this.updateQuantity(item, 0);
    }
  }
})
