import { CommonModule } from '@angular/common';
import { Component, Signal } from '@angular/core';
import { MenuService } from 'src/app/services/menu/menu.service';
import { DesktopMenuComponent } from './desktop-menu/desktop-menu.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    DesktopMenuComponent
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.sass'],
})
export class MenuComponent {
  constructor(public menuService: MenuService) {}

  changeIconBurguer(): void {
    this.menuService.toggleMenu(); 
  }
}
