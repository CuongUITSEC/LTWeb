import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdHeartEmpty } from "react-icons/io";
import { PiShoppingCartSimple } from "react-icons/pi";
import { AiOutlineUser } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";
import { logoutUser } from "../../redux/slices/authSlice";
import { CgProfile } from "react-icons/cg";
import { RiAdminLine } from "react-icons/ri";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { toast } from "sonner";

import MenuSide from "./MenuSide";
import SearchBar from "./SearchBar";
import { useCart } from "../Cart/CartContext";

const Navbar = () => {
  const { getTotalItems } = useCart();
  const { userInfo } = useSelector((state) => state.auth);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cart } = useSelector((state) => state.cart);
  const uniqueProductCount = cart?.products?.length || 0;

  // Kiểm tra quyền admin
  const isAdmin = userInfo?.role === "admin";

  // Đóng dropdown khi click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Hàm xử lý đăng xuất
  const handleLogout = async () => {
    try {
      // Gọi async logout
      await dispatch(logoutUser()).unwrap();
      
      toast.success("Đăng xuất thành công!");
      navigate("/");
      setShowDropdown(false);
    } catch (error) {
      // Dù có lỗi vẫn logout và hiển thị thông báo
      toast.success("Đăng xuất thành công!");
      navigate("/");
      setShowDropdown(false);
    }
  };

  return (
    <>
      <nav className="relative flex items-center justify-between h-16 md:h-[88px] px-4 md:px-[50px]">
        {/* Menu + SearchBar luôn nằm cùng 1 hàng ngang */}
        <div className="flex items-center gap-2 md:gap-[20px]">
          <MenuSide />
          <div className="flex items-center">
            <SearchBar hideTextOnMobile />
          </div>
        </div>

        {/* Logo */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <button
            type="button"
            className="text-xl md:text-[30px] font-medium font-Jost focus:outline-none cursor-pointer"
            onClick={() => {
              if (window.location.pathname === "/") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              } else {
                navigate("/");
              }
            }}
          >
            Wukudada.
          </button>
        </div>

        {/* tài khoản + giỏ hàng */}
        <div className="flex items-center gap-2 md:gap-[20px]">
          {/* Admin button - chỉ hiển thị cho admin trên desktop */}
          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-1 bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800 transition-colors"
            >
              <RiAdminLine className="text-[16px]" />
              <span className="hidden md:inline">Admin</span>
            </Link>
          )}
          {userInfo ? (
            // Nếu đã đăng nhập, hiển thị avatar với dropdown
            <div className="relative" ref={dropdownRef}>
              <div
                className="flex items-center gap-[10px] cursor-pointer"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {userInfo.profileImage ? (
                  <img
                    src={userInfo.profileImage}
                    alt={userInfo.name}
                    className="w-[24px] h-[24px] md:w-[30px] md:h-[30px] rounded-full object-cover"
                  />
                ) : (
                  <AiOutlineUser className="text-[18px] md:text-[20px]" />
                )}
                <span className="hidden md:inline text-sm truncate max-w-[120px]">
                  {userInfo.name || "Tài khoản"}
                </span>
              </div>
              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute z-10 right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 animate-fadeIn">
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    <CgProfile className="mr-2" /> Hồ sơ của tôi
                  </Link>
                  <Link
                    to="/profile/orders"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    Đơn hàng của tôi
                  </Link>
                  {/* Admin menu item */}
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      <RiAdminLine className="mr-2" /> Quản trị
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <FiLogOut className="mr-2" /> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Nếu chưa đăng nhập, hiển thị link đến trang đăng nhập
            <Link to="/login" className="flex items-center gap-[10px]">
              <AiOutlineUser className="text-[20px]" />
              <span className="hidden md:inline text-sm">Tài khoản</span>
            </Link>
          )}
          <Link to="/cart" className="flex items-center gap-[10px] relative">
            {/* Icon giỏ hàng */}
            <div className="relative">
              <PiShoppingCartSimple className="text-[20px] md:text-[24px]" />
              {uniqueProductCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 md:w-5 md:h-5 bg-red-500 text-white text-[10px] md:text-xs rounded-full flex items-center justify-center">
                  {uniqueProductCount}
                </span>
              )}
            </div>
            <span className="hidden md:inline text-sm">Giỏ hàng</span>
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
