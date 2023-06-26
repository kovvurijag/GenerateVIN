import React, { useState } from 'react';
import './Search.css'
import './Reset.css'
import logo from './thumbnail_pek_logo_sm.png';

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
    // Perform validation on form fields
    if (!version || !equipmentCode || !yearOfIssue || !placeOfProduction || !serialNumber) {
      alert('Please fill in all fields');
      return;
    }

    // Generate the VIN based on form data
    const vinNumber = generateVIN();

    // Update the generated VIN state
    setGeneratedVIN(vinNumber);

    // Enable the "Add" button
    setIsAddButtonDisabled(false);
  };

  const generateVIN = () => {
    // Pad the version, year of issue, and serial number with leading zeros if necessary
    const paddedVersion = version.toString().padStart(3, '0');
    const paddedYearOfIssue = yearOfIssue.toString().padStart(2, '0');
    const paddedSerialNumber = serialNumber.toString().padStart(6, '0');
  
    // Concatenate the VIN components
    const vinNumber = `VVV${paddedVersion}${paddedYearOfIssue}1${paddedSerialNumber}${placeOfProduction}`;
  
    return vinNumber;
  };
  

  const handleSearch = () => {
    // Perform validation on form fields
    if (!version || !equipmentCode || !yearOfIssue || !placeOfProduction) {
      alert('Please fill in all fields');
      return;
    }

    // Send a POST request to the server (webtest.pekauto.com) to search for the next available serial number
    const payload = {
      version,
      equipmentCode,
      yearOfIssue,
      placeOfProduction
    };

    fetch('http://webtest.pekauto.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(response => response.json())
      .then(data => {
        // Update the available serial number state
        setAvailableSerialNumber(data.serialNumber);

        // Automatically fill the serial number field in the form
        setSerialNumber(data.serialNumber);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const handleAdd = () => {
    // Send a POST request to the server (webtest.pekauto.com) to add the new VIN number
    const payload = {
      vinNumber: generatedVIN
    };

    fetch('http://webtest.pekauto.com/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(response => {
        // Reset the form fields
        setVersion('');
        setEquipmentCode('');
        setYearOfIssue('');
        setPlaceOfProduction('');
        setSerialNumber('');
        setGeneratedVIN('');
        setAvailableSerialNumber('');
        setIsAddButtonDisabled(true);

        alert('VIN number added successfully!');
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <div className='box'>
      <img src={logo} className='logo'/>
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
