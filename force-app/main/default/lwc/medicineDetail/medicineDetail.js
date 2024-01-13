import { LightningElement, api, wire, track } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import displayMed from '@salesforce/apex/BeerController.displayMed'

export default class MedicineDetail extends LightningElement {
    @api medId
    @track medDataRes
    @track medicine
    @track error
    @track medJSON
    quantity = 1

    handleChangeQuantity() {
        this.dispatchEvent(new CustomEvent (
            'quantitychange',
            {
                detail : this.quantity
            }
        ));
    }

    handleRemove() {
        const prevQuantity = this.quantity
        if(!this.buttonDisabled) {
            this.quantity = this.quantity-1
            if(prevQuantity != this.quantity) {
                console.log('Quantity Changed from ', prevQuantity, ' to ',this.quantity);
                this.handleChangeQuantity()
            }
        }
        else {
            const minusButton = this.template.querySelector('.minusBtn');
            minusButton.classList.add('disabledMouse')
        }
    }

    handleAdd() {
        if (this.buttonDisabled) {
            const minusButton = this.template.querySelector('.minusBtn');
            minusButton.classList.remove('disabledMouse')
        }
        const prevQuantity = this.quantity
        this.quantity = this.quantity+1
        if(prevQuantity != this.quantity) {
            console.log('Quantity Changed from ', prevQuantity, ' to ',this.quantity);
            this.handleChangeQuantity()
        }
    }

    handleAddToCart() {
        const addToCart = new CustomEvent(
            'cart',
            {
                detail : this.medId
            }
        );
        this.dispatchEvent(addToCart);
    }

    connectedCallback() {
        refreshApex(this.medDataRes);
    }

    @wire(displayMed, {medId: '$medId'})
    wiredMed(result) {
        this.medDataRes = result;
        if(result.data) {
            this.medicine = result.data
            this.error = undefined
            this.medJSON = JSON.parse(JSON.stringify(this.medicine))
            console.log(JSON.stringify(this.medicine));
        } else {
            this.medicine = undefined
            this.error = result.error
        }
        //console.log(this.medJSON.Name);
    }

    handleBack() {
        const backClicked = new CustomEvent(
            'backclick',
            {
                detail : true
            }
        );
        console.log('event.detail: ',backClicked.detail);
        this.dispatchEvent(backClicked);
    }

    get buttonDisabled() {
        return this.quantity === 1
    }
}