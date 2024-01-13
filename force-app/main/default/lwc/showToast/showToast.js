import { LightningElement } from 'lwc';
/* step1 */
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ShowToast extends LightningElement {

    hanldeClick(){

        const toast = new ShowToastEvent({
            'title' : 'Sample Toast',
            "message" : 'This is simple message'
            
        });
        this.dispatchEvent(toast);

        const toast1 = new ShowToastEvent({
            'title' : 'Sample Toast',
            "message" : 'This is error message',
            "variant" : "error", 
        });
        this.dispatchEvent(toast1);

        const toast2 = new ShowToastEvent({
            'title' : 'Sample Toast',
            "message" : 'This is success message',
            "variant" : "success", 
        });

        this.dispatchEvent(toast2);

        const toast3 = new ShowToastEvent({
            'title' : 'Sample Toast',
            "message" : 'This is warning message',
            "variant" : "warning", 
        });
        this.dispatchEvent(toast3);

    }

    /*
    Limitations
        Does not works
            1 - If we are using cmp inside VF page
            2 - Inside Lightning Application
    */
}