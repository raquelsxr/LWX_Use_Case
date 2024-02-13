public with sharing class lightningTableController {
    
    @AuraEnabled
    public static List<Contact> getContacts(){
        try{
            List<Contact> lstContacts = [SELECT Id,FirstName, LastName, Email, Phone FROM Contact];
            return lstContacts;

        }
        catch(Exception e){
            System.debug(e.getMessage());
            throw e; 
        }
    }

    @AuraEnabled
    public static Contact deleteContact(String contactId){
        try {
            Contact contact = [SELECT Id FROM Contact WHERE Id =:contactId LIMIT 1];
            delete contact;
            return contact;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());

        }
    }

    @AuraEnabled
    public static Contact createContact(String firstName, String lastName, String email, String phone){
        try {
            Contact newContact = new Contact(
                FirstName = firstName,
                LastName = lastName,
                Email = email,
                Phone = phone

            );
            insert newContact; 
            return newContact;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }


    @AuraEnabled
    public static Contact updateContact(String contactId, String FirstName, String LastName, String Email, String Phone){
        try {
            
            Contact contact = [SELECT Id FROM Contact WHERE Id =:contactId LIMIT 1];
            contact.FirstName = FirstName;
            contact.LastName = LastName;
            contact.Email = Email;
            contact.Phone = Phone;

            update contact;
            return contact;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}