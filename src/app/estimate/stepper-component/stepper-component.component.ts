import {Component, ElementRef, OnDestroy, OnInit} from "@angular/core";
import { ViewChild } from "@angular/core";
import { EstimateService } from "../estimate.service";
import { MatStepper } from "@angular/material/stepper";
import { NgForm } from "@angular/forms";
import {QuestionService} from "../../home/question.service";
import {Subscription} from "rxjs";
import {UsersService} from "../../services/user.service";
import * as $ from 'jquery';

@Component({
  selector: "app-stepper-component",
  templateUrl: './stepper-component.component.html',
  styleUrls: ["./stepper-component.component.css"],
})
export class StepperComponentComponent implements  OnInit, OnDestroy {
  constructor(public estimateService: EstimateService, public questionService: QuestionService, public usersService: UsersService) {}

  fetchedJson;
  num = 0;
  checked = false;

  userAnswer = [];
  isLoading =  false;

  hideSpinner(){
    this.isLoading = false;
  }

  private questionSubscription: Subscription;

  ngOnInit(): void {
   this.questionService.getQuestions();
    // this.isLoading = true;
    this.questionSubscription = this.questionService.getQuestionsUpdated()
        .subscribe((questions) => {
          setTimeout(this.hideSpinner.bind(this),800)
          this.fetchedJson = questions.questions[0];
            console.log(this.fetchedJson)
        })
  }

  ngOnDestroy(): void {
     this.questionSubscription.unsubscribe();
  }

  getTimeAndPrice(event, price: number, time: number, radio: boolean, num: number, pages:any, answer: any, chosen: boolean, pageID: number, i: number, page: any) {
       /// function for disabling other choices if one is checked
      /// in radio === true objects
       if(radio) {
         pages.forEach(x => {
           if (x.id !== page.id) {
             x.disabled = !x.disabled
           }
         })
       }
      this.addAnswersIfTheyAreChosen(chosen, answer, pageID);
      this.estimateService.sendEstimatedTimeAndPrice(event, price, time, radio, num, pageID, pages, i);
  }

  addAnswersIfTheyAreChosen(chosen: boolean, answer: any, pageID: number) {
    /// collect selected answers
    /// if answer is chosen then add it to [this,userAnswer]
    /// else
    /// if you unchecked the answer we will set chosen to false and remove
    /// the last added item in array
      if(!chosen) {
        const answers = {
          answer: answer,
          choiceID: pageID,
        }
        console.log(answers);
        this.userAnswer.push(answers);
        console.log(this.userAnswer);
      } else {
        this.userAnswer = this.userAnswer.filter(({choiceID}) => choiceID !== pageID);
        console.log(this.userAnswer);
      }

  }


  @ViewChild('name') name: ElementRef;
  @ViewChild('email') email: ElementRef;
  getUsersAnswers() {
     /// getting final versions of time and price through estimateService
     const time = this.estimateService.estimatedTimeAndPrice.time;
     const price = this.estimateService.estimatedTimeAndPrice.price;
     /// getting name and email
     const name = this.name.nativeElement.value;
     const email = this.email.nativeElement.value;
     /// call function from usersService to send data to the backend and db
    console.log('Time ' + time.toString());
    console.log('price ' + price.toString());
    console.log('name ' + name.toString());
    console.log('email ' + email.toString());
    console.log(this.userAnswer);
    this.usersService.getUsersAnswers(this.userAnswer, time, price, name, email);


    /// reset after submitting
    this.estimateService.estimatedTimeAndPrice.price = 0;
    this.estimateService.estimatedTimeAndPrice.time = 0;
    this.userAnswer = [];
  }

  buttonState() {
    if (this.num == this.fetchedJson['pages'].length - 1) {
      return true;
    } else {
      return !this.fetchedJson.pages[this.num].some((page) => page.chosen);
    }
  }

  changeWidth() {
    if (this.num === this.fetchedJson['pages'].length - 1) {
      return "200px";
    } else {
      return null;
    }
  }

  @ViewChild("stepper") private myStepper: MatStepper;
  goBack(stepper: MatStepper) {
    this.myStepper.previous();
    this.num -= 1;
  }
  goForward(stepper: MatStepper, answer: any) {
    this.myStepper.next();
    this.num += 1;
  }
  onSendEmail(form: NgForm) {
    console.log("users name is ", form.value.name);
    console.log("users email is ", form.value.email);
  }
}
