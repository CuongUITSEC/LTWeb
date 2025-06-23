import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { loginUser, clearError, clearSuccess } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import FacebookLogin from "@greatsumini/react-facebook-login";
import axios from "axios";
import { API_URL } from "../utils/api";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the return URL from query parameters or location state
  const searchParams = new URLSearchParams(location.search);
  const returnUrl =
    searchParams.get("returnUrl") || location.state?.from || "/";

  // Get auth state from Redux
  const { loading, error, success, userInfo } = useSelector(
    (state) => state.auth
  );

  // Redirect to returnUrl if already logged in
  useEffect(() => {
    if (userInfo) {
      navigate(returnUrl, { replace: true });
    }
  }, [userInfo, navigate, returnUrl]);

  // Handle navigation after successful login
  useEffect(() => {
    if (success && userInfo) {
      if (!userInfo.skipToast) {
        toast.success("Đăng nhập thành công!");
      }
      dispatch(clearSuccess());
      // Navigate to the returnUrl
      navigate(returnUrl);
    }
  }, [success, userInfo, navigate, dispatch, returnUrl]);

  // Handle error display
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Vui lòng nhập địa chỉ email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(
        loginUser({
          email: formData.email,
          password: formData.password,
        })
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Google OAuth handler
  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/api/auth/google`;
  };

  const handleFacebookLogin = async (response) => {
    try {
      // Get the access token from the response
      const { accessToken } = response;

      // Send the token to your backend
      const backendResponse = await axios.post(
        `${API_URL}/api/auth/facebook/mobile`,
        { accessToken }
      );

      const { user, token } = backendResponse.data;

      // Save to localStorage
      localStorage.setItem("userInfo", JSON.stringify(user));
      localStorage.setItem("userToken", token);

      // Update Redux state
      dispatch({
        type: "auth/loginSuccess",
        payload: {
          userInfo: {
            ...user,
            skipToast: true,
          },
          userToken: token,
        },
      });

      toast.success("Đăng nhập Facebook thành công!");
      navigate(returnUrl);
    } catch (error) {
      console.error("Facebook login error:", error);
      toast.error("Đăng nhập Facebook thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="flex px-23 pt-[50px] pb-[150px] bg-white max-md:p-8 max-sm:px-2.5 max-sm:py-5">
      <div className="flex gap-10 justify-between w-full max-md:flex-col max-md:gap-8 border-[2px] border-[#DCDCDC] p-5">
        <div className="flex flex-col flex-1">
          <h2 className="text-3xl font-medium text-black mb-5">ĐĂNG NHẬP</h2>
          <p className="mb-4">
            Đăng nhập bằng địa chỉ email và mật khẩu của bạn.
          </p>
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col items-start gap-5"
          >
            <div className="w-full">
              <label
                htmlFor="email"
                className="block text-xl font-medium text-black mb-2"
              >
                ĐỊA CHỈ EMAIL
              </label>
              <div className="flex flex-col">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  disabled={loading}
                  className="w-full h-12 placeholder-gray-500 px-3 py-2 border-b-2 border-b-[#898989] bg-[#F5F5F5]
                                    focus:bg-white focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-black
                                    disabled:opacity-50 disabled:cursor-not-allowed"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Nhập email hợp lệ"
                />
                {errors.email && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.email}
                  </span>
                )}
              </div>
            </div>

            <div className="w-full">
              <label
                htmlFor="password"
                className="block text-xl font-medium text-black mb-2"
              >
                MẬT KHẨU
              </label>
              <div className="flex flex-col">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={loading}
                  className="w-full h-12 placeholder-gray-500 px-3 py-2 border-b-2 border-b-[#898989] bg-[#F5F5F5]
                                    focus:bg-white focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-black
                                    disabled:opacity-50 disabled:cursor-not-allowed"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu"
                />
                {errors.password && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.password}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="showPassword"
                name="showPassword"
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="h-5 w-5 accent-black border-[#FFFFFF]"
              />
              <label
                htmlFor="showPassword"
                className="ml-2 block text-[16px] text-gray-700"
              >
                Hiện mật khẩu
              </label>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-[10px] px-25 border border-transparent text-[20px] font-medium text-white bg-black hover:bg-[#404040] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Đang đăng nhập..." : "ĐĂNG NHẬP"}
              </button>

              <Link
                to="/forgot-password"
                className="block text-[16px] font-medium text-black hover:text-[#444444]"
              >
                Quên mật khẩu?
              </Link>
            </div>
            <div className="w-full">
              <div className="relative mb-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Hoặc đăng nhập với
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="flex items-center justify-center px-4 py-[10px] border border-gray-300 text-[20px] font-medium text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FcGoogle className="h-5 w-5 mr-2" />
                  Google
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="w-[1px] my-[50px] bg-[#DCDCDC]"></div>

        <div className="flex flex-col flex-1 items-start">
          <h2 className="mb-5 text-3xl font-semibold text-black">
            TẠO MỘT TÀI KHOẢN
          </h2>
          <p className="mb-4 text-base text-black">
            Hãy tạo tài khoản ngay ! Bạn có thể nhận được các dịch vụ đặc biệt
            cho riêng bạn như kiểm tra lịch sử mua hàng và nhận phiếu giảm giá
            cho thành viên. Đăng ký miễn phí ngay hôm nay!
          </p>
          <Link to="/signup">
            <button className="flex justify-center py-[10px] px-25 text-[20px] font-medium text-black border-2 border-black border-solid cursor-pointer hover:text-[#404040] hover:border-[#404040]">
              TẠO TÀI KHOẢN
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
