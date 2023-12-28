const express = require('express');
const router = express.Router();
const UserModel = require('../model/users');

// POST route to save form data
router.post('/save_data', async (req, res) => {
    try {
      const existingUser = await UserModel.findOne({ phone_number: req.body.phone_number });
  
      if (existingUser) {
          const user_gender = await get_gender(req.body.phone_number);
          const matchUsers = await get_matched_couple(user_gender , req.body.start_age , req.body.end_age , req.body.partner_job_field); 
          return res.status(201).json({ status : 'save_fail' , message: 'Phone number already exists' , matchUsers });
      } else {
          // If the phone number doesn't exist, save the new user data
          const formData = new UserModel(req.body);
          const savedData = await formData.save();
    
          const gender_opasit = (req.body.gender === 'Male' )? 'Female' : 'Male';
          const matchUsers = await get_matched_couple(gender_opasit , req.body.start_age , req.body.end_age , req.body.partner_job_field); 
          return res.status(201).json({  status : 'save_success' , message : 'data saved', matchUsers });
      }
    } catch (error) {
      console.error('Error saving data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});
  
async function get_matched_couple(gender, start_age, end_age, job_field) {
    try {
      if(job_field == "any"){
         let query = {
            gender: gender,
            your_age: { $gte: start_age, $lte: end_age }
          };
      
          const matchedCouples = await UserModel.find(query);
          return matchedCouples;

      }else{
        
          let query = {
            gender: gender,
            your_age: { $gte: start_age, $lte: end_age },
            your_job_field: job_field 
          };
      
          const matchedCouples = await UserModel.find(query);
          return matchedCouples;
      }
      
    } catch (error) {
      console.error('Error finding matched couples:', error);
      throw error;
    }
}

async function get_gender(telephone) {
    try {
      const user = await UserModel.findOne({ phone_number: telephone }, 'gender');
  
      if (user) {
        return user.gender === 'Male' ? 'Female' : 'Male';
      } else {
        return null; 
      }
    } catch (error) {
      console.error('Error finding gender:', error);
      throw error;
    }
  }
  
  
// GET route to retrieve all form data
router.get('/all_data', async (req, res) => {
  try {
    const allFormData = await UserModel.find();
    res.status(200).json(allFormData);
  } catch (error) {
    console.error('Error retrieving data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
