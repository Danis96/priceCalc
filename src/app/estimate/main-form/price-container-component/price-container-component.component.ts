import {Component, OnDestroy } from '@angular/core';
import {EstimateService} from "../../estimate.service";
import {Subscription} from "rxjs";
import {EstimatedTimeAndPrice} from "../../estimatedTimeAndPrice";

@Component({
  selector: 'app-price-container-component',
  templateUrl: './price-container-component.component.html',
  styleUrls: ['./price-container-component.component.css']
})
export class PriceContainerComponentComponent implements OnDestroy {
    /// subscription
    subscription: Subscription;

  estimateText = 'Estimated Time:';
  priceText = 'Estimated Price:';
  days = 0;

   estimatedTP: EstimatedTimeAndPrice = {
     koeficijent:1,
     price: 0,
     time: 0,
   };

  constructor(public estimateService: EstimateService) {
    this.subscription = this.estimateService.getEstimatedTimeAndPrice().subscribe((priceAndTime) => {
      if(this.estimatedTP.koeficijent === 0){
        this.estimatedTP.price = 0;
        this.estimatedTP.time = 0;
      }
      this.estimatedTP.koeficijent = priceAndTime.koeficijent;
       this.estimatedTP.time = Math.floor(this.estimatedTP.koeficijent * priceAndTime.time);
       this.estimatedTP.price =Math.floor(this.estimatedTP.koeficijent * priceAndTime.price);
       this.days = Math.floor(this.estimatedTP.time / 8);
    });
  }

    ngOnDestroy(): void {
      this.subscription.unsubscribe();
    }

}
