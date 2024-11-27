import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ProductDataService } from '../services/product-data.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private productDataService: ProductDataService) {}

  getProducts(): Observable<any[]> {
    return this.productDataService.getProducts();
  }

  getProductById(id: number): Observable<any> {
    return this.productDataService.getProductById(id);
  }
}