import React from 'react';
import Banner from './Banner';
import { CoverageMap } from './CoverageMap';
import { NavLink } from 'react-router';
import WhyUs from './WhyUs';
import ExchangeOffers from './ExchangeOffers';
import Reviews from './Reviews';
import Explore from './Explore';
import About from './About';
import FAQ from './FAQ';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <NavLink to='/coverage'><CoverageMap></CoverageMap></NavLink>
            <WhyUs></WhyUs>
            <ExchangeOffers></ExchangeOffers>
            <Explore></Explore>
            <Reviews></Reviews>
            <About></About>
            <FAQ></FAQ>
        </div>
    );
};

export default Home;