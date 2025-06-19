import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from './utils/firebase.js'

import { addFCMToken } from './utils/ApiFunctions.jsx';
// import { BrowserRouter as  Routes, Route, useLocation, BrowserRouter } from 'react-router-dom';

import Home from "./pages/Home/Home.jsx";
import RegistrationForm from "./pages/Registration/RegistrationForm.jsx";
import LoginForm from './pages/Login/Login.jsx';
import JobApplied from './pages/JobApplied/JobApplied.jsx';
import JobsFit from './pages/JobsFit/JobsFit.jsx';
import Company from './pages/Company/Company.jsx';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword.jsx';
import Header from './layout/header/Header.jsx';
import JobSaved from './pages/JobSaved/JobSaved.jsx';
import JobDetail from './components/JobDetail/JobDetail.jsx';
import CompanyDetails from './components/OutstandingCompanies/CompanyDetails.jsx';
import JobsSearch from './pages/JobsSearch/JobsSearch.jsx';
import CVBuilder from './components/CreateCV/CVBuilder.jsx';
import Education from './components/CreateCV/Education.jsx';
import EducationList from './components/CreateCV/EducationList.jsx';
import WorkHistory from './components/CreateCV/WorkHistory.jsx';
import WorkHistoryList from './components/CreateCV/WorkHistoryList.jsx';
import Skill from './components/CreateCV/Skill.jsx';
import Summary from './components/CreateCV/Summary.jsx';
import Extra from './components/CreateCV/Extra.jsx';
import Preview from './components/CreateCV/Preview.jsx';
import EmployerRegistrationForm from './pages/Registration/EmployerRegistrationForm.jsx';
import Dashboard from './pages/Employer/Dashboard.jsx';
import CreateJob from './pages/Employer/CreateJob.jsx';
import ManageJobs from './pages/Employer/ManageJobs.jsx';
import ManageCV from './pages/Employer/ManageCV.jsx';
import Message from './pages/Message/Message.jsx';
// import Chat from './pages/Message/Chat.jsx';
import Admin from './pages/Admin/AdminPage.jsx';
import { useEffect, useState } from 'react';
import CvList from './pages/JobSeeker/CvList.jsx';
import { matchPath } from 'react-router-dom';
import PersonalInformation from './pages/PersonalInformation/PersonalInformation.jsx';
import ChangePassword from './pages/ChangePassword/ChangePassword.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from "jwt-decode";
import PrivateRoute from './service/PrivateRoute/PrivateRoute.jsx';
import Forbidden from './service/PrivateRoute/Forbidden.jsx';
import PrivateRouteForJobSeeker from './service/PrivateRoute/PrivateRouteForJobSeeker.jsx';
import LoginGoogleCallback from './pages/Login/LoginGoogleCallback.jsx';
import { AuthProvider, useAuth } from './service/AuthProvider.jsx';
import MomoCallback from './pages/Employer/MomoCallback.jsx';
import MyCompany from './pages/Employer/MyCompany.jsx';
import IQQuiz from './pages/IQQuiz/IQQuiz.jsx';
import IQHome from './pages/IQQuiz/IQHome.jsx';
import VerifyMailSuccess from './pages/VerifyMail/VerifyMailSuccess.jsx'
import PasswordResetForm from './pages/ForgotPassword/ResetPasswordForm.jsx';
import DashboardContent from './pages/Employer/DashBoardContent.jsx';



