import { useState } from "react";
import Header from "../components/Header";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";
import StoryReel from "../components/StoryReel";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";

const Feed = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div
      className={`_layout _layout_main_wrapper ${
        darkMode ? "_dark_wrapper" : ""
      }`}
    >
      <div className="_layout_mode_swithing_btn">
        <button
          type="button"
          className="_layout_swithing_btn_link"
          onClick={() => setDarkMode(!darkMode)}
        >
          <div className={`_layout_swithing_btn ${darkMode ? "active" : ""}`}>
            <div className="_layout_swithing_btn_round"></div>
          </div>
        </button>
      </div>

      <div className="_main_layout">
        <Header />

        <div className="container _custom_container">
          <div className="_layout_inner_wrap">
            <div className="row">
              <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                <LeftSidebar />
              </div>
              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                <div className="_layout_middle_wrap">
                  <div className="_layout_middle_inner">
                    <StoryReel />
                    <CreatePost />
                    <PostCard />
                    <PostCard />
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                <RightSidebar />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
