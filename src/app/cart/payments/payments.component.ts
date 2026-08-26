import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTabGroup, MatTab } from "@angular/material/tabs";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from 'src/app/services/cart/cart.service';
import { User } from 'src/app/interfaces/user.interface';
import { QRCodePix } from 'src/app/interfaces/qr-code.interface';

enum PaymentMethod {
  credit = "CREDIT",
  pix = "PIX",
  bankSlip = "BANKSLIP"
}

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [
    MatTabGroup,
    MatTab,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.sass'
})
export class PaymentsComponent implements OnInit {
  paymentMethods = PaymentMethod;

  QRCodePix: QRCodePix[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public cart: {
      finalValue: number,
      userProfile: User
    },
    public dialog: MatDialog,
    public dialogAddOrEdit: MatDialogRef<PaymentsComponent>,
    private cartService: CartService
  ) {}

  ngOnInit() {
    console.log("Dados do carrinho recebidos no componente de pagamentos: ", this.cart);
  }

  processPayment(method: PaymentMethod): void {
    switch (method) {
      case PaymentMethod.credit:
        console.log("Processando pagamento via cartão de crédito...");
        break;
      case PaymentMethod.pix:
        console.log("Gerando QR Code para pagamento via Pix...");
        this.paymentPIX();

        break;
      case PaymentMethod.bankSlip:
        console.log("Gerando boleto bancário...");
        break;
      default:
        console.log("Método de pagamento não reconhecido.");
    }
  }

  paymentPIX(): void {
    const PIXData = {
      valor: this.cart?.finalValue,
      profileCPF: this.cart.userProfile?.cpf,
      name: this.cart.userProfile?.name,
    };

    this.cartService.generatePix(PIXData)
      .then(response => {
        console.log("Resposta do servidor para pagamento via Pix: ", response);

        const pix: QRCodePix = {
          _id: 0,
          qrcode: (response as any).qrcode,
          imagemQrcode: (response as any).imagemQrcode,
          copyQRCode: (response as any).copyQRCode,
        };
        this.QRCodePix.push(pix);
      })
      .catch(error => {
        console.error("Erro ao processar pagamento via Pix: ", error);
      });
  }
}
