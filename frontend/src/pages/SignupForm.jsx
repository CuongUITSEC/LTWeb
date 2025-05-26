import React, { useState } from 'react';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    birthDate: '',
    gender: '',
    agreeToTerms: false
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

    // Birth date validation
    if (!formData.birthDate) {
      newErrors.birthDate = 'Vui lòng chọn ngày sinh';
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = 'Vui lòng chọn giới tính';
    }

    // Terms agreement validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'Vui lòng đồng ý với điều khoản sử dụng';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        // Here you would typically make an API call to register the user
        console.log('Form submitted:', formData);
        // Add your API call here
        // await registerUser(formData);
      } catch (error) {
        console.error('Registration error:', error);
      }
    }
  };

  return (
    <div className="ml-24 mt-12 mb-36">
      <h2 className="text-3xl font-medium text-black mb-16">TẠO MỘT TÀI KHOẢN</h2>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6 items-start border border-[#DCDCDC] p-5 w-[55%]">
        <p className='w-3/4'>Chúng tôi sẽ gửi thư xác nhận đến địa chỉ email được liên kết với tài khoản của bạn. Hãy kiểm tra email đến từ chúng tôi.</p>

        {/* Email */}
        <div className="flex items-baseline gap-5 w-full">
          <label htmlFor="email" className="w-1/4 text-xl font-medium text-black">
            ĐỊA CHỈ EMAIL
          </label>
          <div className="w-3/4 flex flex-col">
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Nhập email hợp lệ"
              className="w-full h-12 px-3 py-2 border-b-2 border-b-[#898989] bg-[#F5F5F5] placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-black"
            />
            {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email}</span>}
          </div>
        </div>

        {/* Password */}
        <div className="flex items-baseline gap-5 w-full">
          <label htmlFor="password" className="w-1/4 text-xl font-medium text-black">
            MẬT KHẨU
          </label>
          <div className="w-3/4 flex flex-col">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Nhập mật khẩu"
              className="w-full h-12 px-3 py-2 border-b-2 border-b-[#898989] bg-[#F5F5F5] placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-black"
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

        {/* Birth Date */}
        <div className="flex items-baseline gap-5 w-full">
          <label htmlFor="birthDate" className="w-1/4 text-xl font-medium text-black">
            NGÀY SINH
          </label>
          <div className="w-3/4 flex flex-col">
            <input
              id="birthDate"
              name="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={handleChange}
              required
              className="w-full h-12 px-3 py-2 border-b-2 border-b-[#898989] bg-[#F5F5F5] placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-black"
            />
            {errors.birthDate && <span className="text-red-500 text-sm mt-1">{errors.birthDate}</span>}
          </div>
        </div>

        {/* Gender */}
        <div className="flex items-center gap-5 w-full">
          <label className="w-1/4 text-xl font-medium text-black">
            GIỚI TÍNH
          </label>
          <div className="w-3/4 flex gap-10">
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === 'male'}
                onChange={handleChange}
                className="h-5 w-5 accent-black"
              />
              <span className="ml-2">Nam</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === 'female'}
                onChange={handleChange}
                className="h-5 w-5 accent-black"
              />
              <span className="ml-2">Nữ</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="other"
                checked={formData.gender === 'other'}
                onChange={handleChange}
                className="h-5 w-5 accent-black"
              />
              <span className="ml-2">Bỏ qua</span>
            </label>
            {errors.gender && <span className="text-red-500 text-sm">{errors.gender}</span>}
          </div>
        </div>

        {/* Terms Agreement */}
        <div className="flex items-center">
          <div className="flex items-center">
            <input
              id="agreeToTerms"
              name="agreeToTerms"
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className="h-5 w-5 accent-black border-[#FFFFFF]"
            />
            <label htmlFor="agreeToTerms" className="ml-2 block text-[16px] text-gray-700">
              Tôi đồng ý với ĐIỀU KHOẢN SỬ DỤNG và CHÍNH SÁCH BẢO MẬT của Wukudada.
            </label>
          </div>
        </div>
        {errors.agreeToTerms && <span className="text-red-500 text-sm">{errors.agreeToTerms}</span>}

        {/* Submit */}
        <button
          type="submit"
          className="flex justify-center py-[10px] px-25 border border-transparent text-[20px] font-medium text-white bg-black hover:bg-[#404040] cursor-pointer"
        >
          ĐĂNG KÝ
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
