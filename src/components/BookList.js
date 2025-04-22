import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import { Link } from "react-router-dom";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedAuthor, setSelectedAuthor] = useState("Tất cả");
  const [sortPrice, setSortPrice] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios.get("https://backend-web-book.onrender.com/api/books")
      .then((res) => {
        setBooks(res.data);
        setFilteredBooks(res.data);

        const allCategories = ["Tất cả", ...new Set(res.data.map(book => book.category))];
        setCategories(allCategories);

        const allAuthors = ["Tất cả", ...new Set(res.data.map(book => book.author))];
        setAuthors(allAuthors);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    let filtered = [...books];

    if (selectedCategory !== "Tất cả") {
      filtered = filtered.filter(book => book.category === selectedCategory);
    }

    if (selectedAuthor !== "Tất cả") {
      filtered = filtered.filter(book => book.author === selectedAuthor);
    }

    if (searchTerm) {
      filtered = filtered.filter(book =>
        book.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortPrice === "asc") {
      filtered.sort((a, b) => calculateDiscountedPrice(a.price, a.discount) - calculateDiscountedPrice(b.price, b.discount));
    } else if (sortPrice === "desc") {
      filtered.sort((a, b) => calculateDiscountedPrice(b.price, b.discount) - calculateDiscountedPrice(a.price, a.discount));
    }

    setFilteredBooks(filtered);
  }, [selectedCategory, selectedAuthor, sortPrice, books, searchTerm]);

  const calculateDiscountedPrice = (price, discount) => {
    if (!price) return 0;
    const discountPercent = discount || 0;
    const finalPrice = price - (price * discountPercent / 100);
    return Math.round(finalPrice);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto p-4">
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-center">Danh sách sách</h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm theo tên sách"
              className="form-input px-3 py-2 rounded border border-gray-300 shadow-sm"
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="form-select px-3 py-2 rounded border border-gray-300 shadow-sm"
            >
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={selectedAuthor}
              onChange={(e) => setSelectedAuthor(e.target.value)}
              className="form-select px-3 py-2 rounded border border-gray-300 shadow-sm"
            >
              {authors.map((author, idx) => (
                <option key={idx} value={author}>{author}</option>
              ))}
            </select>

            <select
              value={sortPrice}
              onChange={(e) => setSortPrice(e.target.value)}
              className="form-select px-3 py-2 rounded border border-gray-300 shadow-sm"
            >
              <option value="">Sắp xếp theo giá</option>
              <option value="asc">Giá tăng dần</option>
              <option value="desc">Giá giảm dần</option>
            </select>

            <button
              className="btn btn-danger"
              onClick={() => {
                setSelectedCategory("Tất cả");
                setSelectedAuthor("Tất cả");
                setSortPrice("");
                setSearchTerm("");
              }}
            >
              Xóa lọc
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => {
            const finalPrice = calculateDiscountedPrice(book.price, book.discount);

            return (
              <div
                key={book._id}
                className="border rounded-xl p-4 shadow bg-white hover:shadow-xl hover:scale-105 transform transition duration-300"
              >
                <div className="relative">
                  {book.image ? (
                    <img
                      src={`https://backend-web-book.onrender.com${book.image}`}
                      alt={book.name}
                      className="w-full h-40 object-contain mb-2"
                    />
                  ) : (
                    <div className="w-full h-40 flex items-center justify-center bg-gray-100 text-sm text-gray-500 italic">
                      Không có ảnh
                    </div>
                  )}
                  {book.discount > 0 && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                      -{book.discount}%
                    </span>
                  )}
                </div>

                <Link to={`/books/${book.id}`} className="block mt-2 no-underline hover:no-underline">
                  <h3 className="text-base font-semibold text-gray-800 line-clamp-2 min-h-[3em]">
                    {book.name}
                  </h3>
                </Link>

                <div className="mt-2">
                  <p className="text-red-600 font-semibold text-base">{finalPrice.toLocaleString()} đ</p>
                  {book.discount > 0 && (
                    <p className="text-sm text-gray-500 line-through">{Number(book.price).toLocaleString()} đ</p>
                  )}
                </div>

                <p className="text-sm text-gray-600 mt-2">{book.author}</p>
                <p className="text-sm text-gray-600">{book.publisher}</p>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default BookList;
