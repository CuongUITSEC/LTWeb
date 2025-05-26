import React from "react";
import { Link } from "react-router-dom";
const SignupSection = () => {
    return (
        <section className="flex flex-col flex-1 items-start">
            <h2 className="mb-5 text-3xl font-semibold text-black">
                TẠO MỘT TÀI KHOẢN
            </h2>
            <p className="mb-4 text-base text-black">
                Hãy tạo tài khoản ngay ! Bạn có thể nhận được các dịch vụ đặc biệt cho
                riêng bạn như kiểm tra lịch sử mua hàng và nhận phiếu giảm giá cho thành
                viên. Đăng ký miễn phí ngay hôm nay!
            </p>
            <Link to="/signup">
                <button className="flex justify-center py-[10px] px-25 text-[20px] font-medium text-black border-2 border-black border-solid cursor-pointer hover:text-[#404040] hover:border-[#404040]">
                    TẠO TÀI KHOẢN
                </button>
            </Link>
        </section>
    );
};

export default SignupSection; 