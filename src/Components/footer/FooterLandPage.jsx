import React from 'react';
import logo from '../../Assets/logo.png';
import { Twitter, Facebook, Youtube, Send } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-black text-white">
            <div className="max-w-7xl mx-auto px-6 py-16 ">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Logo Column */}
                    <div className="space-y-6">
                        <img
                            src={logo}
                            alt="CodeQuest POO Logo"
                            className="h-30 w-auto"
                        />
                        {/* FIM DA ÁREA DA LOGO */}
                    </div>

                    {/* Game Features Column */}
                    <div>
                        <h3 className="text-emerald-400 font-semibold text-lg mb-6">
                            Game Info
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="text-white hover:text-emerald-400 transition-colors duration-300">
                                    Recurso de jogo
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-white hover:text-emerald-400 transition-colors duration-300">
                                   Heróis
                                </a>
                            </li>
                           
                        </ul>
                    </div>

                    {/* Token Column */}
                    <div>
                        
                        <ul className="space-y-3 mt-8">
                            <li>
                                <a href="#" className="text-white hover:text-emerald-400 transition-colors duration-300">
                                    História
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-white hover:text-emerald-400 transition-colors duration-300">
                                    Jogue Agora
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter Column */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-5 py-3 bg-gray-900 border border-gray-800 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors duration-300"
                            />
                            <button className="px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-emerald-400 hover:text-white transition-all duration-300 whitespace-nowrap">
                                SUBSCRIBE
                            </button>
                        </div>

                        {/* Social Media Icons */}
                        <div className="flex items-center gap-4">
                            <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z" />
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                                <Youtube className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <circle cx="12" cy="12" r="10" />
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                                <Send className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-800 mb-8"></div>

                {/* Bottom Footer */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
                    <p>Copyright 2025</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-emerald-400 transition-colors duration-300">
                            Privacy Policy
                        </a>
                        <span>|</span>
                        <a href="#" className="hover:text-emerald-400 transition-colors duration-300">
                            Terms & Conditions
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;