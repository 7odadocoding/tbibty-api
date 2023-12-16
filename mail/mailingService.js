const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const { gmailUser, gmailPass } = require('../configs/env');

class Email {
   constructor(templatePath, data) {
      this.templatePath = templatePath;
      this.data = data;
   }

   async generateHtml() {
      try {
         const template = path.resolve(__dirname, this.templatePath);
         return await ejs.renderFile(template, this.data);
      } catch (error) {
         throw new Error(`Error generating HTML from template: ${error.message}`);
      }
   }
}

class MailingService {
   constructor() {
      this.transporter = nodemailer.createTransport({
         service: 'gmail',
         auth: {
            user: gmailUser,
            pass: gmailPass,
         },
      });
      this.forgetPasswordTemplate = './templates/forgetPassword.ejs';
      this.verifyEmailTemplate = './templates/verifyEmail.ejs';
   }

   async serviceRunning() {
      try {
         const info = await this.transporter.sendMail({
            from: gmailUser,
            to: gmailUser,
            subject: 'SERVICE RUNNING',
            text: 'MAILING SERVICE IS RUNNING',
         });

         console.log(`Email sent: ${info.messageId}`);
      } catch (error) {
         throw new Error(`Error sending email: ${error.message}`);
      }
   }

   async sendEmail(to, subject, html) {
      try {
         const info = await this.transporter.sendMail({
            from: gmailUser,
            to,
            subject,
            html,
         });

         console.log(`Email sent: ${info.messageId}`);
      } catch (error) {
         throw new Error(`Error sending email: ${error.message}`);
      }
   }

   async sendVerificationEmail(to, otp) {
      try {
         console.log('SENT TO:', to);
         const emailTemplate = new Email(this.verifyEmailTemplate, { otp });
         const html = await emailTemplate.generateHtml();
         await this.sendEmail(to, 'Email Verification', html);
      } catch (error) {
         throw new Error(`Error sending verification email: ${error.message}`);
      }
   }

   async sendForgotPasswordEmail(to, otp) {
      try {
         const emailTemplate = new Email(this.forgetPasswordTemplate, {
            otp,
         });
         const html = await emailTemplate.generateHtml();
         await this.sendEmail(to, 'Reset Your Password', html);
      } catch (error) {
         throw new Error(`Error sending forgot password email: ${error.message}`);
      }
   }
}

module.exports = MailingService;
