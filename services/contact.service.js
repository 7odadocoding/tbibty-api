const mailingService = require('../mail/mailingService');

class ContactUsService {
   constructor(mailingService) {
      this.mailingService = mailingService;
   }
   async sendContactEmail(email, name, message) {
      try {
         await this.mailingService.contact(email, name, message);
         return 'message sent successfully';
      } catch (error) {
         throw error;
      }
   }
}

module.exports = new ContactUsService(mailingService);
