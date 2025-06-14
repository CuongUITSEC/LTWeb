import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookSquare, FaInstagramSquare, FaYoutube } from "react-icons/fa";
import Newsletter from "./Newsletter";

const Footer = () => {
  return (
    <div className="flex flex-col gap-6 md:gap-[53px] bg-[#F4F4F4]">
      <div className="flex flex-col md:flex-row items-center md:items-start px-4 md:px-[50px] pt-4 md:pt-[30px] gap-6 md:gap-0">
        {/* bên trái */}
        <div className="flex flex-col gap-[15px] flex-1 items-center md:items-start text-center md:text-left">
          <h3 className="font-semibold">Về Wukudada.</h3>
          <Link to="information" className="text-[14px] font-light">
            Thông tin
          </Link>
          <Link to="policy" className="text-[14px] font-light">
            Chính sách
          </Link>
        </div>
        {/* ở giữa */}
        <div className="flex flex-col gap-[15px] flex-1 items-center md:items-start text-center md:text-left">
          <h3 className="font-semibold">Liên hệ Wukudada.</h3>
          <div className="pr-0 md:pr-[50px]">
            <p className="text-[14px] font-light">
              Hotline:{" "}
              <a href="tel:+84567890111" className="font-normal">
                +84 567890111
              </a>
            </p>
            <p className="text-[14px] font-light">
              Email:{" "}
              <a href="mailto:wukudada@gmail.com" className="font-normal">
                wukudada@gmail.com
              </a>
            </p>
          </div>
          <p className="text-[14px] font-light">
            <span className="font-medium">Địa chỉ:</span> 123 Đường ABC, TP. HCM
          </p>
        </div>
        {/* bên phải */}
        <div className="flex flex-col gap-[15px] flex-1 items-center md:items-start text-center md:text-left">
          <h3 className="font-semibold">Theo dõi Wukudada.</h3>
          <div className="flex items-center gap-[15px] justify-center md:justify-start">
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookSquare className="h-[30px] w-[30px] text-[#757575]" />
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagramSquare className="h-[30px] w-[30px] text-[#757575]" />
            </a>
            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube className="h-[30px] w-[30px] text-[#757575]" />
            </a>
          </div>
        </div>
        <div className="hidden md:block">
          <Newsletter />
        </div>
      </div>
      <div className="flex items-center justify-center border-t-[1px] border-t-[#DCDCDC] py-[10px]">
        <p className="text-[14px] font-semibold text-center">
          Bản quyền thuộc Công ty TNHH Wukudada. Bảo lưu mọi quyền.
        </p>
      </div>
    </div>
  );
};

export default Footer;
