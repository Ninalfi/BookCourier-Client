import React from 'react';
import Logo from '../components/Shared/Logo';
import { NavLink, Outlet } from 'react-router';

const AuthLayout = () => {
    return (
        <div className='max-w-7xl p-8 mx-auto'>
            <NavLink to='/'><Logo></Logo></NavLink>
            <div className='flex '>
                <div className='flex-1'>
                    <Outlet></Outlet>
                </div>
                {/* <div className='flex-1'>
                    <img src="https://i.ibb.co.com/t14jPnW/Gemini-Generated-Image-1mf8t01mf8t01mf8.png" alt="" />
                </div> */}
            </div>
        </div>
    );
};

export default AuthLayout;