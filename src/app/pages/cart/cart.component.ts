import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  totalAmount: number = 0;
  currency: string = '$';
  showConfirmation: boolean = false;
  order: { recipientName: string, phone: string, delivery: string, payment: string } = {
    recipientName: '',
    phone: '',
    delivery: '',
    payment: ''
  };
  branches: string[] = ['Відділення 1', 'Відділення 2'];

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.updateCart();
  }

  increaseQuantity(productId: number): void {
    this.cartService.increaseQuantity(productId);
    this.updateCart();
  }

  decreaseQuantity(productId: number): void {
    this.cartService.decreaseQuantity(productId);
    this.updateCart();
  }

  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
    this.updateCart();
  }

  checkout(): void {
    this.cartService.checkout().subscribe(() => {
      this.cartItems = [];
      this.totalAmount = 0;
    }, error => {
      console.error('Checkout error', error);
    });
  }

  submitOrder(): void {
    if (this.validateOrder()) {
      this.cartService.checkout().subscribe(() => {
        this.showConfirmation = true;
        this.cartItems = [];
        this.totalAmount = 0;
        this.order = { recipientName: '', phone: '', delivery: '', payment: '' };
      }, error => {
        console.error('Checkout error', error);
      });
    }
  }

  closeConfirmation(): void {
    this.showConfirmation = false;
  }

  formatPhone(value: string): string {
    const digitsOnly = value.replace(/[^\d]/g, '');
    if (digitsOnly.length === 12) {
      return `+${digitsOnly}`;
    } else {
      return digitsOnly;
    }
  }

  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    const digitsOnly = value.replace(/[^\d]/g, '');
    if (digitsOnly.length > 12) {
      value = digitsOnly.slice(0, 12);
    }
    input.value = this.formatPhone(value);
    this.order.phone = input.value;
  }

  validatePhone(): string | null {
    const phonePattern = /^\+\d{12}$/;
    const formattedPhone = this.order.phone.replace(/[^\d]/g, '');
    if (formattedPhone.length !== 12) {
      return 'Некоректний формат телефону. Введіть 12 цифр.';
    } else if (!phonePattern.test(this.order.phone)) {
      return 'Некоректний формат телефону. Використовуйте формат: +380000000000.';
    } else {
      return null;
    }
  }

  validateRecipientName(event: Event): void {
    const input = event.target as HTMLInputElement;
    const namePattern = /^[a-zA-Zа-яА-ЯіІєЄґҐ\s]*$/;
    if (!namePattern.test(input.value)) {
      input.value = input.value.replace(/[^a-zA-Zа-яА-ЯіІєЄґҐ\s]/g, '');
    }
  }

  private updateCart(): void {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.calculateTotal();
    });
  }

  private calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  }

  private validateOrder(): boolean {
    const phoneError = this.validatePhone();
    if (phoneError) {
      alert(phoneError);
      return false;
    }
    return true;
  }
}