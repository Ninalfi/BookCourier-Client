import React from 'react';
import Banner from './Banner';
import { CoverageMap } from './CoverageMap';
import { NavLink } from 'react-router';
import WhyUs from './WhyUs';
import ExchangeOffers from './ExchangeOffers';
import Reviews from './Reviews';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <NavLink to='/coverage'><CoverageMap></CoverageMap></NavLink>
            <WhyUs></WhyUs>
            <ExchangeOffers></ExchangeOffers>
            <Reviews></Reviews>
        </div>
    );
};

export default Home;