import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MenuService } from 'src/app/services/menu/menu.service';
import { MobileMenuComponent } from './mobile/mobile-menu.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    MobileMenuComponent,
    MatButtonModule,
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.sass'],
})
export class MenuComponent {
  constructor(public menuService: MenuService) {}

  public changeIconBurguer(): void {
    this.menuService.toggleMenu();
  }
}
