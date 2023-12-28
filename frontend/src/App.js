import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

import './App.css';

const UserCard = ({ user }) => {
  return (
    <div className="card" style={{ width: '18rem', marginBottom: '20px' }}>
      <div className="card-body">
        <h5 className="card-title">{user.facebook_name}</h5>
        <hr/>
        <p className="card-text">Age: {user.your_age}</p>
        <p className="card-text">Phone Number: {(user.do_not_show_number == false )?user.phone_number: "Find On Facebook"}</p>
       
      </div>
    </div>
  );
};

const UsersContainer = ({ users }) => {
  return (
    <div className="container" style={{ marginTop: '40px', marginBottom: '40px' }}>
      <h3 className="text-decoration-underline text-uppercase">How are matches for you</h3>
      {users.length === 0 ? (
        <p>No partners available</p>
      ) : (
        <div className="row">
          {users.map((user, index) => (
            <div className="col-md-4" key={index}>
              <UserCard user={user} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

function App() {
  const jobFields = [
    'Select Job Feild',
    'Advertising and Marketing',
    'Aerospace',
    'Agriculture',
    'Computer and Technology',
    'Construction',
    'Education',
    'Energy',
    'Entertainment',
    'Fashion',
    'Finance and Economic',
    'Food and Beverage',
    'Health Care',
    'Hospitality',
    'IT',
    'Manufacturing',
    'Media and News',
    'Mining',
    'Pharmaceutical',
    'Telecommunication',
    'Transportation'
  ];

  const [facebookName, setFacebookName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [yourAge, setYourAge] = useState('');
  const [yourJobField, setYourJobField] = useState('');
  const [partnerJobField, setPartnerJobField] = useState('');
  const [startAge, setStartAge] = useState('');
  const [endAge, setEndAge] = useState('');
  const [doNotShowNumber, setDoNotShowNumber] = useState(false);
  const [allMatchPartners, setAllMatchPartners] = useState([]);

  const handleFacebookNameChange = (e) => {
    setFacebookName(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const handleYourAgeChange = (e) => {
    setYourAge(e.target.value);
  };

  const handleYourJobFieldChange = (e) => {
    setYourJobField(e.target.value);
  };

  const handlePartnerJobFieldChange = (e) => {
    setPartnerJobField(e.target.value);
  };

  const handleStartAgeChange = (e) => {
    setStartAge(e.target.value);
  };

  const handleEndAgeChange = (e) => {
    setEndAge(e.target.value);
  };

  const handleDoNotShowNumber = (e) => {
    setDoNotShowNumber(e.target.checked);
  };

  function match_action(e){
    e.preventDefault();

    const isValidPhoneNumber = phoneNumber && /^\d{10}$/.test(phoneNumber);

    if (!isValidPhoneNumber) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Phone Number',
        text: 'Please enter a valid 10-digit phone number.',
        confirmButtonText: 'OK'
      });
      return; 
    }

    // Check if any of the fields are empty or null
    const allFieldsFilled = (
      facebookName && phoneNumber && gender &&
      yourAge && yourJobField && partnerJobField &&
      startAge && endAge !== ''
    );

    if (!allFieldsFilled) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Information',
        text: 'Please fill in all fields before saving.',
        confirmButtonText: 'OK'
      });
      // Do not save data if any field is empty
      return;
    }

    const formData = {
      'facebook_name': facebookName,
      'phone_number': phoneNumber,
      'gender': gender,
      'your_age': yourAge,
      'your_job_field': yourJobField,
      'partner_job_field': partnerJobField,
      'start_age': startAge,
      'end_age': endAge,
      'do_not_show_number': doNotShowNumber,
    };

    console.log(formData);

    axios.post('http://52.204.230.155:5000/user/save_data', formData)
    .then(response => {
      console.log('Data sent successfully:', response.data);
      setAllMatchPartners(response.data.matchUsers);
      Swal.fire({
        icon: 'success',
        title: (response.data.status == "save_fail")? "Already Registered User" : "Your Registration Was Success.",
        text: response.data.message,
        confirmButtonText: 'OK'
      });
    })
    .catch(error => {
      console.error('Error sending data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Try again.',
        text: 'There is a system error. Try again.',
        confirmButtonText: 'OK'
      });
    });
    
  }


  return (
    <div style={{marginTop:'5%' , marginBottom:'5%'}}>
      <center>
        <h1 style={{textTransform:'uppercase' , textDecoration:'underline'}}>Be Couple</h1>
      </center>
      <div className="container" style={{marginTop:'10px' ,marginBottom:'40px'}}>
        <div className="grid-container">
          <div className="grid-item">
            <h3 className="text-decoration-underline text-uppercase">Your Profile</h3>
            <div className="mb-3">
              <label for="facebook_name" className="form-label">FaceBook Name</label>
              <input type="text" className="form-control" id="facebook_name" placeholder="" value={facebookName}  onChange={handleFacebookNameChange}/>
            </div>
            <div>
              <label for="phone_number" className="form-label">Phone Number (If You Like)</label>
              <input type="tel" className="form-control" id="phone_number" placeholder="" value={phoneNumber}
                onChange={handlePhoneNumberChange}/>
            </div>
            <div className="form-check mb-3">
              <input className="form-check-input" type="checkbox" id="show_number_checkbox" value={doNotShowNumber}
                onChange={handleDoNotShowNumber}/>
              <label className="form-check-label" for="show_number_checkbox">
                Do not show my number to others
              </label>
            </div>
            <div className="mb-3">
              <label for="phone_number" className="form-label">Gender</label>
              <select className="form-control" id="gender" value={gender}
                onChange={handleGenderChange}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">FeMale</option>
              </select>
            </div>
            <div className="mb-3">
              <label for="age" className="form-label">Your Age</label>
              <input type="number" className="form-control" id="age" placeholder="" value={yourAge}
                onChange={handleYourAgeChange}/>
            </div>
            <div className="mb-3">
              <label for="job_feild" className="form-label">Your Job Feild</label>
              <select  className="form-control" id="job_feild" value={yourJobField}
                onChange={handleYourJobFieldChange}>
                {jobFields.map((field, index) => (
                  <option key={index} value={field}>
                    {field}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid-item">
            <h3 className="text-decoration-underline text-uppercase">Partner Profile</h3>
            <div className="mb-3">
              <label for="job_feild" className="form-label">Partner's Job Feild</label>
              <select  className="form-control" value={partnerJobField}
                onChange={handlePartnerJobFieldChange}>
                  <option value="any">Any Feild</option>
                {jobFields.map((field, index) => (
                  <option key={index} value={field}>
                    {field}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label for="age" className="form-label">Start Age</label>
              <input type="number" className="form-control" placeholder="" value={startAge}
                onChange={handleStartAgeChange}/>
            </div>
            <div className="mb-3">
              <label for="age" className="form-label">End Age</label>
              <input type="number" className="form-control" placeholder="" value={endAge}
                onChange={handleEndAgeChange}/>
            </div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: '5%' , display: 'flex', justifyContent: 'center'  }}>
        <button className="btn-match" onClick={match_action}>
          Match Now
        </button>
      </div>
      <UsersContainer users={allMatchPartners} />
    </div>
  );
}

export default App;
