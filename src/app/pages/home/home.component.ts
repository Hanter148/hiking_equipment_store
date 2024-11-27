import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarouselComponent } from '../carousel/carousel.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, CarouselComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  searchText: string = '';
  currency: string = '$';
  itemsPerPage: number = 5;
  currentPage: number = 1;
  totalPages: number = 1;
  pages: number[] = [];
  categories: string[] = [
    'Ліхтарики', 
    'Розумні годинники', 
    'Навушники', 
    'Туристичні Камери', 
    'Намети'];
  selectedCategory: string = 'all';

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
      this.filteredProducts = data;
      this.updatePagination();
    });
  }
  

  getPaginatedProducts(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = this.currentPage * this.itemsPerPage;
    return this.filteredProducts.slice(startIndex, endIndex);
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  onSearchTextChange(): void {
    this.applyFilters();
    this.updatePagination();
    this.currentPage = 1;
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
    this.updatePagination();
    this.currentPage = 1;
  }

  applyFilters(): void {
    let filtered = this.products;

    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === this.selectedCategory);
    }

    if (this.searchText) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }

    this.filteredProducts = filtered;
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  viewProduct(id: number): void {
    this.router.navigate([`/product/${id}`]);
  }
}