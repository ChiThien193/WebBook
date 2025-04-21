import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./components/HomePage";
import BookList from "./components/BookList";
import Add from "./components/Add";
import { UpdatePage } from "./components/Update"; 
import { DeletePage } from "./components/Delete";
import { LoginForm } from "./components/LoginForm";
import BookDetail from "./components/BookDetail";


function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/BookList" element={<BookList />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="/add" element={<Add />} />
          <Route path="/update" element={<UpdatePage />} /> 
          <Route path="/delete" element={<DeletePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
