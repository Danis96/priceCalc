import {Injectable, OnInit} from '@angular/core';
import {EstimatedTimeAndPrice} from "./estimatedTimeAndPrice";
import {Observable, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({ providedIn: "root" })
export class EstimateService {


    infoFetched;

  estimatedTimeAndPrice: EstimatedTimeAndPrice = {
    price: 0,
    time: 0,
  }

  private subject = new Subject<any>();


  getEstimatedTimeAndPrice(): Observable<any> {
     return  this.subject.asObservable();
  }

    sendEstimatedTimeAndPrice(event, price: number, time: number, radio: boolean, num: number, pageID: number, pages:any, i:number) {
        if(event.target.checked) {
          this.estimatedTimeAndPrice.price += price;
          this.estimatedTimeAndPrice.time += time;
          console.log('Price: ' + this.estimatedTimeAndPrice.price.toString());
          console.log('Time: ' + this.estimatedTimeAndPrice.time.toString());
        }  else {
          this.estimatedTimeAndPrice.price -= price;
          this.estimatedTimeAndPrice.time  -= time;
          console.log('Price: ' + this.estimatedTimeAndPrice.price.toString());
          console.log('Time: ' + this.estimatedTimeAndPrice.time.toString());
        }
        this.subject.next({
          price: this.estimatedTimeAndPrice.price,
          time: this.estimatedTimeAndPrice.time,
        });
      // }


  }
}

