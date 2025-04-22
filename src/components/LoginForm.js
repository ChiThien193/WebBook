import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify"; 
import 'react-toastify/dist/ReactToastify.css';

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://backend-web-book.onrender.com/api/login", {
        username,
        password,
      });
      const token = res.data.token;
      if (token) {
        localStorage.setItem("token", token);
        toast.success("Đăng nhập thành công!");
        setTimeout(() => navigate("/"), 1000);
      } else {
        toast.error("Không nhận được token!");
      }
    } catch (err) {
      toast.error("Kiểm tra lại tên đăng nhập hoặc mật khẩu!");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Mật khẩu không khớp!");
      return;
    }
    try {
      await axios.post("https://backend-web-book.onrender.com/api/register", {
        username,
        password,
      });
      toast.success("Đăng ký thành công! ");
      setIsLogin(true);
    } catch (err) {
      toast.error("Đăng ký thất bại!");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 bg-white shadow-md rounded p-6">
      <ToastContainer /> 
      
      <h2 className="text-xl font-bold mb-4 text-center">
        {isLogin ? "Đăng nhập" : "Đăng ký"}
      </h2>

      <form onSubmit={isLogin ? handleLogin : handleRegister}>
        <input
          className="w-full border mb-2 p-2 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Tên đăng nhập"
        />
        <input
          className="w-full border mb-2 p-2 rounded"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mật khẩu"
        />
        {!isLogin && (
          <input
            className="w-full border mb-2 p-2 rounded"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Xác nhận mật khẩu"
          />
        )}
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 transition"
          type="submit"
        >
          {isLogin ? "Đăng nhập" : "Đăng ký"}
        </button>
      </form>

      <div className="text-center mt-4">
        <span>{isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}</span>
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-500 hover:underline ml-2"
        >
          {isLogin ? "Đăng ký" : "Đăng nhập"}
        </button>
      </div>

      <button
        onClick={() => navigate("/")}
        className="mt-4 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded transition"
      >
        Quay về trang chủ
      </button>
    </div>
  );
}
