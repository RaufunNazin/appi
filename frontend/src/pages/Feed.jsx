/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import api from "../api";
import Header from "../components/Header";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";
import StoryReel from "../components/StoryReel";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  const fetchPosts = async (isRefresh = false) => {
    if (loading && !isRefresh && posts.length > 0) return;

    const offset = isRefresh ? 0 : skip;

    try {
      const res = await api.get(`/posts/feed?skip=${offset}&limit=${limit}`);

      if (res.data.length < limit) setHasMore(false);

      if (isRefresh) {
        setPosts(res.data);
        setSkip(limit);
      } else {
        setPosts((prev) => [...prev, ...res.data]);
        setSkip((prev) => prev + limit);
      }
    } catch (err) {
      console.error("Failed to load feed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(true);
  }, []);

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
                    <CreatePost onPostCreated={() => fetchPosts(true)} />

                    {posts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}

                    {loading && <p className="text-center">Loading Feed...</p>}

                    {!loading && hasMore && (
                      <div className="text-center p-3">
                        <button
                          className="btn btn-light btn-sm"
                          onClick={() => fetchPosts(false)}
                        >
                          Load More
                        </button>
                      </div>
                    )}
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
