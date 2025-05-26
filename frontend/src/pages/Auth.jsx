import React from 'react';
import LoginForm from '../components/Auth/LoginForm';
import SignupSection from '../components/Auth/SignupSection';

const Auth = () => {
    return (
        <section className="flex px-23 pt-[50px] pb-[150px] bg-white max-md:p-8 max-sm:px-2.5 max-sm:py-5">
            <div className="flex gap-10 justify-between w-full max-md:flex-col max-md:gap-8 border-[2px] border-[#DCDCDC] p-5">
                <LoginForm />
                <div className="w-[1px] my-[50px] bg-[#DCDCDC]"></div>
                <SignupSection />
            </div>
        </section>
    );
};

export default Auth; 