import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductDataService {
  private productsSubject = new BehaviorSubject<any[]>(this.loadProducts());
  products$: Observable<any[]> = this.productsSubject.asObservable();

  constructor() {}

  private loadProducts(): any[] {
    const products = localStorage.getItem('products');
    return products ? JSON.parse(products) : [];
  }

  private saveProducts(products: any[]): void {
    localStorage.setItem('products', JSON.stringify(products));
    this.productsSubject.next(products);
  }

  getProducts(): Observable<any[]> {
    return this.products$;
  }

  addProduct(product: any): Observable<void> {
    const products = this.loadProducts();
    products.push(product);
    this.saveProducts(products);
    return of();
  }

  deleteProduct(productId: number): Observable<void> {
    let products = this.loadProducts();
    products = products.filter(p => p.id !== productId);
    this.saveProducts(products);
    return of();
  }

  updateProduct(updatedProduct: any): Observable<void> {
    const products = this.loadProducts();
    const index = products.findIndex(p => p.id === updatedProduct.id);
    if (index !== -1) {
      products[index] = updatedProduct;
      this.saveProducts(products);
    }
    return of();
  }

  getProductById(id: number): Observable<any> {
    const product = this.loadProducts().find(p => p.id === id);
    return of(product || {});
  }
}