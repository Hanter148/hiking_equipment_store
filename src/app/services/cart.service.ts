import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

interface Product {
  id: number;
  price: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<CartItem[]>(this.loadCart());
  cart$: Observable<CartItem[]> = this.cartSubject.asObservable();

  constructor() {}

  private loadCart(): CartItem[] {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  }

  private saveCart(cart: CartItem[]): void {
    localStorage.setItem('cart', JSON.stringify(cart));
    this.cartSubject.next(cart);
  }

  getCartItems(): Observable<CartItem[]> {
    return this.cart$;
  }

  getCartItemCount(): Observable<number> {
    return this.cart$.pipe(
      map(cartItems => cartItems.reduce((acc, item) => acc + item.quantity, 0))
    );
  }

  addToCart(product: any, quantity: number): void {
    const cart = this.loadCart();
    const itemIndex = cart.findIndex(item => item.product.id === product.id);
  
    if (itemIndex === -1) {
      cart.push({ product, quantity });
    } else {
      cart[itemIndex].quantity += quantity;
    }
  
    this.saveCart(cart);
  }
  
  increaseQuantity(productId: number): void {
    const cart = this.loadCart();
    const itemIndex = cart.findIndex(item => item.product.id === productId);

    if (itemIndex !== -1) {
      cart[itemIndex].quantity += 1;
      this.saveCart(cart);
    }
  }

  decreaseQuantity(productId: number): void {
    const cart = this.loadCart();
    const itemIndex = cart.findIndex(item => item.product.id === productId);

    if (itemIndex !== -1 && cart[itemIndex].quantity > 1) {
      cart[itemIndex].quantity -= 1;
      this.saveCart(cart);
    }
  }

  removeFromCart(productId: number): void {
    let cart = this.loadCart();
    cart = cart.filter(item => item.product.id !== productId);
    this.saveCart(cart);
  }

  checkout(): Observable<void> {
    return of(this.saveCart([])).pipe(map(() => {}));
  }
}