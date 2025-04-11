import React, { useState, useEffect } from "react";

function Add() {
  const [bookName, setBookName] = useState("");
  const [bookCategory, setBookCategory] = useState("");
  const [bookImage, setBookImage] = useState(null);
  const [bookList, setBookList] = useState([]);

  useEffect(() => {
    fetchBookList();
  }, []);

  const fetchBookList = () => {
    fetch("http://localhost:5000/api/add")
      .then((res) => res.json())
      .then((data) => setBookList(data.items))
      .catch((err) => console.error("Fetch error:", err));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", bookName);
    formData.append("category", bookCategory);
    if (bookImage) formData.append("image", bookImage);

    const res = await fetch("http://localhost:5000/api/add", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    alert(data.message);

    setBookName("");
    setBookCategory("");
    setBookImage(null);
    fetchBookList();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Thêm sách mới</h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 max-w-md bg-white p-6 rounded-lg shadow"
      >
        <input
          value={bookName}
          onChange={(e) => setBookName(e.target.value)}
          placeholder="Tên sách"
          required
          className="border rounded px-3 py-2"
        />
        <input
          value={bookCategory}
          onChange={(e) => setBookCategory(e.target.value)}
          placeholder="Thể loại"
          required
          className="border rounded px-3 py-2"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setBookImage(e.target.files[0])}
          className="border rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Thêm sách
        </button>
      </form>

      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">Danh sách sách hiện có:</h3>
        {bookList.length === 0 ? (
          <p className="text-gray-500">Chưa có sách nào.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {bookList.map((book, index) => (
              <div
                key={index}
                className="bg-white border rounded-lg shadow-sm p-2 text-center"
              >
                {book.image ? (
                  <img
                    src={`http://localhost:5000/uploads/${book.image}`}
                    alt={book.name}
                    className="w-24 h-32 object-cover mx-auto rounded"
                  />
                ) : (
                  <div className="w-24 h-32 bg-gray-200 rounded flex items-center justify-center text-sm text-gray-500 mx-auto">
                    Không có ảnh
                  </div>
                )}
                <div className="mt-2">
                <p className="text-sm font-medium truncate">{book.name}</p>
                  <p className="text-xs text-gray-500">{book.category}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Add;
