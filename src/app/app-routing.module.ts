import { NgModule } from "@angular/core";
import {RouterModule, Routes} from '@angular/router';
import { HomeComponent } from "./home/home.component";
import { EstimateComponent } from "./estimate/estimate.component";
import {ConfirmationPageComponent} from "./estimate/confirmation-page/confirmation-page.component";

const routes: Routes = [
    /// home
    { path: '', component: HomeComponent },
    /// estimate
    { path: 'estimate', component: EstimateComponent },
    /// confirmation page
    { path: 'estimate/confirmation', component: ConfirmationPageComponent },
]

@NgModule({
   imports: [
          RouterModule.forRoot(routes)
   ],
   exports: [RouterModule]

})
export class AppRoutingModule {}