import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterModule],
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css'] 
})
export class NotFoundComponent implements OnInit {

  firstDigit = '4';
  secondDigit = '0';
  thirdDigit = '4';

  private randomNum(): number {
    return Math.floor(Math.random() * 9) + 1;
  }

  ngOnInit(): void {
    let i = 0;
    const time = 30;

    const loop3 = setInterval(() => {
      if (i > 40) {
        clearInterval(loop3);
        this.thirdDigit = '4';
      } else {
        this.thirdDigit = this.randomNum().toString();
        i++;
      }
    }, time);

    const loop2 = setInterval(() => {
      if (i > 80) {
        clearInterval(loop2);
        this.secondDigit = '0';
      } else {
        this.secondDigit = this.randomNum().toString();
        i++;
      }
    }, time);

    const loop1 = setInterval(() => {
      if (i > 100) {
        clearInterval(loop1);
        this.firstDigit = '4';
      } else {
        this.firstDigit = this.randomNum().toString();
        i++;
      }
    }, time);
  }
}