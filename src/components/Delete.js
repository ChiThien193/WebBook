import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";

export function DeletePage() {
  const [books, setBooks] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 5;

  const fetchBooks = async () => {
    try {
      const response = await axios.get("https://backend-web-book.onrender.com/api/books");
      setBooks(response.data);
    } catch (error) {
      console.error("Lỗi khi tải sách:", error);
    }
  };

  const deleteBook = async (id) => {
    try {
      const response = await axios.delete(`https://backend-web-book.onrender.com/api/books/delete/${id}`);
      if (response.status === 200) {
        setShowSuccessModal(true);
        fetchBooks();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      alert("Lỗi khi xoá sách: " + errorMessage);
    }
  };

  const handleDeleteClick = (book) => {
    setBookToDelete(book);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    if (bookToDelete) {
      deleteBook(bookToDelete._id);
    }
    setShowConfirmModal(false);
    setBookToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setBookToDelete(null);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    setCurrentPage(1); // reset trang khi tìm kiếm
  }, [searchTerm]);

  const filteredBooks = books.filter((book) =>
    book.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const currentBooks = filteredBooks.slice(startIndex, startIndex + booksPerPage);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto p-4">
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-center">Xoá sách</h2>

          {showSuccessModal && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-center">
              Đã xoá sách thành công!
            </div>
          )}

          <div className="mb-4">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên sách..."
              className="w-full p-2 border rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              {filteredBooks.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">Không tìm thấy sách nào phù hợp.</td>
                </tr>
              ) : (
                currentBooks.map((book) => (
                  <tr key={book._id}>
                    <td className="px-4 py-2 border">{book.name}</td>
                    <td className="px-4 py-2 border">
                      {book.image ? (
                        <img
                          src={`https://backend-web-book.onrender.com${book.image}`}
                          alt={book.name}
                          className="w-20 h-24 object-cover rounded border"
                        />
                      ) : (
                        "Không có ảnh"
                      )}
                    </td>
                    <td className="px-4 py-2 border">{book.price?.toLocaleString()}₫</td>
                    <td className="px-4 py-2 border">{book.discount}%</td>
                    <td className="px-4 py-2 border">{book.author}</td>
                    <td className="px-4 py-2 border">{book.publisher}</td>
                    <td className="px-4 py-2 border text-center">
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        onClick={() => handleDeleteClick(book)}
                      >
                        Xoá
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {filteredBooks.length > booksPerPage && (
            <div className="flex justify-center mt-4 space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
              >
                Trước
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === index + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
              >
                Tiếp
              </button>
            </div>
          )}
        </div>
      </main>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-lg font-semibold text-center">Xác nhận xóa</h3>
            <p className="mt-4 text-center">
              Bạn có chắc chắn muốn xóa sách "{bookToDelete?.name}"?
            </p>
            <div className="mt-6 flex justify-center space-x-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={handleConfirmDelete}
              >
                Xóa
              </button>
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded"
                onClick={handleCancelDelete}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
