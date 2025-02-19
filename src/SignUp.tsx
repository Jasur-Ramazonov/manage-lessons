import { useForm } from "react-hook-form";
import { apiCall } from "./utils/apiCall";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

interface User {
  name: string;
  email: string;
  password: string;
}

const SignUp = () => {
  const { register, handleSubmit, reset } = useForm<User>();

  const notify = () => {
    toast.warning("Iltimos ro'yxatdan o'ting!");
  };

  const [displayEmail, setDisplayEmail] = useState("none");
  const [displayPassword, setDisplayPassword] = useState("none");
  const [isEmail, setIsEmail] = useState(false);
  const [isPassword, setIsPassword] = useState(false);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const navigate = useNavigate();

  let users: User[] = [];
  useEffect(() => {
    getUser();
    notify();
  }, []);

  async function getUser() {
    try {
      let res = await apiCall("GET", "/users", "");
      users = [...res.data];
    } catch (error) {
      console.error(error);
    }
  }

  async function saveUser(data: User) {
    if (isEmail && isPassword) {
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
  }

  function checkValidationEmail(e: React.ChangeEvent<HTMLInputElement>) {
    if (!emailRegex.test(e.target.value)) {
      setDisplayEmail("inline");
    } else {
      setDisplayEmail("none");
    }
    setIsEmail(emailRegex.test(e.target.value));
  }

  function checkValidationPassword(e: React.ChangeEvent<HTMLInputElement>) {
    if (!passwordRegex.test(e.target.value)) {
      setDisplayPassword("inline");
    } else {
      setDisplayPassword("none");
    }
    setIsPassword(passwordRegex.test(e.target.value));
  }

  return (
    <div className="d-flex justify-content-center p-5">
      <div
        className="d-flex flex-column  p-3
    "
        style={{
          border: "solid 1px rgb(187, 185, 185)",
          width: "400px",
          height: "350px",
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
          <div>
            <input
              {...register("email")}
              className="form-control"
              type="text"
              placeholder="Email..."
              onChange={checkValidationEmail}
            />
            <p className="text-danger p-1" style={{ display: displayEmail }}>
              Iltimos Emailni to'g'ri kiriting!!!
            </p>
          </div>
          <div>
            <input
              {...register("password")}
              className="form-control"
              type="password"
              placeholder="Password..."
              onChange={checkValidationPassword}
            />
            <p className="text-danger p-1" style={{ display: displayPassword }}>
              8 ta belgi bo'lishi kerak 1 ta katta harf 1 ta kichik harf 1 ta
              raqam 1 ta belgi kamida bo'lishi kerak.
            </p>
          </div>
          <button className="btn btn-primary">Log in</button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignUp;
