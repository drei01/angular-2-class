import { Input, Component } from "@angular/core";
import { Cart, checkoutState } from "./Cart";
import { ProductStore } from "./ProductStore";
import { Payment } from "./Payment";

@Component({
  selector: "checkout",
  directives: [],
  styles: [`
    small.error {
      display: none;
    }
    .error small.error {
      display: block;
    }
  `],
  templateUrl: "app/Checkout.component.html",
})
export class Checkout {

  checkout: checkoutState;
  transaction: { successful?: boolean, pending?: boolean };

  constructor(public cart: Cart, private payment: Payment) {
    this.cart.checkoutState()
      .then(state => this.checkout = state)
  }

  submitted(form) {
    const prepared = Object.assign({}, form.value, {
      cardNumber: prepareCardNumber(form.value.cardNumber),
    });

    this.transaction = { pending: true };

    this.payment.successful()
      .then(() => {
        this.transaction = { successful: true };
      })
      .catch((e) => {
        this.transaction = { successful: false };
      })
  }

  paymentMessage() {
    if(!this.transaction) {
      return "":
    } else if(this.transaction.pending) {
      return "Sending your payment...";
    } else if(this.transaction.successful) {
      return "Your payment was successful!";
    } else {
      return "Your payment failed";
    }
  }

}

function prepareCardNumber(cardNumber: string): number {
  return cardNumber.replace(/\D/g,"");
}




