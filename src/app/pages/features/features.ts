import { Component } from '@angular/core';
import { Header } from '../header/header';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [Header],
  templateUrl: './features.html'
})
export class Features { }
