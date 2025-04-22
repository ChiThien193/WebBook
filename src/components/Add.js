import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const categoryCodes = {
  "TLTT": "Tâm lý - Trinh thám",
  "TLKH": "Khoa học",
  "TLLS": "Lịch sử",
};

const CreateBook = () => {
  const [book, setBook] = useState({
    id: "",
    name: "",
    category: "",
    price: "",
    discount: "",
    author: "",
    publisher: "",
    image: null,
  });

  useEffect(() => {
    if (book.category) {
      axios
        .get(`https://backend-web-book.onrender.com/api/books/generate-id/${book.category}`)
        .then(res => {
          setBook(prev => ({ ...prev, id: res.data.id }));
        })
        .catch(err => console.log(err));
    }
  }, [book.category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook({ ...book, [name]: value });
  };

  const handleFileChange = (e) => {
    setBook({ ...book, image: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    confirmAlert({
      title: 'Xác nhận',
      message: 'Bạn có chắc chắn muốn thêm sách này không?',
      buttons: [
        {
          label: 'Có',
          onClick: () => {
            const formData = new FormData();
            Object.entries(book).forEach(([key, value]) => {
              formData.append(key, value);
            });

            axios.post("https://backend-web-book.onrender.com/api/books", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
              .then(() => {
                toast.success("Thêm sách thành công!");
                setTimeout(() => window.location.reload(), 1000);
              })
              .catch(err => {
                console.error(err);
                toast.error("Có lỗi xảy ra khi thêm sách!");
              });
          }
        },
        {
          label: 'Không',
          onClick: () => toast.info("Đã hủy thao tác thêm sách.")
        }
      ]
    });
  };

  return (
    <>
      <Header />

      <div className="container py-5">
        <h2 className="text-center text-3xl font-bold mb-5">Thêm Sách Mới</h2>
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 border border-gray-300 rounded-lg shadow-lg bg-white">

          <div className="mb-4">
            <label htmlFor="id" className="block text-sm font-medium text-gray-700">ID (Tự động):</label>
            <input type="text" id="id" value={book.id} readOnly className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
          </div>

          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Phân loại:</label>
            <select
              id="category"
              name="category"
              value={book.category}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">--Chọn phân loại--</option>
              {Object.entries(categoryCodes).map(([code, label]) => (
                <option key={code} value={code}>{label}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tên sách:</label>
            <input
              id="name"
              name="name"
              value={book.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">Giá:</label>
              <input
                type="number"
                id="price"
                name="price"
                value={book.price}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="discount" className="block text-sm font-medium text-gray-700">Giảm giá (%):</label>
              <input
                type="number"
                id="discount"
                name="discount"
                value={book.discount}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="author" className="block text-sm font-medium text-gray-700">Tác giả:</label>
            <input
              id="author"
              name="author"
              value={book.author}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="publisher" className="block text-sm font-medium text-gray-700">Nhà xuất bản:</label>
            <input
              id="publisher"
              name="publisher"
              value={book.publisher}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">Ảnh bìa:</label>
            <input
              type="file"
              accept="image/*"
              id="image"
              onChange={handleFileChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="mb-4 text-center">
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            >
              Thêm sách
            </button>
          </div>
        </form>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      </div>
    </>
  );
};

export default CreateBook;
