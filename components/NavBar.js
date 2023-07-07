'use client'

import Link from 'next/link'
import React from 'react'

const NavBar = () => {
    return (
        <header>
            <nav>
                <Link href='/' >
                    Home Button
                </Link>
            </nav>
        </header>
    )
}

export default NavBar
