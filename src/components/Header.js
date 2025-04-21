import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { FaUserCircle } from "react-icons/fa";
import Swal from "sweetalert2";

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (err) {
        console.error("Invalid token", err);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "Bạn có chắc muốn đăng xuất?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đăng xuất",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/login");
      }
    });
  };
  

  return (
    <header className="py-4 shadow-md" style={{ backgroundColor: "#9AA6B2", color: "#F8FAFC" }}>
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
        <Link
          to="/"
          className="text-2xl font-bold mb-4 md:mb-0 hover:text-yellow-400 no-underline"
          style={{ color: "#F8FAFC" }}
        >
          SHOP BOOK
        </Link>

        <ul className="grid grid-cols-2 md:flex md:space-x-4 gap-2 text-center items-center">
          <li><Link to="/BookList" className="underline-animate" style={{ color: "#F8FAFC" }}>Danh sách sản phẩm</Link></li>
          {user?.role === "admin" && (
            <>
              <li><Link to="/add" className="underline-animate" style={{ color: "#F8FAFC" }}>Thêm sản phẩm</Link></li>
              <li><Link to="/update" className="underline-animate" style={{ color: "#F8FAFC" }}>Cập nhật</Link></li>
              <li><Link to="/delete" className="underline-animate" style={{ color: "#F8FAFC" }}>Xóa sản phẩm</Link></li>
            </>
          )}
          <li>
            {user ? (
              <div className="flex items-center gap-2 text-white">
                <FaUserCircle size={20} />
                <span>{user.username}</span>
                <button
                  onClick={handleLogout}
                  className="underline-animate hover:text-yellow-300"
                  style={{ color: "#F8FAFC" }}
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1 underline-animate hover:text-yellow-300"
                style={{ color: "#F8FAFC" }}
              >
                <span>Đăng nhập</span>
              </Link>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
