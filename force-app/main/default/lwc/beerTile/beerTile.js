import { LightningElement, api } from 'lwc';

export default class BeerTile extends LightningElement {
    @api beerRecord;

    handleAddToCart(){
        const addToCart = new CustomEvent(
            'cart',
            {
                detail : this.beerRecord.Id
            }
        );
        this.dispatchEvent(addToCart);
    }

    medicineClickHandler() {
        console.log('medicine-id: ',this.beerRecord.Id);
        const medicineClicked = new CustomEvent(
            'medicineclick',
            {
                detail : this.beerRecord.Id
            }
        );
        console.log('event.detail: ',medicineClicked.detail);
        this.dispatchEvent(medicineClicked);
    }
}