import { BrowserRouter as Router, Routes, Route, useLocation, BrowserRouter } from 'react-router-dom';

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
import CvList from './pages/JobSeeker/CVList.jsx';
import AddCompany from './pages/Employer/AddCompany.jsx';
import { matchPath } from 'react-router-dom';
import JobApplicationPopup from './components/JobDetail/JobApplicationPopup.jsx';
import PersonalInformation from './pages/PersonalInformation/PersonalInformation.jsx';

const App = () => {
  const location = useLocation();

  const noHeaderRoutes = [
    '/dang-ki', '/dang-nhap', '/quen-mat-khau', '/dang-ki-danh-cho-nha-tuyen-dung',
    '/dashboard', '/dashboard/quan-li-cong-viec', '/dashboard/tao-cong-viec',
    '/dashboard/quan-li-cv', '/dashboard/them-cong-ti'
  ];

  const isNoHeaderRoute = noHeaderRoutes.some(route => {
    return matchPath({ path: route, end: route.includes(':') }, location.pathname);
  });

  return (
    <div className="bg-gray-100 min-h-screen w-full">
      {!isNoHeaderRoute && <Header />}
      <div className="w-full mx-auto">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/dang-ki' element={<RegistrationForm />} />
          <Route path='/dang-ki-danh-cho-nha-tuyen-dung' element={<EmployerRegistrationForm />} />
          <Route path='/dang-nhap' element={<LoginForm />} />
          <Route path='/quen-mat-khau' element={<ForgotPassword />} />
          <Route path='/cai-dat-thong-tin-ca-nhan' element={<PersonalInformation />} />
          <Route path='/cong-ti' element={<Company />} />
          <Route path="/cong-ti/:id" element={<CompanyDetails />} />
          <Route path='/viec-lam-da-ung-tuyen' element={<JobApplied />} />
          <Route path='/viec-lam-da-luu' element={<JobSaved />} />
          <Route path='/viec-lam/:id' element={<JobDetail />} />
          <Route path='/tim-viec-lam' element={<JobsSearch />} />
          <Route path='/viec-lam-phu-hop' element={<JobsFit />} />
          <Route path='/tao-cv' element={<CVBuilder />} />
          <Route path='/cv-cua-toi' element={<CvList />} />
          <Route path="/education" element={<Education />} />
          <Route path="/education/list" element={<EducationList />} />
          <Route path="/work-history" element={<WorkHistory />} />
          <Route path="/work-history/list" element={<WorkHistoryList />} />
          <Route path="/skill" element={<Skill />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/extra" element={<Extra />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="quan-li-cong-viec" element={<ManageJobs />} />
            <Route path="tao-cong-viec" element={<CreateJob />} />
            <Route path="quan-li-cv" element={<ManageCV />} />
            <Route path="them-cong-ti" element={<AddCompany />} />
            <Route path="them-cong-ti/:idCompany" element={<AddCompany />} />
          </Route>
          <Route path="/aloo" element={<JobApplicationPopup />} />

        </Routes>
      </div>
    </div>
  );
}

const RootApp = () => (
    <Router>
      <App />
    </Router>
);

export default RootApp;
