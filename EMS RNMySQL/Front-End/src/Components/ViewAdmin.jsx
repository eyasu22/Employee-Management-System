import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ViewAdmin = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token'); // Get token from storage

  useEffect(() => {
    axios.get('http://localhost:3000/auth/admin_records', {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(result => {
        console.log("Admin Data:", result.data);
        if (result.data.Status) {
          setAdmins(result.data.Result);
        } else {
          console.error("Error:", result.data.Error);
          alert(result.data.Error);
        }
      })
      .catch(err => {
        console.error("Error fetching admins:", err.response ? err.response.data : err.message);
        alert("Failed to fetch admin details. Check if you are authorized.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  return (
    <div className="container mt-5">
      <h3>Admin Records</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="row">
          {admins.map(admin => (
            <div className="col-md-4" key={admin.id}>
              <div className="card mb-4">
                <img
                  src={`http://localhost:3000/Images/${admin.profile_image}`}
                  className="card-img-top"
                  alt="Profile"
                />
                <div className="card-body">
                  <h5 className="card-title">{admin.name}</h5>
                  <p className="card-text"><strong>Email:</strong> {admin.email}</p>
                  <p className="card-text"><strong>Address:</strong> {admin.address}</p>
                  <p className="card-text"><strong>Phone:</strong> {admin.phone}</p>
                  <Link to={`/dashboard/view_admin/${admin.id}`} className="btn btn-primary">View Profile</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewAdmin;
