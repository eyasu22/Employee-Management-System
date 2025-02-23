import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Components/Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './Components/Dashboard';
import Home from './Components/Home';
import Employee from './Components/Employee';
import Category from './Components/Category';
import Profile from './Components/Profile';
import AddCategory from './Components/AddCategory';
import AddEmployee from './Components/AddEmployee';
import EditEmployee from './Components/EditEmployee';
import EmployeeLogin from './Components/EmployeeLogin';
import EmployeeDetail from './Components/EmployeeDetail';
import PrivateRoute from './Components/PrivateRoute';
import EditAdmin from './Components/EditAdmin';
import ViewAdmin from './Components/ViewAdmin';
import ViewAdminProfile from './Components/ViewAdminProfile';
import Start from './Components/Start';
import EditEmployeeDetails from './Components/EditEmployeeDetails';
import LeaveManagement from "./Components/LeaveManagement";
import EmployeeLeaveRequest from './Components/EmployeeLeaveRequest';
import EmployeeLeaveRequestsList from './Components/EmployeeLeaveRequestsList';
import EmployeeCalendar from "./Components/EmployeeCalendar";
import AdminCalendar from "./Components/AdminCalendar";
import WorkCalendar from "./Components/WorkCalendar";
import AddAdmin from './Components/AddAdmin';
import PrivacyPolicy from "./Components/PrivacyPolicy";
import TermsOfService from "./Components/TermsOfService";

// Ensure correct import

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Start />} />
        <Route path='/adminlogin' element={<Login />} />
        <Route path='/employee_login' element={<EmployeeLogin />} />
        <Route path='/employee_detail/:id' element={<EmployeeDetail />} />
        <Route path='/edit_employee_details/:id' element={<EditEmployeeDetails />} /> 
        <Route path="/employee/leave-request/:id" element={<EmployeeLeaveRequest />} />
        <Route path="/employee/leave-requests" element={<EmployeeLeaveRequestsList />} />
        
        {/* Calendar Route for Employees to view their work calendar */}
        <Route path="/employee/calendar/:id" element={<EmployeeCalendar />} />
        {/*
          If you want to protect this route with authentication, you could wrap it in PrivateRoute, e.g.:
          <Route path="/employee/calendar/:id" element={
            <PrivateRoute>
              <EmployeeCalendar />
            </PrivateRoute>
          } />
        */}

        <Route path='/dashboard' element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }>
          <Route index element={<Home />} />
          <Route path='employee' element={<Employee />} />
          <Route path='category' element={<Category />} />
          <Route path='profile' element={<Profile />} />
          <Route path='add_category' element={<AddCategory />} />
          <Route path='add_employee' element={<AddEmployee />} />
          <Route path='edit_employee/:id' element={<EditEmployee />} />
          <Route path='edit_admin/:id' element={<EditAdmin />} />
          <Route path='view_admin' element={<ViewAdmin />} />
          <Route path='view_admin/:id' element={<ViewAdminProfile />} />
          <Route path="leave" element={<LeaveManagement />} />
          <Route path="calendar" element={<WorkCalendar />} />
          <Route path="add-admin" element={<AddAdmin />} />{/* Add route for AddAdmin */}
          
        </Route>
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
