import React from 'react';
import Banner from './Banner';
import { CoverageMap } from './CoverageMap';
import { NavLink } from 'react-router';
import WhyUs from './WhyUs';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <NavLink to='/coverage'><CoverageMap></CoverageMap></NavLink>
            <WhyUs></WhyUs>
        </div>
    );
};

export default Home;