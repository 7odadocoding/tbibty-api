const contactService = require('../services/contact.service');
const successResponse = require('../utils/success');

class ContactUsController {
   constructor(contactService) {
      this.service = contactService;
   }

   async sendContactEmail(req, res, next) {
      try {
         const { email, name, message } = req.body;
         const result = await this.service.sendContactEmail(email, name, message);
         const response = successResponse(result, 200);
         res.status(response.status).json(response);
      } catch (error) {
         next(error);
      }
   }
}

module.exports = new ContactUsController(contactService);
