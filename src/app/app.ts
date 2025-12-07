import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Printer } from "./printer/printer/printer";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Printer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('printer');
}
