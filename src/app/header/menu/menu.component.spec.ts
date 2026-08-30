import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DesktopMenuComponent } from './desktop-menu/desktop-menu.component';
import { MenuComponent } from './menu.component';

@Component({
  selector: 'app-desktop-menu',
  standalone: true,
  template: '',
})
class DesktopMenuStubComponent {}

describe('MenuComponent', () => {
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuComponent],
      providers: [provideRouter([])],
    })
      .overrideComponent(MenuComponent, {
        remove: { imports: [DesktopMenuComponent] },
        add: { imports: [DesktopMenuStubComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    fixture.detectChanges();
  });

  it('expõe um botão acessível para abrir e fechar o menu', () => {
    const button = fixture.nativeElement.querySelector('.menu-toggle') as HTMLButtonElement;
    const sideMenu = fixture.nativeElement.querySelector('#side-menu') as HTMLElement;

    expect(button.tagName).toBe('BUTTON');
    expect(button.getAttribute('aria-label')).toBe('Abrir menu');
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(sideMenu.getAttribute('aria-hidden')).toBe('true');
    expect(sideMenu.inert).toBeTrue();

    button.click();
    fixture.detectChanges();

    expect(button.getAttribute('aria-label')).toBe('Fechar menu');
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(sideMenu.classList).toContain('menu-open');
    expect(sideMenu.getAttribute('aria-hidden')).toBe('false');
    expect(sideMenu.inert).toBeFalse();
  });
});
