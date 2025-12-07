

import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-printer',
  template: `
    <div style="padding: 20px;">
      <h2>🛒 Print Order Test</h2>
      <p>This button sends a single request to the local print server to print on 3 default printers.</p>
      <button (click)="sendPrintJob()" style="padding: 10px 20px; font-size: 16px;">
        Print Order to All 3 Printers
      </button>

      <p *ngIf="message" style="margin-top: 15px; font-weight: bold;">{{ message }}</p>
    </div>
  `,
  standalone: true,
  imports: [CommonModule]
})
export class Printer {
  // **CRITICAL:** Replace with the actual IP and Port of your Node.js server.
  // Example: http://192.168.1.50:3000
  private PRINT_SERVICE_URL = 'http://localhost:3000/print-order';

  message: string = '';

  // Mockup data for a sales order
  private mockOrder = {
    orderId: 'ORD-45892',
    date: new Date().toLocaleDateString(),
    customer: 'Acme Corp',
    items: [
      { sku: 'XYZ-101', name: 'Product Label', qty: 10 },
      { sku: 'ABC-202', name: 'Shipping Manifest', qty: 1 },
      { sku: 'DEF-303', name: 'Invoice', qty: 1 },
    ],
    total: 150.75,
    instructions: 'Handle with care. Print 3 copies for different departments.'
  };

  constructor(private http: HttpClient) {}

  sendPrintJob() {
    this.message = 'Sending print request...';

    // The payload sent to the Node.js server
    const payload = {
      printers: [
        'HP30138B472E54(HP Laser MFP 131 133 135-138)', // 👈 Printer 1 Name (e.g., Labels)
        '\\SERVER\\WarehousePrinter', // 👈 Printer 1 Name (e.g., Labels)
        '\\SERVER\\OfficeInvoice',    // 👈 Printer 2 Name (e.g., Invoices)
        '\\SERVER\\ShippingDock',     // 👈 Printer 3 Name (e.g., Manifests)
      ],
      orderData: this.mockOrder
    };

    this.http.post(this.PRINT_SERVICE_URL, payload).subscribe({
      next: (res: any) => {
        this.message = `✅ Print jobs successfully sent to the server. Status: ${res.status}`;
      },
      error: (err) => {
        console.error('Print service failed or is unreachable:', err);
        this.message = `❌ Error: Failed to reach the local print server. Check console.`;
      }
    });
  }
}
