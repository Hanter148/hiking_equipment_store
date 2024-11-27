import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  // private apiUrl = 'http://localhost:4200/products';
  private apiUrl = 'http://localhost:3000/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addProduct(product: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, product);
  }

  updateProduct(product: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${product.id}`, product);
  }

  deleteProduct(productId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${productId}`);
  }
}





// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { ProductDataService } from '../services/product-data.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class AdminService {

//   constructor(private productDataService: ProductDataService) {}

//   getProducts(): Observable<any[]> {
//     return this.productDataService.getProducts();
//   }

//   addProduct(product: any): Observable<void> {
//     return this.productDataService.addProduct(product);
//   }

//   updateProduct(product: any): Observable<void> {
//     return this.productDataService.updateProduct(product);
//   }

//   deleteProduct(productId: number): Observable<void> {
//     return this.productDataService.deleteProduct(productId);
//   }
// }