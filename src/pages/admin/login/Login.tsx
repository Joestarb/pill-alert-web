import React from "react";
import texture from "../../../assets/image/texture.png";
import loginImage from '../../../assets/image/login_image.png';
import AdminLoginForm from "./components/adminLoginForm";
const Login: React.FC = () => {
  return (
      <div className="grid grid-cols-2 w-screen h-screen overflow-hidden">
          <img
            src={texture}
            alt="textura"
            className="absolute    opacity-35  "
          />
          <img
            src={texture}
            alt="textura"
            className="absolute     left-[29rem] opacity-35  "
          />
          <img
            src={texture}
            alt="textura"
            className="absolute top-[30rem]    opacity-35  "
          />
          <img
            src={texture}
            alt="textura"
            className="absolute top-[30rem]     left-[29rem] opacity-35  "
          />
        <section className=" relative">
        <AdminLoginForm/>
        </section>

        <section className="z-10 w-full">
          <img src={loginImage} className="w-full" alt="loginimage" />
        </section>
      </div>
  );
};

export default Login;
