import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

@Injectable()
export class CheckoutService {
  constructor(private http: HttpClient) { }

  chargeStripe(token, currency, amount, stripe_secret_key) {
    let secret_key = stripe_secret_key;
    const headers = new HttpHeaders()
      .set("Content-Type", "application/x-www-form-urlencoded")
      .set("Authorization", "Bearer " + secret_key);
    var params = new HttpParams()
      .set("currency", currency)
      .set("amount", amount)
      .set("description", "description")
      .set("source", token);
    return new Promise(resolve => {
      this.http
        .post("https://api.stripe.com/v1/charges", params, {
          headers: headers
        })
        .subscribe(data => {
          resolve(data);
        });
    });
  }

}