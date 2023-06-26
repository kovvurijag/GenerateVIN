import React, { useState } from 'react';
import './Search.css';
import './Reset.css';
import logo from './thumbnail_pek_logo_sm.png';
import axios from 'axios';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYlgpHYRK4v2tSI-zns1nQqe-OlbYTKdA",
  authDomain: "jagadesh-df81f.firebaseapp.com",
  databaseURL: "https://jagadesh-df81f.firebaseio.com",
  projectId: "jagadesh-df81f",
  storageBucket: "jagadesh-df81f.appspot.com",
  messagingSenderId: "139022798122",
  appId: "1:139022798122:web:5a0a4c974c6b813abda253"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const Search = () => {
  const [version, setVersion] = useState('');
  const [equipmentCode, setEquipmentCode] = useState('');
  const [yearOfIssue, setYearOfIssue] = useState('');
  const [placeOfProduction, setPlaceOfProduction] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [generatedVIN, setGeneratedVIN] = useState('');
  const [availableSerialNumber, setAvailableSerialNumber] = useState('');
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(true);

  const handleGenerateVIN = () => {
    if (!version || !equipmentCode || !yearOfIssue || !placeOfProduction || !serialNumber) {
      alert('Please fill in all fields');
      return;
    }

    const vinNumber = generateVIN();

    setGeneratedVIN(vinNumber);

    setIsAddButtonDisabled(false);
  };

  const generateVIN = () => {
    const paddedVersion = version.toString().padStart(3, '0');
    const paddedYearOfIssue = yearOfIssue.toString().padStart(2, '0');
    const paddedSerialNumber = serialNumber.toString().padStart(6, '0');
    const vinNumber = `VVV${paddedVersion}${paddedYearOfIssue}1${paddedSerialNumber}${placeOfProduction}`;
    return vinNumber;
  };

  const handleSearch = () => {
    if (!version || !equipmentCode || !yearOfIssue || !placeOfProduction) {
      alert('Please fill in all fields');
      return;
    }

    const payload = {
      version,
      equipmentCode,
      yearOfIssue,
      placeOfProduction
    };

    axios.post('https://jagadesh-df81f.firebaseio.com/search.json',payload)

      .then(response => {
        console.log(response.data);
        setAvailableSerialNumber(response.data.serialNumber);
        setSerialNumber(response.data.serialNumber);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const handleAdd = () => {
    if (!generatedVIN) {
      alert('Please generate a VIN number');
      return;
    }

    const payload = {
      vinNumber: generatedVIN
    };

    axios.post('https://jagadesh-df81f.firebaseio.com/add.json',payload)
      .then(response => {
        console.log(response.data);
        if (response.data.success) {
          setVersion('');
          setEquipmentCode('');
          setYearOfIssue('');
          setPlaceOfProduction('');
          setSerialNumber('');
          setGeneratedVIN('');
          setAvailableSerialNumber('');
          setIsAddButtonDisabled(true);

          alert('Failed to add VIN number!');
        } else {
          alert('VIN number added successfully.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const saveSearchDataToFirebase = () => {
    if (!version || !equipmentCode || !yearOfIssue || !placeOfProduction) {
      alert('Please fill in all fields');
      return;
    }

    const payload = {
      version,
      equipmentCode,
      yearOfIssue,
      placeOfProduction
    };

    // Save search data to Firebase Realtime Database
    database.ref('searches').push(payload)
      .then(() => {
        console.log('Search data saved to Firebase');
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <div className='box'>
      <img src={logo} className='logo' alt='PEK Logo' />
      <h2>Generate VIN</h2>
      <label>Version:</label>
      <input type="number" value={version} onChange={(e) => setVersion(e.target.value)} />
      <br />
      <label>Equipment Code:</label>
      <select className='dropdown-ec' value={equipmentCode} onChange={(e) => setEquipmentCode(e.target.value)}>
        <option value="">Select Equipment Code</option>
        <option value="000">Base platform</option>
        <option value="014">Bumper</option>
        <option value="037">Drum Mulcher</option>
        <option value="036">Side Trimmer</option>
        <option value="038">Sprayer</option>
        <option value="027">Lawn Mower</option>
      </select>
      <br />
      <label>Year of Issue:</label>
      <input type="number" value={yearOfIssue} onChange={(e) => setYearOfIssue(e.target.value)} />
      <br />
      <label>Place of Production:</label>
      <select className='dropdown-ec' value={placeOfProduction} onChange={(e) => setPlaceOfProduction(e.target.value)}>
        <option value="">Select Place of Production</option>
        <option value="00">Slovenia</option>
        <option value="01">Turkey</option>
      </select>
      <br />
      <label>Serial Number:</label>
      <input type="number" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} />
      <br />
      <button className='generatebutton' onClick={handleGenerateVIN}>Generate</button>
      <br />
      {generatedVIN && <div className='genrate-vin'>Generated VIN: {generatedVIN}</div>}
      <br />
      <button className='search' onClick={handleSearch}>Search</button>
      {availableSerialNumber && <div>Available Serial Number: {availableSerialNumber}</div>}

      <button className='add' onClick={handleAdd} disabled={isAddButtonDisabled}>Add</button>
     
    </div>
  );
};

export default Search;
