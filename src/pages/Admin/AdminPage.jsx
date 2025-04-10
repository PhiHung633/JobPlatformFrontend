import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from '../../components/Admin/AdminSidebar';
import Job from './JobPage.jsx';
import User from './UserPage.jsx';
import Dashboard from './Statistic.jsx';
import Quiz from './Quiz.jsx'
import { useEffect } from 'react';


function Admin() {
    useEffect(() => {
        document.body.style.overflow = 'hidden'; 

        return () => {
            document.body.style.overflow = ''; 
        };
    }, []);
    return (
        <div style={{ display: 'flex', overflow: 'hidden' }}>
            <Sidebar />
            <div style={{
                marginLeft: '17rem',
                flex: 1,
                overflowY: 'auto',
                height: '102vh'
            }}>
                <Routes>
                    <Route path="/" element={<Job />} />
                    <Route path="users" element={<User />} />
                    <Route path="statistics" element={<Dashboard />} />
                    <Route path="questions" element={<Quiz />} />
                </Routes>
            </div>
        </div>
    );
}

export default Admin;
