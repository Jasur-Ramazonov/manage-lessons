import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import Rodal from "rodal";
import "rodal/lib/rodal.css";
import { apiCall } from "./utils/apiCall";

interface Video {
  name: string;
  url: string;
}

interface Post {
  userId: string;
  lessonName: string;
  videos: Video[];
  id?: string;
}

const Home = (arg: {
  setIsHome: React.Dispatch<React.SetStateAction<boolean>>;
  setId: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const navigate = useNavigate();

  const { register, handleSubmit, reset } = useForm<{
    lessonName: string;
  }>();

  const [videos, setVideos] = useState<Video[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPostId, setCurrentPostId] = useState<string>("");
  const [currentPost, setCurrentPost] = useState<Post>({
    lessonName: "",
    videos: [],
    userId: "",
  });
  const [lessonNameValue, setLessonNameValue] = useState("");
  const [isOpen2, setIsOpen2] = useState(false);
  const { id } = useParams();

  // const [videoName, setVideoName] = useState("");   Hozircha kerak bo'lmayopti agar kerak bo'lmasa udalit qil

  useEffect(() => {
    if (localStorage.getItem("isUser")) {
      getPosts();
      arg.setIsHome(true);
      arg.setId(id!);
      return;
    }
    navigate("/login");
  }, []);

  async function addVideo(data: { lessonName: string }) {
    let post = {
      lessonName: data.lessonName,
      videos,
      userId: id,
    };
    try {
      if (!currentPostId) {
        await apiCall("POST", "/posts", post);
      } else {
        await apiCall("PUT", `/posts/${currentPostId}`, post);
        setCurrentPostId("");
      }
      console.log("ma'lumot qo'shildi");
      setVideos([]);
      setLessonNameValue("");
      reset();
      setIsOpen(false);
      getPosts();
    } catch (error) {
      console.error(error);
    }
  }

  function changeVideoNameInp(
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) {
    videos[index].name = e.target.value;
    setVideos([...videos]);
  }

  function changeVideoUrlInp(
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) {
    videos[index].url = e.target.value;
    setVideos([...videos]);
  }

  async function getPosts() {
    try {
      let res = await apiCall("GET", `/posts?userId=${id}`, "");
      setPosts(res.data);
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  }

  function showVideos(id: string) {
    let currentPost1 = posts.find((itm) => itm.id === id);
    setCurrentPost(currentPost1!);
    setIsOpen2(true);
  }

  async function deletePosts(id: string) {
    try {
      await apiCall("DELETE", `/posts/${id}`, "");
      getPosts();
    } catch (error) {
      console.error(error);
    }
  }

  function editPost(index: number) {
    setIsOpen(true);
    setLessonNameValue(posts[index].lessonName);
    setVideos(posts[index].videos);
    setCurrentPostId(posts[index].id!);
  }

  function changeLessonNameInp(e: React.ChangeEvent<HTMLInputElement>) {
    setLessonNameValue(e.target.value);
  }

  return (
    <div className="p-2 d-flex flex-column">
      <div className="d-flex justify-content-center">
        <button onClick={() => setIsOpen(true)} className="btn btn-primary">
          Add lesson
        </button>
      </div>
      <div className="p-5 d-flex gap-2">
        {posts.map((itm, i) => {
          return (
            <div
              onDoubleClick={() => editPost(i)}
              className="card p-2 gap-2"
              style={{
                width: "200px",
                height: "200px",
                cursor: "pointer",
              }}
            >
              <h5 className="text-center">{itm.lessonName}</h5>
              <p className="text-center">
                There are {itm.videos.length} lessons
              </p>
              <button
                onClick={() => showVideos(itm.id!)}
                className="btn btn-primary"
              >
                show lessons
              </button>
              <button
                onClick={() => deletePosts(itm.id!)}
                className="btn btn-danger"
              >
                delete
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <Rodal visible={isOpen} onClose={() => setIsOpen(false)}>
        <form
          onSubmit={handleSubmit(addVideo)}
          style={{ height: "200px" }}
          className="mt-4 d-flex flex-column gap-2 overflow-auto p-1"
        >
          <input
            {...register("lessonName")}
            onChange={changeLessonNameInp}
            className="form-control"
            type="text"
            placeholder="Name of lesson..."
            value={lessonNameValue}
          />
          {videos.map((itm, i) => {
            return (
              <div key={i} className="d-flex gap-2">
                <input
                  onChange={(e) => changeVideoNameInp(e, i)}
                  className="form-control"
                  type="text"
                  placeholder="video name"
                  value={itm.name}
                />
                <input
                  onChange={(e) => changeVideoUrlInp(e, i)}
                  className="form-control"
                  type="text"
                  placeholder="URL..."
                  value={itm.url}
                />
                <button
                  onClick={() => {
                    videos.splice(i, 1);
                    setVideos([...videos]);
                  }}
                  className="btn btn-danger"
                >
                  x
                </button>
              </div>
            );
          })}
          <button
            onClick={() => {
              setVideos([...videos, { name: "", url: "" }]);
            }}
            type="button"
            className="btn btn-warning mt-2"
          >
            add video
          </button>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </Rodal>
      <Rodal visible={isOpen2} onClose={() => setIsOpen2(false)}>
        <div className="overflow-auto" style={{ height: "200px" }}>
          <table className="table table-bordered mt-4">
            <thead>
              <tr>
                <th>Name</th>
                <th>URL</th>
              </tr>
            </thead>
            <tbody>
              {currentPost.videos.map((itm) => {
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

export default Home;
