import React, { useState } from 'react';
import './style.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';

const EmployeeLogin = () => {
    const [values, setValues] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const [showTerms, setShowTerms] = useState(false); // State for showing modal
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:3000/employee/employee_login', values)
            .then(result => {
                console.log(result.data);

                if (result.data.loginStatus) {
                    localStorage.setItem("valid", true);
                    navigate('/employee_detail/' + result.data.id);
                } else {
                    setError(result.data.Error);
                }
            })
            .catch(err => console.log("Login Error:", err));
    };

    return (
        <div className='d-flex justify-content-center align-items-center vh-100 loginPage'>
            <div className='p-3 rounded w-25 border loginForm'>
                <div className='text-warning'>{error && error}</div>
                <h2>Login Page</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3 email-input'>
                        <i className="fa fa-envelope"></i>
                        <input
                            type="email"
                            name='email'
                            autoComplete='off'
                            placeholder='Enter Email'
                            onChange={(e) => setValues({ ...values, email: e.target.value })}
                            className='form-control rounded-0'
                            required
                        />
                    </div>
                    <div className='mb-3 password-input'>
                        <i className="fa fa-lock"></i>
                        <input
                            type="password"
                            name='password'
                            placeholder='Enter Password'
                            onChange={(e) => setValues({ ...values, password: e.target.value })}
                            className='form-control rounded-0'
                            required
                        />
                    </div>
                    <button className='btn btn-success w-100 rounded-0 mb-2'>Log in</button>
                    <div className='mb-1'>
                        <input type="checkbox" name="tick" id="tick" className='me-2' />
                        <label htmlFor="tick" style={{ cursor: 'pointer' }} onClick={() => setShowTerms(true)}>
                            You agree with terms & conditions
                        </label>
                    </div>
                </form>
            </div>

            {/* Terms and Conditions Modal */}
            <Modal show={showTerms} onHide={() => setShowTerms(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Terms & Conditions</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>By using this system, you agree to our terms and conditions:</p>
                    <ul>
                        <li>Your account information must be accurate.</li>
                        <li>Do not share your credentials with others.</li>
                        <li>We reserve the right to suspend accounts violating our policies.</li>
                        <li>All actions in this system are monitored for security purposes.</li>
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowTerms(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default EmployeeLogin;
