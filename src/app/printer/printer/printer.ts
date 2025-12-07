import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintService } from '../service/printer.service';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  category: string;
}

interface Order {
  orderNumber: number;
  tableNumber?: number;
  items: OrderItem[];
  total: number;
}

@Component({
  selector: 'app-printer',
  templateUrl: './printer.html',
  standalone: true,
  imports: [CommonModule],
})
export class PrinterComponent {
  // Sample order
  order = {
    orderNumber: 1,
    tableNumber: 5,
    items: [
      { name: 'Burger', quantity: 2, price: 12.5, category: 'kitchen' },
      { name: 'Burger', quantity: 2, price: 12.5, category: 'kitchen' },
      { name: 'Burger', quantity: 2, price: 12.5, category: 'kitchen' },
      { name: 'Burger', quantity: 2, price: 12.5, category: 'kitchen' },
      { name: 'Coke', quantity: 2, price: 3, category: 'bar' }
    ],
    total: 31
  };


  constructor(private printerService: PrintService) {}


 print() {
    const categoryDesigns = {
      kitchen: document.getElementById('kitchenDesign')?.innerHTML || '',
      bar: document.getElementById('barDesign')?.innerHTML || '',
      receipt: document.getElementById('receiptDesign')?.innerHTML || ''
    };

    this.printerService.printOrder({ order: this.order, categoryDesigns })
      .subscribe({
        next: res => console.log('Print result:', res),
        error: err => console.error('Print error:', err)
      });
  }
}
