import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import Header from "./Header";

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);

  useEffect(() => {
    axios
      .get(`https://backend-web-book.onrender.com/api/books/${id}`)
      .then((res) => {
        setBook(res.data);

        axios
          .get(`https://backend-web-book.onrender.com/api/books/related/${res.data.category}`)
          .then((relatedRes) => {
            const filteredBooks = relatedRes.data.filter((b) => b._id !== res.data._id);
            setRelatedBooks(filteredBooks);
          })
          .catch((err) => console.log("Không thể tải sách liên quan:", err));
      })
      .catch((err) => console.log("Không tìm thấy sách:", err));
  }, [id]);

  const calculateDiscountedPrice = (price, discount) => {
    if (!price) return 0;
    const finalPrice = price - (price * (discount || 0) / 100);
    return Math.round(finalPrice);
  };

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Header />
        <div className="flex justify-center items-center h-full">Đang tải dữ liệu sách...</div>
      </div>
    );
  }

  const finalPrice = calculateDiscountedPrice(book.price, book.discount);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
        <h1 className="text-2xl font-semibold mb-4">{book.name}</h1>
        <div className="flex gap-6">
          <div className="w-1/3">
            {book.image ? (
              <img
                src={`https://backend-web-book.onrender.com${book.image}`}
                alt={book.name}
                className="w-full h-auto object-contain"
              />
            ) : (
              <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500">
                Không có ảnh
              </div>
            )}
          </div>

          <div className="w-2/3 space-y-2">
            <p><strong>Tác giả:</strong> {book.author}</p>
            <p><strong>Thể loại:</strong> {book.category}</p>
            <p><strong>Nhà xuất bản:</strong> {book.publisher}</p>
            <p>
              <strong>Giá:</strong>{" "}
              <span className="text-red-600 font-bold">{finalPrice.toLocaleString()} đ</span>
            </p>
            {book.discount > 0 && (
              <p className="text-gray-500 line-through">{Number(book.price).toLocaleString()} đ</p>
            )}
          </div>
        </div>

        {book.description && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Mô tả</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{book.description}</p>
          </div>
        )}

        <div className="mt-6">
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Quay về
          </button>
        </div>
      </main>

      {relatedBooks.length > 0 && (
        <section className="max-w-4xl mx-auto p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Sách cùng thể loại</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {relatedBooks.map((relatedBook) => (
              <Link
                key={relatedBook._id}
                to={`/books/${relatedBook.id}`}
                className="bg-white shadow-md p-4 rounded-lg hover:shadow-lg transition"
              >
                <div className="h-40 flex items-center justify-center overflow-hidden mb-2">
                  {relatedBook.image ? (
                    <img
                      src={`https://backend-web-book.onrender.com${relatedBook.image}`}
                      alt={relatedBook.name}
                      className="object-contain h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                      Không có ảnh
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-sm mb-1 truncate">{relatedBook.name}</h3>
                <p className="text-red-500 font-bold text-sm">
                  {calculateDiscountedPrice(relatedBook.price, relatedBook.discount).toLocaleString()} đ
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default BookDetail;
