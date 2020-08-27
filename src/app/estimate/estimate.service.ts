import {Injectable, OnInit} from '@angular/core';
import {EstimatedTimeAndPrice} from "./estimatedTimeAndPrice";
import {Observable, Subject} from "rxjs";

import {HttpClient} from "@angular/common/http";

@Injectable({ providedIn: "root" })
export class EstimateService {


    infoFetched;
    coefficients = [];
//ovo je najnovija verzija
    

  estimatedTimeAndPrice: EstimatedTimeAndPrice = {
    koeficijent: 0,
    price: 0,
    time: 0,
  }

  private subject = new Subject<any>();


  getEstimatedTimeAndPrice(): Observable<any> {
     return  this.subject.asObservable();
  }

    sendEstimatedTimeAndPrice(event, price: number, time: number, radio: boolean, num: number, pageID: number, pages:any, i:number, coefficient: number) {
        if(event.target.checked) { 
          if(coefficient) {
            let primljeniKoeficijent = coefficient;
            this.estimatedTimeAndPrice.koeficijent += primljeniKoeficijent;
          }
            if(!coefficient) {
                let primljenaCijena = price;
                let primljenoVrijeme = time;
                this.estimatedTimeAndPrice.price += primljenaCijena;
                this.estimatedTimeAndPrice.time += primljenoVrijeme;
                console.log('Price: ' + this.estimatedTimeAndPrice.price.toString());
                console.log('Time: ' + this.estimatedTimeAndPrice.time.toString());
            }
        }  else {
          console.log("unchecked");
            if(coefficient) {
              let primljeniKoeficijent = coefficient;
              this.estimatedTimeAndPrice.koeficijent -= primljeniKoeficijent;
            }
            if(!coefficient) {
                let priceCoefficient = price;
                let timeCoefficient = time;
                this.estimatedTimeAndPrice.price -= priceCoefficient;
                this.estimatedTimeAndPrice.time  -= timeCoefficient;
                console.log('Price: ' + this.estimatedTimeAndPrice.price.toString());
                console.log('Time: ' + this.estimatedTimeAndPrice.time.toString());
            }
        }
        this.subject.next({
          // koeficijent: this.estimatedTImeAndPrice.koeficijent,
          price: this.estimatedTimeAndPrice.price,
          time: this.estimatedTimeAndPrice.time,
          koeficijent : this.estimatedTimeAndPrice.koeficijent
        });
  }
}



