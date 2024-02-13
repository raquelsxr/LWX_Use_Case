import { LightningElement, api } from 'lwc';

export default class FormLWC extends LightningElement {
    @api columns=[];
    @api rowFields={};
    fieldValues=[];

    connectedCallback(){
        for(const column of this.columns){
            if(column.fieldName !==  'id' && column.type !== 'action'){
                this.fieldValues.push({
                    ...column,
                    value:this.rowFields[column.fieldName]
                })
            }
        }
    }

    // Custom Event
    handleCancel(){
        //console.log("Cancel");

        const event = new CustomEvent("cancel",{
            detail:{
                //message: "Cancel desde el modal"
                flag: false
            }
        });
        this.dispatchEvent(event);
    }
 
   
    handleSave(){
        const dataToSend = this.rowFields;
        const saveEvent= new CustomEvent('save', {
            detail: dataToSend});
        this.dispatchEvent(saveEvent);
    }
 
    handleFieldChange(event){
        const fieldName = event.target.dataset.id;
        const fieldValue = event.target.value;
        const rowFields = {...this.rowFields};
        rowFields[fieldName]= fieldValue;
        this.rowFields = rowFields;
       
    }
}