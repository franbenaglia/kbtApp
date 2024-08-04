import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-bltemperature',
  templateUrl: './bltemperature.page.html',
  styleUrls: ['./bltemperature.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class BltemperaturePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
