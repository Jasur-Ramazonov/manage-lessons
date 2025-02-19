import { useForm } from "react-hook-form";
import { apiCall } from "./utils/apiCall";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  name: string;
  email: string;
  password: string;
}

const SignUp = () => {
  const { register, handleSubmit, reset } = useForm<User>();
  let users: User[] = [];
  useEffect(() => {
    getUser();
  }, []);

  const navigate = useNavigate();

  async function getUser() {
    try {
      let res = await apiCall("GET", "/users", "");
      users = [...res.data];
    } catch (error) {
      console.error(error);
    }
  }

  async function saveUser(data: User) {
    for (let i = 0; i < users.length; ++i) {
      if (users[i].email === data.email) {
        alert(
          "Bu email ro'yxatdan o'tgan balki siz oldin siz ro'yxatdan o'tgandiz siz."
        );
        return;
      }
    }

    try {
      await apiCall("POST", "/users", data);
    } catch (error) {
      console.error(error);
    }
    reset();
    navigate("/login");
  }
  return (
    <div className="d-flex justify-content-center p-5">
      <div
        className="d-flex flex-column  p-3
    "
        style={{
          border: "solid 1px rgb(187, 185, 185)",
          width: "400px",
          height: "300px",
          borderRadius: "10px",
        }}
      >
        <h4 className="text-dark text-center mb-4">Register</h4>
        <form
          onSubmit={handleSubmit(saveUser)}
          className="w-100 d-flex flex-column gap-2"
        >
          <input
            {...register("name")}
            className="form-control"
            type="text"
            placeholder="Name..."
          />
          <input
            {...register("email")}
            className="form-control"
            type="text"
            placeholder="Email..."
          />
          <input
            {...register("password")}
            className="form-control"
            type="password"
            placeholder="Password..."
          />
          <button className="btn btn-primary">Log in</button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
