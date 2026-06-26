import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router, NavigationEnd } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from './core/services/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  isDarkMode = false;
  showNav = true;
  isMobile = false;
  isLoggedIn$: Observable<boolean>;

  constructor(private router: Router, private authService: AuthService) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    
    this.checkScreenSize();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showNav = !event.url.includes('/login');
      }
    });
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
