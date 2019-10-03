import { LightningElement, track } from "lwc";

import callSheets from "@salesforce/apex/createExpense.callSheets";

export default class CreateExpense extends LightningElement {
  @track cost;
  @track contacts;
  @track error;

  handleLoad() {
    callSheets({ cost: "$cost" })
        .then(result => {
            this.contacts = JSON.stringify(result);
        })
        .catch(error => {
            this.error = JSON.stringify(error);
        });
}
}
