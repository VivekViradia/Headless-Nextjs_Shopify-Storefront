import React from 'react'

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap items-center justify-between">
                    <div className="w-full md:w-auto mb-4 md:mb-0">
                        <p>&copy; 2023 Your Company. All rights reserved.</p>
                    </div>
                    <div className="w-full md:w-auto">
                        <ul className="flex space-x-4">
                            <li><a href="#" className="text-white hover:text-gray-400">Home</a></li>
                            <li><a href="#" className="text-white hover:text-gray-400">About</a></li>
                            <li><a href="#" className="text-white hover:text-gray-400">Services</a></li>
                            <li><a href="#" className="text-white hover:text-gray-400">Contact</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer