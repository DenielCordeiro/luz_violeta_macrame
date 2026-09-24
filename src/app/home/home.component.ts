import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass'],
})
export class HomeComponent {
  // Estados modelados (loading, error, empty)
  // A integração real com NewsletterService e o endpoint /newsletter
  // está bloqueada até a confirmação do contrato do back-end.
  // Não gerar mocks tratados como funcionalidade pronta.

  isLoading = signal<boolean>(false);
  hasError = signal<boolean>(false);
  isEmpty = signal<boolean>(true);
}
