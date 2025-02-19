import SignUp from "./SignUp";
import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes, useNavigate, Link } from "react-router-dom";
import PageNotFound from "./PageNotFound";
import Home from "./Home";
import Login from "./Login";
import { useState } from "react";
import UserPanel from "./UserPanel";
import EmptyPath from "./EmptyPath";

function App() {
  const [isHome, setIsHome] = useState(false);
  const [id, setId] = useState("");

  const navigate = useNavigate();

  function checkUser() {
    if (localStorage.getItem("isUser")) {
      navigate(`/UserPanel/${id}`);
    }
  }

  return (
    <>
      {/* header */}
      <div className="bg-dark d-flex justify-content-between align-items-center p-3">
        <a
          className="display-6 text-white text-decoration-none fw-bold"
          style={{ cursor: "pointer" }}
        >
          LOGO
        </a>
        <div className="d-flex gap-2">
          {!isHome && (
            <Link to="/login" className="btn btn-primary">
              Log in
            </Link>
          )}

          <button onClick={checkUser} className="btn btn-warning">
            User panel
          </button>
        </div>
      </div>
      <Routes>
        <Route
          path="/:id"
          element={<Home setIsHome={setIsHome} setId={setId} />}
        />
        <Route
          path="/UserPanel/:id"
          element={<UserPanel setIsHome={setIsHome} />}
        />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/login" element={<Login setId={setId} />} />
        <Route path="*" element={<PageNotFound />} />
        <Route path="/" element={<EmptyPath />} />
      </Routes>
    </>
  );
}

export default App;
