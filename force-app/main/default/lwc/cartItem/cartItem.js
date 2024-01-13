import { LightningElement, api, track } from 'lwc';

export default class CartItem extends LightningElement {
    @api item;
    @track quantity

    connectedCallback() {
        this.quantity = this.item.Item_Quantity__c
    }

    handleDelete(){
        const deleteEve = new CustomEvent(
            'delete',
            {
                detail : this.item.Id
            }
        );
        this.dispatchEvent(deleteEve);
    }

    handleChangeQuantity() {
        this.dispatchEvent(new CustomEvent (
            'quantitychange',
            {
                detail : {'id': this.item.Id, 'qty': this.quantity}
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

    get buttonDisabled() {
        return this.quantity === 1
    }
}