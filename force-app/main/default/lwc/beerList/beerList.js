import { LightningElement, track, wire } from 'lwc';
import searchBeer from '@salesforce/apex/BeerController.searchBeer';
//import cartIco from '@salesforce/resourceUrl/cart';
import getCartId from '@salesforce/apex/BeerController.getCartId';
import createCartItems from '@salesforce/apex/BeerController.createCartItems';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
export default class BeerList extends NavigationMixin(LightningElement) {

    @track beerRecords;
    @track selectedMedId
    @track errros;
    //@track cart = cartIco;
    @track cartId;
    @track itemsinCart = 0;
    quantity = 1
    medicineClicked = false;

    connectedCallback(){
        this.defaultCartId();
    } 


    handleChangedQuantity(event) {
        this.quantity = event.detail
    }


    defaultCartId(){
        getCartId()
        .then(data => {
            const wrapper = JSON.parse(data);
            if ( wrapper ){
                this.itemsinCart = wrapper.Count;
                this.cartId = wrapper.CartId;
            }
            console.log(JSON.stringify(wrapper));
        })
        .catch(error => {
            this.cartId = undefined;
            console.log(error);
        });
    }

    navigateToCartDetail(){
        this[NavigationMixin.Navigate]({
            type:'comm__namedPage',
            attributes: {
                name: 'Cart_Detail__c' // Cart Detail
            },
            state : {
                c__cartId : this.cartId
            }
        });
    }

    

    addToCart(event){
        const selectBeerId = event.detail;
        console.log(JSON.stringify(event));
        const selectBeerRecord = this.beerRecords.find(
            record => record.Id === selectBeerId
        );
        console.log(JSON.stringify(selectBeerRecord));
        /*
            for(Beer__c beer : beerRecords ){
                if(beer.Id == selectBeerId ){
                    return beer;
                }
            }
        */
        createCartItems({
            CartId : this.cartId,
            BeerId : selectBeerId,
            Amount : selectBeerRecord.Price__c,
            Quantity : this.quantity
        })
        .then(data => {
            console.log(' Cart Item Id ', data);
            this.itemsinCart = this.itemsinCart + this.quantity;
            const toast = new ShowToastEvent({
                'title' : 'Success!!',
                "message" : selectBeerRecord.Name +' Added into Cart!',
                "variant" : "success", 
            });
            this.dispatchEvent(toast);
        })
        .catch(error => {
            console.log(JSON.stringify(error));
            const toast = new ShowToastEvent({
                'title' : 'Error!!',
                "message" : JSON.stringify(error),
                "variant" : "error", 
            });
            this.dispatchEvent(toast);
        });

    }
    

    @wire(searchBeer)
        wiredRecords({error, data}){
            
            if ( data ) {
                this.beerRecords = data;
                this.errors = undefined;
            }
            if( error ) {
                this.beerRecords = undefined;
                this.errors = error;
            }
        }

    handleEvent(event){
        const eventVal = event.detail;
        
        searchBeer({
            searchParam : eventVal
        })
        .then(result => {
            
            this.beerRecords = result;
            this.errros = undefined;
        })
        .catch(error => {
            
            this.errors = error;
            this.beerRecords = undefined;
        })
    }

    handleMedicineClick(event) {
        console.log(JSON.stringify(event));
        this.selectedMedId = event.detail
        console.log('medicine Id: ',this.selectedMedId);
        if(this.selectedMedId)
            this.medicineClicked = true;
        else
            this.medicineClicked = false;
        console.log('medicine clicked: '+this.medicineClicked);
    }

    handleBackClick(event) {
        const backClicked = event.detail
        if(backClicked) {
            this.medicineClicked = false
            this.selectedMedId = undefined
            this.quantity = 1
        }
    }

    get showSearchedMedicines() {
        console.log('Show All Meds: ',this.medicineClicked ? false : (this.beerRecords ? true : false));
        return this.medicineClicked ? false : (this.beerRecords ? true : false)
    }
}