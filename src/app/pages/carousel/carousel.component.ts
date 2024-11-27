import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy, PLATFORM_ID, Inject, Input } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements AfterViewInit, OnDestroy {
  @ViewChild('slides') slides!: ElementRef<HTMLDivElement>;

  @Input() intervalForSlider = 10000;
  @Input() withBackground = false;
  @Input() showArrows = true;

  autoSlideSub!: Subscription;
  dragging = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  onClickLeft(): void {
    if (this.slides) {
      const slidesElement = this.slides.nativeElement;
      const slideWidth = slidesElement.scrollWidth / slidesElement.children.length;
      slidesElement.scrollLeft -= slideWidth;
      if (slidesElement.scrollLeft < 0) {
        slidesElement.scrollLeft = slidesElement.scrollWidth - slideWidth;
      }
    }
  }
  
  onClickRight(): void {
    if (this.slides) {
      const slidesElement = this.slides.nativeElement;
      const slideWidth = slidesElement.scrollWidth / slidesElement.children.length;
      slidesElement.scrollLeft += slideWidth;
      if (slidesElement.scrollLeft >= slidesElement.scrollWidth) {
        slidesElement.scrollLeft = 0;
      }
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.autoSlideSub = timer(this.intervalForSlider, this.intervalForSlider).subscribe(() => this.onClickRight());
    }
  }

  onDrag(event: MouseEvent | TouchEvent, type: string): void {
    if (type === 'start') {
      this.dragging = true;
    } else if (type === 'end') {
      this.dragging = false;
    } else if (type === 'move' && this.dragging) {
      const slidesElement = this.slides.nativeElement;
      const movement = event instanceof MouseEvent ? event.movementX : (event as TouchEvent).touches[0].clientX;
      slidesElement.scrollLeft -= movement;
    }
  }

  ngOnDestroy(): void {
    if (this.autoSlideSub) {
      this.autoSlideSub.unsubscribe();
    }
  }
}