import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        // Email validation
        if (!formData.email) {
            newErrors.email = 'Vui lòng nhập địa chỉ email';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Vui lòng nhập mật khẩu';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                // Here you would typically make an API call to login the user
                console.log('Login submitted:', formData);
                // await loginUser(formData);
            } catch (error) {
                console.error('Login error:', error);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="flex flex-col flex-1">
            <h2 className="text-3xl font-medium text-black mb-5">ĐĂNG NHẬP</h2>
            <p className='mb-4'>Đăng nhập bằng địa chỉ email và mật khẩu của bạn.</p>
            <form onSubmit={handleSubmit} noValidate className="flex flex-col items-start gap-5">
                <div className='w-full'>
                    <label htmlFor="email" className="block text-xl font-medium text-black mb-2">
                        ĐỊA CHỈ EMAIL
                    </label>
                    <div className="flex flex-col">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="w-full h-12 placeholder-gray-500 px-3 py-2 border-b-2 border-b-[#898989] bg-[#F5F5F5]
                                focus:bg-white focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-black"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder='Nhập email hợp lệ'
                        />
                        {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email}</span>}
                    </div>
                </div>

                <div className='w-full'>
                    <label htmlFor="password" className="block text-xl font-medium text-black mb-2">
                        MẬT KHẨU
                    </label>
                    <div className="flex flex-col">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            required
                            className="w-full h-12 placeholder-gray-500 px-3 py-2 border-b-2 border-b-[#898989] bg-[#F5F5F5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-black"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder='Nhập mật khẩu'
                        />
                        {errors.password && <span className="text-red-500 text-sm mt-1">{errors.password}</span>}
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
                    <label htmlFor="showPassword" className="ml-2 block text-[16px] text-gray-700">
                        Hiện mật khẩu
                    </label>
                </div>

                <div className='flex flex-col gap-2'>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-[10px] px-25 border border-transparent text-[20px] font-medium text-white bg-black hover:bg-[#404040] cursor-pointer"
                    >
                        ĐĂNG NHẬP
                    </button>

                    <Link to="/forgot-password" className="block text-[16px] font-medium text-black hover:text-[#444444]">
                        Quên mật khẩu?
                    </Link>
                </div>
                <div className='w-full'>
                    <div className="relative mb-2">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Hoặc đăng nhập với</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => console.log('Google login')}
                            className="flex items-center justify-center px-4 py-[10px] border border-gray-300 text-[20px] font-medium text-gray-700 bg-white hover:bg-gray-100"
                        >
                            <FcGoogle className="h-5 w-5 mr-2" />
                            Google
                        </button>
                        <button
                            type="button"
                            onClick={() => console.log('Facebook login')}
                            className="flex items-center justify-center px-4 py-[10px] border border-gray-300 text-[20px] font-medium text-gray-700 bg-white hover:bg-gray-100"
                        >
                            <FaFacebook className="h-5 w-5 mr-2 text-blue-600" />
                            Facebook
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;