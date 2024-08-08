import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonMenuButton, IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonRouterLink, IonHeader, IonButtons } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { paperPlaneOutline, paperPlaneSharp } from 'ionicons/icons';
import { CookieService } from 'ngx-cookie-service';
import { User } from './model/User';
import { AuthService } from './services/auth.service';
// https://medium.com/swlh/angular-spring-boot-kafka-how-to-stream-realtime-data-the-reactive-way-510a0f1e5881
// https://github.com/capacitor-community/bluetooth-le
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonMenuButton, IonButtons, IonHeader, RouterLink, RouterLinkActive, CommonModule, IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterLink, IonRouterOutlet],
})
export class AppComponent implements OnInit {

  public appPages = [
    { title: 'Test', url: '/folder/test', icon: 'paper-plane' },
    { title: 'Blt Temp', url: 'folder/bltemperature', icon: 'paper-plane' },

  ];
  constructor(private cookieService: CookieService, private authService: AuthService, private router: Router) {
    addIcons({ paperPlaneOutline, paperPlaneSharp });
  }
  user: User = new User();

  showMenu: boolean = true;

  ngOnInit() {

    let token: string = this.cookieService.get('token');
    let userName: string = this.cookieService.get('username');


    if (token) {
      this.authService.setLogin(true)
      this.authService.setUser(userName, token);
      this.user.name = userName;
      this.user.token = token;
    }

    if (!this.authService.isLoggedIn()) {
      this.showMenu = false;
      this.router.navigate((['login']));
    } else {
      this.showMenu = true;
    }

  }
}
