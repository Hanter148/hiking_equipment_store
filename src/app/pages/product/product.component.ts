import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  product: any;
  comments: string[] = [];
  newComment: string = '';
  currency: string = '$';
  showModal: boolean = false;
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProductById(+id).subscribe(data => {
        this.product = data;
        this.loadComments();
      });
    }
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }
  
  addToCart(): void {
    this.cartService.addToCart(this.product, this.quantity);
    this.closeModal();
    this.router.navigate(['/cart']);
  }
  
  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  addComment(): void {
    if (this.newComment.trim()) {
      const sanitizedComment = this.newComment.replace(/(кокос|банан|поганий|@)/g, '*');
      this.comments.push(sanitizedComment);
      if (this.product && this.product.id) {
        localStorage.setItem(this.product.id, JSON.stringify(this.comments));
      }
      this.newComment = '';
    }
  }

  loadComments(): void {
    if (this.product && this.product.id) {
      const savedComments = localStorage.getItem(this.product.id);
      this.comments = savedComments ? JSON.parse(savedComments) : [];
    }
  }
}