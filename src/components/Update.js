import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import Header from "./Header";

export function UpdatePage() {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [updatedBook, setUpdatedBook] = useState({
    name: "",
    category: "",
    id: "", 
    image: "",
    price: "",
    discount: "",
    author: "",
    publisher: ""
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const categoryCodes = {
    "TLTT": "Tâm lý - Trinh thám",
    "TLKH": "Khoa học",
    "TLLS": "Lịch sử",
  };

  const fetchBooks = async () => {
    try {
      const response = await axios.get("https://backend-web-book.onrender.com/api/books");
      setBooks(response.data);
    } catch (error) {
      console.error("Lỗi khi tải sách:", error);
    }
  };

  const handleEditClick = (book) => {
    setSelectedBook(book);
    setUpdatedBook({
      name: book.name,
      category: book.category || "",
      id: book.id || "", 
      image: book.image || "",
      price: book.price || "",
      discount: book.discount || "",
      author: book.author || "",
      publisher: book.publisher || ""
    });
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdatedBook((prev) => ({
      ...prev,
      [name]: value
    }));

    if (name === "category") {
      axios
        .get(`https://backend-web-book.onrender.com/api/books/generate-id/${value}`)
        .then((res) => {
          setUpdatedBook((prev) => ({
            ...prev,
            id: res.data.id
          }));
        })
        .catch((err) => console.log(err));
    }

    if (name === "image") {
      setUpdatedBook((prev) => ({
        ...prev,
        image: e.target.files[0] 
      }));
    }
  };

  const handleUpdateSubmit = async () => {
    if (!updatedBook.name || !updatedBook.price || !updatedBook.author) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const formData = new FormData();
    formData.append("name", updatedBook.name);
    formData.append("category", updatedBook.category);
    formData.append("id", updatedBook.id); 
    formData.append("price", updatedBook.price);
    formData.append("discount", updatedBook.discount);
    formData.append("author", updatedBook.author);
    formData.append("publisher", updatedBook.publisher);

    if (updatedBook.image && typeof updatedBook.image !== "string") {
      formData.append("image", updatedBook.image); 
    }

    try {
      const response = await axios.put(
        `https://backend-web-book.onrender.com/api/books/update/${selectedBook._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
      if (response.status === 200) {
        fetchBooks();
        setSelectedBook(null);
        setShowConfirmModal(false);
        toast.success("Cập nhật sách thành công!"); 
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật sách:", error);
      alert(" Lỗi khi cập nhật sách!");
    }
  };

  const handleConfirmUpdate = () => {
    setShowConfirmModal(true);
  };

  const handleCancelUpdate = () => {
    setShowConfirmModal(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const filteredBooks = books.filter((book) =>
    book.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastBook = currentPage * itemsPerPage;
  const indexOfFirstBook = indexOfLastBook - itemsPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  const paginatePrev = () => {
    setCurrentPage(currentPage - 1);
  };

  const paginateNext = () => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow max-w-7xl mx-auto p-4">
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-center">Cập nhật sách</h2>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Tìm kiếm sách theo tên..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 border rounded"
            />
          </div>
          <table className="table-auto w-full border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border">Tên sách</th>
                <th className="px-4 py-2 border">Hình ảnh</th>
                <th className="px-4 py-2 border">Giá</th>
                <th className="px-4 py-2 border">Giảm giá</th>
                <th className="px-4 py-2 border">Tác giả</th>
                <th className="px-4 py-2 border">Nhà xuất bản</th>
                <th className="px-4 py-2 border">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {currentBooks.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">Không có sách nào.</td>
                </tr>
              ) : (
                currentBooks.map((book) => (
                  <tr key={book._id}>
                    <td className="px-4 py-2 border">{book.name}</td>
                    <td className="px-4 py-2 border">
                      {book.image ? (
                        <img src={`https://backend-web-book.onrender.com${book.image}`} alt={book.name} className="w-20 h-24 object-cover rounded border" />
                      ) : "Không có ảnh"}
                    </td>
                    <td className="px-4 py-2 border">{book.price?.toLocaleString()}₫</td>
                    <td className="px-4 py-2 border">{book.discount}%</td>
                    <td className="px-4 py-2 border">{book.author}</td>
                    <td className="px-4 py-2 border">{book.publisher}</td>
                    <td className="px-4 py-2 border text-center">
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded" onClick={() => handleEditClick(book)}>
                        Cập nhật
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          
          <div className="flex justify-between mt-4">
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
              onClick={paginatePrev}
              disabled={currentPage === 1}
            >
              Trước
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
              onClick={paginateNext}
              disabled={currentPage * itemsPerPage >= filteredBooks.length}
            >
              Sau
            </button>
          </div>
        </div>

        {selectedBook && (
          <div className="bg-white shadow-md rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold mb-4">Chỉnh sửa thông tin sách</h3>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium">ID (Tự động)</label>
                <input
                  type="text"
                  name="id"
                  value={updatedBook.id}
                  readOnly
                  className="w-full px-4 py-2 border rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Tên sách</label>
                <input type="text" name="name" value={updatedBook.name} onChange={handleUpdateChange} className="w-full px-4 py-2 border rounded" required />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Phân loại</label>
                <select
                  name="category"
                  value={updatedBook.category}
                  onChange={handleUpdateChange}
                  className="w-full px-4 py-2 border rounded"
                >
                  <option value="">--Chọn phân loại--</option>
                  {Object.entries(categoryCodes).map(([code, label]) => (
                    <option key={code} value={code}>{label}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Giá</label>
                <input type="number" name="price" value={updatedBook.price} onChange={handleUpdateChange} className="w-full px-4 py-2 border rounded" required />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Giảm giá (%)</label>
                <input type="number" name="discount" value={updatedBook.discount} onChange={handleUpdateChange} className="w-full px-4 py-2 border rounded" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Tác giả</label>
                <input type="text" name="author" value={updatedBook.author} onChange={handleUpdateChange} className="w-full px-4 py-2 border rounded" required />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Nhà xuất bản</label>
                <input type="text" name="publisher" value={updatedBook.publisher} onChange={handleUpdateChange} className="w-full px-4 py-2 border rounded" />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Hình ảnh</label>
                <input type="file" name="image" onChange={handleUpdateChange} className="w-full px-4 py-2 border rounded" />
              </div>

              <button type="button" onClick={handleConfirmUpdate} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                Cập nhật
              </button>
            </form>
          </div>
        )}

        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <h2 className="text-lg font-bold mb-4">Xác nhận cập nhật</h2>
              <p className="mb-4">Bạn có chắc chắn muốn cập nhật thông tin sách này không?</p>
              <div className="flex justify-end space-x-4">
                <button onClick={handleCancelUpdate} className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded">Hủy bỏ</button>
                <button onClick={handleUpdateSubmit} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Cập nhật</button>
              </div>
            </div>
          </div>
        )}

        <ToastContainer />
      </main>
    </div>
  );
}
