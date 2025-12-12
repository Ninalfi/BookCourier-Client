import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../components/Shared/Navbar';
import Footer from '../components/Shared/Footer';

const RootLayout = () => {
    return (
        <div>
            <Navbar></Navbar>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default RootLayout;