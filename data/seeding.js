const connectDB = require('../configs/db');
const Article = require('../models/Article');
const Clinic = require('../models/Clinic');

const medicalArticles = [
   {
      articleTitle: 'Understanding Orthopedic Conditions',
      abstract: 'A comprehensive guide to common orthopedic conditions and their treatments.',
      main: {
         sections: [
            {
               sectionTitle: 'Introduction',
               content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ...',
            },
            {
               sectionTitle: 'Common Conditions',
               content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ...',
            },
         ],
      },
      author: '6575ed7233852f4490703c73', // Replace with the actual ID of the doctor/clinic
      keywords: ['Orthopedics', 'Bone Health', 'Joint Disorders'],
      publicationDate: new Date(),
      views: 150,
   },
   {
      articleTitle: 'Advancements in Neurology Research',
      abstract: 'Exploring the latest research findings in the field of neurology.',
      main: {
         sections: [
            {
               sectionTitle: 'Neurological Disorders',
               content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ...',
            },
            {
               sectionTitle: 'Research Findings',
               content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ...',
            },
         ],
      },
      author: '6575ed7233852f4490703c76', // Replace with the actual ID of the doctor/clinic
      keywords: ['Neurology', 'Brain Health', 'Neurological Research'],
      publicationDate: new Date(),
      views: 120,
   },
];

async function seed() {
   connectDB();
   // const newArticles = await Article.create(medicalArticles);
   // console.log(newArticles);
   const clinics = await Clinic.find();

   // Iterate through each document and update it
   for (const clinic of clinics) {
      // Add the thumbnail field if it doesn't exist
      if (!clinic.thumbnail) {
         clinic.thumbnail = 'N/A'; // You can set the default value for thumbnail here
      }
      // Save the updated document back to the database
      await clinic.save();
   }
}

seed().then(() => {
   console.log('seeding database done');
});
