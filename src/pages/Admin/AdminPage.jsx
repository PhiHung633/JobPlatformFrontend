import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from '../../components/Admin/AdminSidebar';
import Job from './JobPage.jsx';
import User from './UserPage.jsx';

function Admin() {
    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{
                marginLeft: '17rem',
                flex: 1,
                overflowY: 'auto',
                height: '100vh'
            }}>
                <Routes>
                    <Route path="/" element={<Job />} />
                    <Route path="users" element={<User />} />
                </Routes>
            </div>
        </div>
    );
}

export default Admin;
