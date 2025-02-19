import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiCall } from "./utils/apiCall";
import "rodal/lib/rodal.css";
import Rodal from "rodal";

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

interface Post {
  id: string;
  userId: string;
  lessonName: string;
  videos: { name: string; url: string }[];
}

const UserPanel = (arg: {
  setIsHome: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [currentUsers, setCurrentUsers] = useState<User[]>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [videos, setVideos] = useState<{ name: string; url: string }[]>([]);
  const [deletePosts, setDeletePosts] = useState<Post[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);

  const { id } = useParams();

  useEffect(() => {
    if (localStorage.getItem("isUser")) {
      getUsers();
      arg.setIsHome(true);
      return;
    }
    navigate("/login");
  }, []);

  useEffect(() => {
    if (users.length) {
      setCurrentUsers(users.filter((itm) => itm.id !== id));
    }
  }, [users]);

  useEffect(() => {
    if (allPosts.length) {
      setDeletePosts(allPosts.filter((itm) => itm.userId === id));
      deletePosts.map(async (post) => {
        await apiCall("DELETE", `/posts/${post.id}`, "");
      });
    }
  }, [allPosts]);

  async function getUsers() {
    try {
      let res = await apiCall("GET", "/users", "");
      setUsers(res.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function getPosts(index: number) {
    let id = currentUsers![index].id;
    try {
      let res = await apiCall("GET", `/posts?userId=${id}`, "");
      setPosts(res.data);
    } catch (error) {
      console.error(error);
    }
  }

  function showLessons(videos: { name: string; url: string }[]) {
    setVideos(videos);
    setIsOpen(true);
  }

  async function logOut() {
    let res = await apiCall("GET", "/posts", "");
    setAllPosts(res.data);
    await apiCall("DELETE", `/users/${id}`, "");
    localStorage.clear();
    navigate("/login");
    console.log("salom");
  }

  return (
    <div className="p-2 d-flex flex-column gap-2">
      <button
        onClick={logOut}
        className="btn btn-danger"
        style={{ width: "fit-content" }}
      >
        Log out
      </button>
      <div className="d-flex w-75">
        <div className="w-25">
          <table className="table border">
            <tbody>
              {currentUsers?.map((itm, i) => {
                return (
                  <tr
                    onClick={() => {
                      getPosts(i);
                    }}
                  >
                    <td
                      className="text-center"
                      style={{ fontSize: "20px", cursor: "pointer" }}
                    >
                      {itm.name}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="p-2 d-flex gap-2 flex-wrap">
          {posts.map((itm, i) => {
            return (
              <div
                key={i}
                className="bg-info p-2 d-flex flex-column gap-3"
                style={{
                  width: "200px",
                  height: "200px",
                  border: "solid 2px black",
                  borderRadius: "10px",
                  cursor: "pointer    ",
                }}
              >
                <h5 className="text-center">{itm.lessonName}</h5>
                <p
                  className="text-center"
                  style={{ fontSize: "18px", fontWeight: "medium" }}
                >
                  There are{" "}
                  <span className="text-danger">{itm.videos.length}</span>{" "}
                  videos
                </p>
                <div className="d-flex justify-content-center">
                  <button
                    onClick={() => showLessons(itm.videos)}
                    className="btn btn-primary"
                  >
                    See lessons
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Modal */}
      <Rodal visible={isOpen} onClose={() => setIsOpen(false)}>
        <div style={{ height: "200px", overflow: "auto" }}>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>URL</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((itm) => {
                return (
                  <tr>
                    <td>{itm.name}</td>
                    <td>
                      <a href={itm.url}>{itm.url}</a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Rodal>
    </div>
  );
};

export default UserPanel;
