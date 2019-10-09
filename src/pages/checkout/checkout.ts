import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  AlertController
} from "ionic-angular";
import { NgForm } from "@angular/forms";
import { AngularFireAuth } from "@angular/fire/auth";
import {
  AngularFireDatabase,
  AngularFireObject,
  AngularFireList
} from "@angular/fire/database";
// import {
//   PayPal,
//   PayPalPayment,
//   PayPalConfiguration
// } from "@ionic-native/paypal";
import { Stripe } from "@ionic-native/stripe";
import { CheckoutService } from "./checkout.service";
import {
  Braintree,
  // ApplePayOptions,
  PaymentUIOptions
} from "@ionic-native/braintree";


// const payPalEnvironmentSandbox = "AcgkbqWGamMa09V5xrhVC8bNP0ec9c37DEcT0rXuh7hqaZ6EyHdGyY4FCwQC-fII-s5p8FL0RL8rWPRB";
const publishableKey = "pk_test_mhy46cSOzzKYuB2MuTWuUb34";
const stripe_secret_key = "sk_test_GsisHcPqciYyG8arVfVe2amE";

// const merchantId = "bbn2tzfk3zbq2jqr";
// const public_key = "d2qg75y3q8zb8rff";
// const private_key = "9cc7ba1d73b912d74e5bb197b24ef6d0";
const braintree_token = "sandbox_3tt6pwn3_bbn2tzfk3zbq2jqr";
// const braintree_token = "sandbox$4gv8zndgpdy6gnvt$e3c0c77402cbf5ba88bc4c76f1f85dc9";

@IonicPage()
@Component({
  selector: "page-checkout",
  templateUrl: "checkout.html",
  providers: [Stripe, Braintree, CheckoutService] //, PayPal, 
})
export class CheckoutPage {
  date: any;
  orderId: any;
  order: any = {};
  userId: any;
  userDetails: any = {
    email: "",
    name: "",
    userid: ""
  };
  checkout: AngularFireList<any>;
  userDetail: AngularFireObject<any>;
  bookings: AngularFireObject<any>;
  color: any;
  str: any;
  paymentType: string;
  paymentDetails: any = {
    paymentStatus: true
  };
  stripe_card: any = {};

  public paymentTypes: any = [
    {
      default: true,
      type: "Braintree",
      value: "Braintree",
      logo: "assets/img/braintree_logo.png"
    },
    {
      default: false,
      type: "Stripe",
      value: "Stripe",
      logo: "assets/img/stripe.png"
    },
    { default: false, type: "COD", value: "COD", logo: "" }
  ];

  constructor(
    public af: AngularFireAuth,
    public db: AngularFireDatabase,
    public navCtrl: NavController,
    public navParams: NavParams,
    // public payPal: PayPal,
    public stripe: Stripe,
    private braintree: Braintree,
    private checkoutService: CheckoutService,
    private loadingCtrl: LoadingController,
    public alertCtrl: AlertController
  ) {
    this.order = this.navParams.get("orderDetails");
    this.str = "#";
    var num = Math.floor(Math.random() * 900000) + 100000;
    this.color = this.str.concat(num);
    this.checkout = db.list("/orders");
  }

  ionViewDidLoad() {
    this.paymentType = "Braintree";
    if (this.af.auth.currentUser) {
      this.userId = this.af.auth.currentUser.uid;
      this.userDetail = this.db.object("/users/" + this.userId);
      this.userDetail.valueChanges().subscribe((res: any) => {
        res.mobileNo
          ? (this.userDetails = {
            email: res.email,
            name: res.name,
            mobileNo: res.mobileNo,
            userid: this.userId
          })
          : (this.userDetails = {
            email: res.email,
            name: res.name,
            userid: this.userId
          });
      });
    }
  }

  choosePaymentType(paymentType) {
    this.paymentType = paymentType;
    this.order.paymentType = paymentType;
    this.paymentDetails.paymentType = paymentType;
  }

  // paywithBraintree() {
  //   const paymentOptions: PaymentUIOptions = {
  //     amount: "14.99",
  //     primaryDescription: "brain tree payment"
  //   };

  //   this.braintree
  //     .initialize(braintree_token)
  //     // .then(() => this.braintree.setupApplePay(appleOptions))
  //     .then(() => this.braintree.presentDropInPaymentUI(paymentOptions))
  //     .then((result: any) => {
  //       if (result.userCancelled) {
  //         console.log("User cancelled payment dialog.");
  //       } else {
  //         console.log("User successfully completed payment!");
  //         console.log("Payment Nonce: " + JSON.stringify(result.nonce));
  //         console.log("Payment Result.", JSON.stringify(result));
  //       }
  //     })
  //     .catch((error: string) => console.log("Error- " + JSON.stringify(error)));
  // }