const App = () => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUserRole, updateRole } = useAuth();

  // Load the role from localStorage once at the start
  useEffect(() => {
    const cachedRole = localStorage.getItem("currentUserRole");
    if (cachedRole) {
      updateRole(cachedRole);
    }
    setIsLoading(false);
  }, [updateRole]);

  // Fetch user role from token if available
  useEffect(() => {
    const fetchUserRole = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const role = await getRoleFromToken(); // Fetch role from token
        updateRole(role);
      } else {
        updateRole(null);
      }
      setIsAuthenticated(!!token);
    };

    fetchUserRole();
  }, [isAuthenticated, updateRole]);

  useEffect(() => {
    requestNotificationPermission();
  }, [])

  const noHeaderRoutes = ['/dang-ki', '/dang-nhap', '/quen-mat-khau', '/dang-ki-danh-cho-nha-tuyen-dung', '/dashboard', '/admin'];

  const shouldHideHeader = noHeaderRoutes.some(route => location.pathname.startsWith(route));

  // Wait until loading is false to render the app
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen w-full">
      {/* min-h-screen */}
      {!shouldHideHeader && <Header />}
      <ToastContainer />
      <div className="w-full mx-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dang-ki" element={<RegistrationForm />} />
          <Route path="/dang-ki-danh-cho-nha-tuyen-dung" element={<EmployerRegistrationForm />} />
          <Route path="/dang-nhap" element={<LoginForm />} />
          <Route path="/loginGoogle" element={<LoginGoogleCallback />} />
          <Route path="/quen-mat-khau" element={<ForgotPassword />} />
          <Route path="/cong-ti" element={<Company />} />
          <Route path="/cong-ti/:id" element={<CompanyDetails />} />
          <Route path="/viec-lam/:id" element={<JobDetail />} />
          <Route path="/tim-viec-lam" element={<JobsSearch />} />
          <Route path="/auth/verify-email" element={<VerifyMailSuccess />} />
          <Route path="/auth/password-reset" element={<PasswordResetForm />} />
          {/* <Route path="/tin-nhan" element={<Message/>} />
          <Route path="/iq-test" element={<IQQuiz/>} />
          <Route path="/iq-home" element={<IQHome/>} /> */}
          <Route path="/403" element={<Forbidden />} />
          <Route
            path="/admin/*"
            element={
              <PrivateRoute roles={["ROLE_ADMIN"]} userRole={currentUserRole}>
                <Admin />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/*"
            element={
              <PrivateRoute roles={["ROLE_RECRUITER", "ROLE_ADMIN"]} userRole={currentUserRole}>
                <Dashboard />
              </PrivateRoute>
            }
          >
            <Route index element={<DashboardContent />} />
            <Route path="quan-li-cong-viec" element={<ManageJobs />} />
            <Route path="tao-cong-viec" element={<CreateJob />} />
            <Route path="quan-li-cv" element={<ManageCV />} />
            <Route path="cong-ti-cua-toi" element={<MyCompany />} />
          </Route>
          {/* User routes */}
          <Route path='/viec-lam-da-ung-tuyen' element={<PrivateRouteForJobSeeker element={<JobApplied />} />} />
          <Route path='/viec-lam-da-luu' element={<PrivateRouteForJobSeeker element={<JobSaved />} />} />
          <Route path='/cai-dat-thong-tin-ca-nhan' element={<PrivateRouteForJobSeeker element={<PersonalInformation />} />} />
          <Route path='/doi-mat-khau' element={<PrivateRouteForJobSeeker element={<ChangePassword />} />} />
          <Route path='/viec-lam-phu-hop' element={<PrivateRouteForJobSeeker element={<JobsFit />} />} />
          <Route path='/tao-cv' element={<PrivateRouteForJobSeeker element={<CVBuilder />} />} />
          <Route path='/cv-cua-toi' element={<PrivateRouteForJobSeeker element={<CvList />} />} />
          <Route path="/education" element={<PrivateRouteForJobSeeker element={<Education />} />} />
          <Route path="/education/list" element={<PrivateRouteForJobSeeker element={<EducationList />} />} />
          <Route path="/work-history" element={<PrivateRouteForJobSeeker element={<WorkHistory />} />} />
          <Route path="/work-history/list" element={<PrivateRouteForJobSeeker element={<WorkHistoryList />} />} />
          <Route path="/momo-payment/verify" element={<PrivateRouteForJobSeeker element={<MomoCallback />} />} />
          <Route path="/skill" element={<PrivateRouteForJobSeeker element={<Skill />} />} />
          <Route path="/summary" element={<PrivateRouteForJobSeeker element={<Summary />} />} />
          <Route path="/extra" element={<PrivateRouteForJobSeeker element={<Extra />} />} />
          <Route path="/preview" element={<PrivateRouteForJobSeeker element={<Preview />} />} />
          <Route path="/tin-nhan" element={<PrivateRouteForJobSeeker element={<Message />} />} />
          <Route path="/iq-test" element={<PrivateRouteForJobSeeker element={<IQQuiz />} />} />
          <Route path="/iq-home" element={<PrivateRouteForJobSeeker element={<IQHome />} />} />
        </Routes>
      </div>
    </div>
  );
};

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/firebase-messaging-sw.js')
    .then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch((error) => {
      console.error('Service Worker registration failed:', error);
    });
} else {
  console.error('Service Worker not supported in this browser.');
}

const getRoleFromToken = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.role || null;
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};

const requestNotificationPermission = async () => {
  try {
    // Check if the user has already granted permission
    const permission = Notification.permission;

    if (permission === "granted") {
      // If permission is granted, retrieve the token
      const currentToken = await getToken(messaging, {
        vapidKey: "BH076IGPbTBV8Boh8I6vKX-7QpyT9OD4AQ0icfUxN7eUM7QEJ35F1Yk8qxFqHCeS9ftln3UsXR8rlduennz0kMQ",
      });
      if (currentToken) {
        console.log("FCM Token:", currentToken);
        await addFCMToken(currentToken)
      } else {
        console.log("No registration token available. Request permission to generate one.");
      }
    } else if (permission === "default") {
      // Request permission if not explicitly granted or denied
      const permissionResult = await Notification.requestPermission();
      if (permissionResult === "granted") {
        const currentToken = await getToken(messaging, {
          vapidKey: "BH076IGPbTBV8Boh8I6vKX-7QpyT9OD4AQ0icfUxN7eUM7QEJ35F1Yk8qxFqHCeS9ftln3UsXR8rlduennz0kMQ",
        });
        console.log("FCM Token:", currentToken);
        await addFCMToken(currentToken)
      } else {
        console.warn("Notification permission not granted.");
      }
    } else {
      console.warn("Notifications are denied by the user.");
    }
  } catch (error) {
    console.error("Permission denied or error:", error);
  }
};

onMessage(messaging, (payload) => {
  console.log("Message received. ", payload.data.message);
});


const RootApp = () => (
  <AuthProvider>
    <Router>
      <ToastContainer />
      <App />
    </Router>
  </AuthProvider>
);

export default RootApp;
