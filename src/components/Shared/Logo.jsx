import React from 'react';
import { GiBookAura } from 'react-icons/gi';

const Logo = () => {
    return (
        <div className="flex items-center text-2xl font-bold text-(--bc-text)">
            <GiBookAura></GiBookAura>
            <span className="ml-2">BookCourier</span>
        </div>
    );
};

export default Logo;