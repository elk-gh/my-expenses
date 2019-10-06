import { LightningElement, track } from "lwc";

import callSheets from "@salesforce/apex/createExpense.callSheets";

export default class CreateExpense extends LightningElement {
  @track cost;
  @track response;
  @track error;

  createExpense() {
    callSheets({ cost: "$cost" })
        .then(result => {
            this.response = JSON.stringify(result);
        })
        .catch(error => {
            this.error = JSON.stringify(error);
        });
}
}
