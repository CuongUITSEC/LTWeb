import React from 'react'
import { Link } from 'react-router-dom'
import { IoMdHeartEmpty } from "react-icons/io"
import { PiShoppingCartSimple } from "react-icons/pi";
import { AiOutlineUser } from "react-icons/ai";

import MenuSide from './MenuSide'
import SearchBar from './SearchBar';

const Navbar = () => {
    return (
        <>
            <nav className="relative flex items-center justify-between h-[88px] px-[50px]">
                {/* Menu + Search */}
                <div className='flex items-center gap-[20px]'>
                    {/* Nút menu */}
                    <MenuSide />
                    {/* Tìm kiếm */}
                    <SearchBar />
                </div>

                {/* Logo */}
                <div className='absolute left-1/2 -translate-x-1/2'>
                    <Link to="/" className="text-[30px] font-medium font-Jost">Wukudada.</Link>
                </div>

                {/* Liên hệ + tài khoản + giỏ hàng */}
                <div className='flex items-center gap-[20px]'>
                    <button className='flex items-center gap-2.5 cursor-pointer'>
                        <span className='text-[14px] font-normal'>Liên hệ với chúng tôi</span>
                    </button>
                    <Link to="/login">
                        <AiOutlineUser className='text-[20px]' />
                    </Link>
                    <Link to="/cart">
                        <PiShoppingCartSimple className='text-[20px]' />
                    </Link>
                </div>
            </nav>
        </>
    )
}

export default Navbar
