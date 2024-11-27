import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { provideHttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
  // providers: [provideHttpClient()]
})
export class AdminComponent implements OnInit {
  productName: string = '';
  productDescription: string = '';
  productImageUrl: string = '';
  productPrice: number | null = null;
  productCategory: string = '';
  products: any[] = [];
  categories: string[] = [
    'Ліхтарики',
    'Розумні Годинники',
    'Навушники',
    'Туристичні Камери',
    'Намети'
  ];

  showModal: boolean = false;
  showEditForm: boolean = false;
  productToDeleteId: number | null = null;
  productToEdit: any = null;

  imageUrlValid: boolean = true;
  nameError: string = '';
  descriptionError: string = '';
  imageUrlError: string = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  addProduct(): void {
    if (this.isFormValid()) {
      const newProduct = {
        id: Date.now(),
        name: this.productName,
        description: this.productDescription,
        imageUrl: this.productImageUrl,
        price: this.productPrice,
        category: this.productCategory
      };

      this.adminService.addProduct(newProduct).subscribe(() => {
        this.loadProducts();
        this.resetForm();
      });
    } else {
      alert('Будь ласка, заповніть усі поля коректно.');
    }
  }

  confirmDeleteProduct(id: number): void {
    this.productToDeleteId = id;
    this.showModal = true;
  }

  deleteProduct(): void {
    if (this.productToDeleteId !== null) {
      this.adminService.deleteProduct(this.productToDeleteId).subscribe(() => {
        this.loadProducts();
        this.closeModal();
      });
    }
  }

  openEditForm(product: any): void {
    this.productToEdit = { ...product };
    this.productName = product.name;
    this.productDescription = product.description;
    this.productImageUrl = product.imageUrl;
    this.productPrice = product.price;
    this.productCategory = product.category;
    this.showEditForm = true;
  }

  updateProduct(): void {
    if (this.isFormValid()) {
      const updatedProduct = {
        id: this.productToEdit.id,
        name: this.productName,
        description: this.productDescription,
        imageUrl: this.productImageUrl,
        price: this.productPrice,
        category: this.productCategory
      };

      this.adminService.updateProduct(updatedProduct).subscribe(() => {
        this.loadProducts();
        this.resetForm();
        this.showEditForm = false;
      });
    } else {
      alert('Будь ласка, заповніть усі поля коректно.');
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.productToDeleteId = null;
  }

  cancelEdit(): void {
    this.resetForm();
    this.showEditForm = false;
  }

  loadProducts(): void {
    this.adminService.getProducts().subscribe(data => {
      this.products = data;
    });
  }

  isFormValid(): boolean {
    return this.validateName(this.productName) &&
           this.validateDescription(this.productDescription) &&
           this.imageUrlValid &&
           this.productPrice !== null &&
           !!this.productCategory;
  }

  private resetForm(): void {
    this.productName = '';
    this.productDescription = '';
    this.productImageUrl = '';
    this.productPrice = null;
    this.productCategory = '';
    this.nameError = '';
    this.descriptionError = '';
    this.imageUrlError = '';
  }

  checkImageUrl(): void {
    this.validateImageUrl(this.productImageUrl).subscribe(isValid => {
      this.imageUrlValid = isValid;
      if (!isValid) {
        this.imageUrlError = 'Некоректний URL картинки. Перевірте URL і спробуйте ще раз.';
      } else {
        this.imageUrlError = '';
      }
    });
  }

  validateName(name: string): boolean {
    return /^[a-zA-Zа-яА-ЯґҐєЄіїІЇ\s+\-,.';]+$/.test(name);
  }

  validateDescription(description: string): boolean {
    return /^[a-zA-Zа-яА-ЯґҐєЄіїІЇ0-9\s+\-,.';]+$/.test(description);
  }

  validateImageUrl(url: string): Observable<boolean> {
    return new Observable<boolean>(observer => {
      const img = new Image();
      img.onload = () => {
        observer.next(true);
        observer.complete();
      };
      img.onerror = () => {
        observer.next(false);
        observer.complete();
      };
      img.src = url;

      return () => {
        img.onload = img.onerror = null;
      };
    }).pipe(
      catchError(() => of(false))
    );
  }

  onNameChange(): void {
    if (!this.validateName(this.productName)) {
      this.nameError = 'В поле для введення назви товару можна вводити лише літери (українські та англійські) та пробіли!';
    } else {
      this.nameError = '';
    }
  }

  onDescriptionChange(): void {
    if (!this.validateDescription(this.productDescription)) {
      this.descriptionError = 'В полі для введення опису товару можна вводити лише літери (українські та англійські), пробіли та цифри!';
    } else {
      this.descriptionError = '';
    }
  }
}