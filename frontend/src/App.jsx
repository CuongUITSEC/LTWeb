import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import UserLayout from './components/Layout/UserLayout';
import Home from './pages/Home';
import LinenCollection from './pages/LinenCollection';
import Auth from './pages/Auth';
import SignupForm from './pages/SignupForm';

const App = () => {
  return (
    <BrowserRouter>
      {
        /*
        www.wukudada.com/home
        www.wukudada.com/products
        www.wukudada.com/cart
        .......
        */
      }
      <Routes>
        <Route path='/' element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="linen" element={<LinenCollection />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/signup" element={<SignupForm />} />
        </Route>

        <Route>
          {/* admin layout */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App