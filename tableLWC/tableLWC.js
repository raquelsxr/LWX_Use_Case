import { LightningElement, api } from 'lwc';
import getContacts from '@salesforce/apex/lightningTableController.getContacts';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import deleteContacts from '@salesforce/apex/lightningTableController.deleteContact';
import createContacts from '@salesforce/apex/lightningTableController.createContact';
import updateContacts from  '@salesforce/apex/lightningTableController.updateContact';

export default class TableLWC extends LightningElement {
    lstContacts;
    displayModal = false;
    deleteContact = false; 
    createContactFlag = false;
    data = [];
    title;
    rowFields= {};
    @api record;

    async connectedCallback(){
        try{
            await this.obtainContacts();
        }
        catch(error){
            console.error(error);
        }
    }

    actions =[
        {
            label: 'Edit',
            name: 'edit'
        },
        {
            label: 'Delete',
            name: 'delete'
        }
    ];
    columns=[
        {
            label : 'First Name', fieldName:'FirstName'
        },
        {
            label : 'Last Name', fieldName:'LastName'
        },
        {
            label : 'Email', fieldName:'Email'
        },
        {
            label : 'Phone', fieldName:'Phone'
        },
        {
            type: "action",
            typeAttributes:{rowActions: this.actions}
        }
    ];

    data = [
        {
            name: 'John',
            lastName: 'Smith'
        }
    ];

    handleRowAction(event){
        const actionName = event.detail.action.name;
        const rowId= event.detail.row.Id;
        const name = event.detail.row.FirstName;
        console.log(actionName);
        switch(actionName){
            case 'edit':
                console.log('Modal abierto desde edit' + rowId);
                this.title = 'Edit Contact';
                this.rowFields = event.detail.row;
                this.record = rowId;

                this.handleOpenModal();
                this.createContactFlag = false;
                break;
            case 'delete':
                this.deleteContacts(rowId);
                break;
        }
    }

    handleOpenModal(){
        this.displayModal = true;
    }
    handleCloseModal(event){
       
        this.displayModal = false;
    }
    handleNewButton(){
        
        this.createContactFlag = true;
       this.displayModal = true;

       console.log('Display Modal', this.displayModal);
       this.title = 'New Contact';
    }


    async obtainContacts(){
        try{
            const contacts = await getContacts();
            this.lstContacts = contacts;
        } 
        catch(error){
            console.error(error);
        }
    }
    async createContact(newContact){
        try{
            const contactN = await createContacts({
                firstName: newContact.FirstName,
                lastName: newContact.LastName,
                email: newContact.Email,
                phone: newContact.Phone
            });
            this.lstContacts.push(contactN);
            this.lstContacts = [...this.lstContacts];
           
        } 
        catch(error){
            console.error(error);
        }
    }

    async updateConctact(contact){
        try{
            const updatedContact = await updateContacts({
                contactId: contact.Id,
                FirstName: contact.FirstName,
                LastName: contact.LastName,
                Email: contact.Email,
                Phone: contact.Phone
            });
            
            const updatedData = updatedContact
            const updatedIndex= this.lstContacts.findIndex(
                (item)=>item.Id === updatedData.Id
            );
            if(updatedIndex !== -1){
                this.lstContacts[updatedIndex] = {...updatedData};
    
            }
            this.lstContacts = [...this.lstContacts];
        }
        catch{

        }
    }


    async deleteContacts(IdToDelete){
        try{
            const result = await deleteContacts({contactId: IdToDelete});
            this.removeIdFromTable(result.Id);
            this.showToastDelete();

        } 
        catch(error){
            console.error(error);
        }
    }


    handleSuccess(modalEvent){
        try{
            const record = modalEvent.detail.record;
        this.displayModal = false;
        const mappedRecord = {
            FirstName : record.FirstName.value,
            LastName: record.LastName.value,
            Email: record.Email.value,
            Phone: record.Phone.value,
            Id: record.Id.value
        };
        this.lstContacts = this.lstContacts.map(contact => (contact.Id == mappedRecord.Id) ? mappedRecord : contact);
        }
        catch(e){

        }
    }
    handleSave(event){
        const updatedData = event.detail;
        const updatedIndex= this.data.findIndex(
            (item)=>item.id === updatedData.id
        );
        if(updatedIndex !== -1){
            this.data[updatedIndex] = {...updatedData};

        }
        if(this.createContactFlag == true){
            this.createContact(updatedData);
        }
        else{
            this.updateConctact(updatedData);
        }
        this.data = [...this.data];
        this.handleCloseModal();
        this.showToast();

    }

    showToast(){
        const event = new ShowToastEvent({
            title: 'Success',
            message: 'Record updated',
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(event);
    }
    showToastDelete(){
        const eventDelete = new ShowToastEvent({
            title: 'Success',
            message: 'Contact Deleted',
            variant: 'warning',
            mode: 'dismissable'
        });
        this.dispatchEvent(eventDelete);
    }

    removeIdFromTable(Id){
        const dataCopy = this.lstContacts.filter(record => record.Id !=Id);
        this.lstContacts = dataCopy;
    }
}