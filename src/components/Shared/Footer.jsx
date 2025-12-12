import React from 'react';

const Footer = () => {
    return (
        <footer class="bg-blue-950 text-white p-10 md:p-20">
    <div class="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 lg:gap-16">

        <div class="col-span-1 space-y-4">
            <div class="flex items-center space-x-2">
                <div class="text-3xl font-bold text-orange-400">
                    <img src="YOUR_LOGO_URL" alt="BookCourier Logo" class="h-8 w-8 inline-block mr-2" />
                    Bookle
                </div>
            </div>
            <p class="text-sm text-gray-400 max-w-xs">
                Phasellus ultricies aliquam volutpat ullamcorper laoreet neque, a lacinia curabitur lacinia mollis
            </p>
            <div class="flex space-x-3 pt-2">
                <a href="#" class="btn btn-circle btn-sm bg-blue-900 border-blue-800 hover:bg-blue-800 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.33 6.75 7.953v-5.625h-2.03V8.05H6.75V6.275c0-2.008 1.195-3.13 3.02-3.13.877 0 1.714.157 1.714.157v1.859h-1.041c-.914 0-1.298.57-1.298 1.248V8.05h2.345l-.34 2.345H10.5V16c3.823-.623 6.75-3.935 6.75-7.951z"/></svg>
                </a>
                <a href="#" class="btn btn-circle btn-sm bg-blue-900 border-blue-800 hover:bg-blue-800 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M5.026 15c-2.5-0.1-4.8-1.5-6.6-4.2C-.7 8.3-0.5 5.5 1.5 3.5c1.9-2 4.6-2.2 7.1-0.9 2.5 1.4 3.9 3.8 3.5 6.4-0.4 2.6-2.5 4.6-5.1 4.7zM11 1.5c-0.2-0.5-0.5-0.9-1.3-1.4-0.8-0.5-1.9-0.7-3.2-0.2-1.3 0.5-2.2 1.5-2.6 2.6s0 2.4 1.1 3.2c1.1 0.9 2.7 1.1 4.1 0.6 1.4-0.5 2.5-1.5 2.9-2.7s-0.2-2.3-1.1-3zM15 11c0 0.2 0 0.3-0.1 0.5l-2.9-1.9c0.2-0.1 0.4-0.1 0.7-0.1 1.1 0 1.9 0.9 1.9 1.9z"/></svg>
                </a>
                <a href="#" class="btn btn-circle btn-sm bg-blue-900 border-blue-800 hover:bg-blue-800 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V9.359c0-.285.051-.57.142-.835.263-.787 1.056-1.328 1.972-1.328.76 0 1.34.34 1.685.823.167.24.25.53.25.823V13.394h2.203V8.84c0-1.168-.61-2.146-1.745-2.618C10.052 6.136 9.3 6.1 8.766 6.1c-.604 0-1.1.285-1.472.787-.202.263-.335.59-.335.94V13.394H4.943zM3.444 6.784h2.204V13.394H3.444V6.784zM3.444 4.88c0 .99-.81 1.8-1.8 1.8-.99 0-1.8-.81-1.8-1.8s.81-1.8 1.8-1.8c.99 0 1.8.81 1.8 1.8z"/></svg>
                </a>
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
</footer>
    );
};

export default Footer;