import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { API_URL } from "../utils/api";

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      const token = searchParams.get("token");
      const error = searchParams.get("error");

      if (token) {
        try {
          // Lưu token vào localStorage
          localStorage.setItem("userToken", token);

          // Lấy thông tin người dùng từ API
          const response = await axios.get(`${API_URL}/api/users/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = response.data;
          // Chuyển đổi định dạng dữ liệu nếu cần
          if (data.birth) {
            // Format date để hiển thị đúng
            data.birth = new Date(data.birth).toLocaleDateString("vi-VN");
          }

          // Lưu thông tin người dùng vào localStorage
          localStorage.setItem("userInfo", JSON.stringify(data));

          // Cập nhật Redux state - thêm skipToast để ngăn toast kép
          dispatch({
            type: "auth/loginSuccess",
            payload: {
              userInfo: {
                ...data,
                skipToast: true, // Thêm flag để tránh hiển thị toast trùng lặp
              },
              userToken: token,
            },
          });

          toast.success("Đăng nhập Google thành công!");
          navigate("/");
        } catch (error) {
          console.error("Error fetching user profile:", error);
          toast.error("Lỗi khi lấy thông tin người dùng");
          navigate("/login");
        }
      } else if (error) {
        toast.error("Đăng nhập Google thất bại");
        navigate("/login");
      } else {
        navigate("/login");
      }
    };

    handleGoogleCallback();
  }, [searchParams, navigate, dispatch]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Đang xử lý đăng nhập...
          </h2>
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
          <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    </div>
  );
};

export default GoogleCallback;
