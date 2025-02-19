import { useEffect } from "react";
import { apiCall } from "./utils/apiCall";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
interface User {
  id: string;
  email: string;
  password: string;
  name: string;
}

const Login = (arg: {
  setId: React.Dispatch<React.SetStateAction<string>>;
}) => {
  let users: User[] = [];
  const navigate = useNavigate();

  useEffect(() => {
    apiCall("GET", "/users", "").then((res) => {
      users = res.data;
    });
  }, []);

  const { handleSubmit, reset, register } = useForm<User>();

  function checkUser(data: User) {
    for (let i = 0; i < users.length; ++i) {
      if (
        users[i].email === data.email &&
        users[i].password === data.password
      ) {
        localStorage.setItem("isUser", "true");
        navigate(`/${users[i].id}`);
        arg.setId(users[i].id);
        return;
      }
    }
    reset();
    navigate("/SignUp");
  }

  return (
    <div className="d-flex justify-content-center p-5">
      <div
        className="d-flex flex-column align-items-center p-3
        "
        style={{
          border: "solid 1px rgb(187, 185, 185)",
          width: "400px",
          height: "300px",
          borderRadius: "10px",
        }}
      >
        <h4 className="text-dark text-center">Log in</h4>
        <form
          onSubmit={handleSubmit(checkUser)}
          className="w-100 d-flex flex-column gap-2"
        >
          <input
            {...register("email")}
            className="form-control"
            type="text"
            placeholder="Enter your email..."
          />
          <input
            {...register("password")}
            className="form-control"
            type="password"
            placeholder="Enter your password..."
          />
          <button className="btn btn-primary mt-3">Log in</button>
        </form>
        <p className="text-center fw-semibold mt-3">
          If you don't have an account, sign up here.
        </p>
        <Link className="text-center" to="/SignUp">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Login;