  onCheckOut(form: NgForm) {
    this.order.orderId = Math.floor(Math.random() * 90000) + 10000;
    this.order.userDetails = this.userDetails;
    this.order.userId = this.userId;
    this.order.createdAt = Date.now();
    this.order.status = "pending";
    this.order.paymentStatus = "pending";
    delete this.order.shippingAddress.$key;
    this.order.statusReading = [
      {
        title: "Your order has been accepted.You will get notified the status here.",
        time: Date.now()
      }
    ];
    if (this.paymentType == "Braintree") {
      // const config = {
      //   PayPalEnvironmentProduction: "",
      //   PayPalEnvironmentSandbox: payPalEnvironmentSandbox
      // };
      this.checkout.push(this.order).then(res => {
        const paymentOptions: PaymentUIOptions = {
          amount: this.order.grandTotal,
          primaryDescription: "brain tree payment"
        };
        this.braintree.initialize(braintree_token)
          .then(() => this.braintree.presentDropInPaymentUI(paymentOptions))
          .then((result: any) => {
            if (result.userCancelled) {
              console.log("User cancelled payment dialog.");
            } else {
              this.paymentDetails.transactionId = result.clientMetadataId;
              this.saveLoyaltyData(res.key);
              this.db.object("/orders/" + res.key).update({
                paymentDetails: this.paymentDetails,
                paymentStatus: "success"
              }).then(() => {
                this.navCtrl.setRoot("ThankyouPage");
              });
            }
          }).catch((error: any) => {
            if (error.message) {
              this.showAlert(error.message);
            }
          });
      });
    } else if (this.paymentType == "Stripe") {
      if (this.order.grandTotal >= 50) {
        let loader = this.loadingCtrl.create({
          content: "please wait.."
        });
        loader.present();
        this.checkout.push(this.order).then(order => {
          this.stripe.setPublishableKey(publishableKey);
          let card = {
            number: this.stripe_card.cardNumber,
            expMonth: this.stripe_card.expiryMonth,
            expYear: this.stripe_card.expiryYear,
            cvc: this.stripe_card.cvc
          };
          this.stripe.createCardToken(card).then(token => {
            let stripe_token: any = token;
            // console.log('token', stripe_token);
            if (token) {
              this.checkoutService.chargeStripe(
                stripe_token.id,
                "USD",
                Math.round(this.order.grandTotal),
                stripe_secret_key
              ).then(result => {
                let res: any = result;
                // console.log('charge stripe response--', result);
                this.paymentDetails.transactionId = res.balance_transaction;
                this.stripe_card = {};
                this.saveLoyaltyData(order.key);
                this.db.object("/orders/" + order.key).update({
                  paymentDetails: this.paymentDetails,
                  paymentStatus: "success"
                }).then(() => {
                  loader.dismiss();
                  this.navCtrl.setRoot("ThankyouPage");
                });
              }, error => {
                this.showAlert(error.message);
                // console.log('charge stripe error', error);
                loader.dismiss();
              });
            }
          }).catch(error => {
            loader.dismiss();
            this.showAlert(error);
          });
        }, error => {
          loader.dismiss();
        });
      } else {
        this.showAlert("Amount should be greater than $50 to use stripe payment");
      }
      //order with COD
    } else {
      this.checkout.push(this.order).then(res => {



        // console.log("order placed ! " + JSON.stringify(res));
        this.saveLoyaltyData(res.key);
        this.navCtrl.setRoot("ThankyouPage");
      });
    }
  }

  saveLoyaltyData(orderId) {
    if (this.order.appliedLoyaltyPoints == true) {
      let loayltyObj: any = {
        credit: false,
        points: -Number(this.order.usedLoyaltyPoints),
        orderId: orderId,
        createdAt: Date.now()
      };
      this.db.list("users/" + this.userId + "/loyaltyPoints").push(loayltyObj);
      this.db.list("/orders/" + orderId + "/loyaltyPoints")
        .push(loayltyObj).then(result => {
          // console.log("loyaltyUpdated-" + result);
        });
    } else {
      console.log("loyalaty Not applied!!");
    }
  }

  showAlert(message) {
    let alert = this.alertCtrl.create({
      subTitle: message,
      buttons: ["OK"]
    });
    alert.present();
  }

}
