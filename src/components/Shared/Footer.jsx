import React from 'react';
import { FaFacebook, FaGithub } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { Link } from 'react-router';
import Logo from './Logo';

const Footer = () => {
    return (
        <footer class="bg-blue-950 text-white p-10 md:p-20">
    <div class="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 lg:gap-16">

        <div class="col-span-1 space-y-4">
            <div class="flex items-center space-x-2">
                <div class="text-3xl font-bold bg-orange-200">
                    <Logo></Logo>
                </div>
            </div>
            <p class="text-sm text-gray-400 max-w-xs">
                BookCourier is a modern Library-to-Home Delivery System that allows users to browse books online, request home delivery or pickup, and manage their borrowing seamlessly without visiting the library.
            </p>
            <div class="flex space-x-3 pt-2">
                <Link to="https://www.facebook.com">   <FaFacebook></FaFacebook>
                </Link>
                <Link to="https://www.facebook.com"> <FaGithub />  
                </Link>
                <Link to="https://www.facebook.com">   <FaXTwitter />
                </Link>
            </div>
       
        </div>

        <div class="col-span-1 space-y-4">
            <h6 class="footer-title text-base font-semibold border-b-2 border-orange-500 pb-1 inline-block">Costumers Support</h6>
            <div class="flex flex-col space-y-3 text-sm text-gray-400">
                <a class="link link-hover flex items-center hover:text-orange-400">
                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 5v4a1 1 0 002 0V5a1 1 0 10-2 0zm1 10a1 1 0 100-2 1 1 0 000 2z"/></svg>
                    Store List
                </a>
                <a class="link link-hover flex items-center hover:text-orange-400">
                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 5v4a1 1 0 002 0V5a1 1 0 10-2 0zm1 10a1 1 0 100-2 1 1 0 000 2z"/></svg>
                    Opening Hours
                </a>
                <a class="link link-hover flex items-center hover:text-orange-400">
                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 5v4a1 1 0 002 0V5a1 1 0 10-2 0zm1 10a1 1 0 100-2 1 1 0 000 2z"/></svg>
                    Contact Us
                </a>
                <a class="link link-hover flex items-center hover:text-orange-400">
                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 5v4a1 1 0 002 0V5a1 1 0 10-2 0zm1 10a1 1 0 100-2 1 1 0 000 2z"/></svg>
                    Return Policy
                </a>
            </div>
        </div>

        <div class="col-span-1 space-y-4">
            <h6 class="footer-title text-base font-semibold border-b-2 border-orange-500 pb-1 inline-block">Categories</h6>
            <div class="flex flex-col space-y-3 text-sm text-gray-400">
                <a class="link link-hover flex items-center hover:text-orange-400">
                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 5v4a1 1 0 002 0V5a1 1 0 10-2 0zm1 10a1 1 0 100-2 1 1 0 000 2z"/></svg>
                    Novel Books
                </a>
                <a class="link link-hover flex items-center hover:text-orange-400">
                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 5v4a1 1 0 002 0V5a1 1 0 10-2 0zm1 10a1 1 0 100-2 1 1 0 000 2z"/></svg>
                    Poetry Books
                </a>
                <a class="link link-hover flex items-center hover:text-orange-400">
                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 5v4a1 1 0 002 0V5a1 1 0 10-2 0zm1 10a1 1 0 100-2 1 1 0 000 2z"/></svg>
                    Political Books
                </a>
                <a class="link link-hover flex items-center hover:text-orange-400">
                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 5v4a1 1 0 002 0V5a1 1 0 10-2 0zm1 10a1 1 0 100-2 1 1 0 000 2z"/></svg>
                    History Books
                </a>
            </div>
        </div>

        <div class="col-span-1 space-y-4">
            <h6 class="footer-title text-base font-semibold border-b-2 border-orange-500 pb-1 inline-block">Newsletter</h6>
            <p class="text-sm text-gray-400">
                Sign up to searing weekly newsletter to get the latest updates.
            </p>
            <form>
                <fieldset class="form-control w-full">
                    <div class="relative">
                        <input type="text" placeholder="Enter Email Address" class="input w-full pr-16 bg-blue-900 border-blue-800 text-sm text-white focus:border-orange-500 focus:outline-none" />
                        <button class="btn btn-square absolute top-0 right-0 rounded-l-none bg-orange-500 hover:bg-orange-600 border-none text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.32-3.32a.5.5 0 0 1-.11-.54L7.58 3.551.996 6.551A.5.5 0 0 1 .146 6.3l15.854-6.154z"/></svg>
                        </button>
                    </div>
                </fieldset>
            </form>
        </div>
    </div>

    <div class="absolute bottom-0 left-0 opacity-20">
        </div>
    <div className=' w-full mx-auto mt-10'>
        <aside>
    <p className='text-center'>Copyright © {new Date().getFullYear()} - All right reserved by BookCourier Industries Ltd</p>
   
  </aside>
    </div>
</footer>

    );
};

export default Footer;