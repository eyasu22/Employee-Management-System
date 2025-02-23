import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditAdmin = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    profile_image: null,
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    // Fetch the admin data to populate the form
    const fetchAdminData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/admin/${id}`);
        setFormData(response.data.Result);
      } catch (err) {
        console.error('Error fetching admin data:', err);
        setError('Error fetching admin data');
      }
    };

    fetchAdminData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profile_image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token'); // Get the token from localStorage

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`, // Include the token in the headers
      },
    };

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      await axios.put(`http://localhost:3000/admin/${id}`, data, config);
      console.log('Update successful:', response.data);
      navigate('/dashboard/view_admin');
    } catch (err) {
      console.error('Update Error:', err.response.data);
      setError(err.response.data.Error || 'Update failed!');
    }
  };

  return (
    <div>
      <h2>Edit Admin</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Address:</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} required />
        </div>
        <div>
          <label>Phone:</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
        </div>
        <div>
          <label>Profile Image:</label>
          <input type="file" name="profile_image" onChange={handleFileChange} />
        </div>
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default EditAdmin;