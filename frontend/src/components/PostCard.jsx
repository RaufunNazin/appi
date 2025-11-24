import { useState } from "react";
import api from "../api";
import CommentSection from "./CommentSection";

const PostCard = ({ post }) => {
  const [likes, setLikes] = useState(post.likes_count);
  const [isLiked, setIsLiked] = useState(post.is_liked_by_user);
  const [likers, setLikers] = useState([]);
  const [showLikers, setShowLikers] = useState(false);

  const fetchLikers = async () => {
    if (likers.length > 0 || likes === 0) return;
    try {
      const res = await api.get(`/posts/${post.id}/likes`);
      setLikers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async () => {
    try {
      const newLikedState = !isLiked;
      setLikes(newLikedState ? likes + 1 : likes - 1);
      setIsLiked(newLikedState);
      setLikers([]);
      await api.post(`/posts/${post.id}/like`);
    } catch (err) {
      setLikes(isLiked ? likes + 1 : likes - 1);
      setIsLiked(!isLiked);
      console.error("Like failed", err);
    }
  };

  return (
    <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
      <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
        <div className="_feed_inner_timeline_post_top">
          <div className="_feed_inner_timeline_post_box">
            <div className="_feed_inner_timeline_post_box_image">
              <img
                src="assets/images/profile.png"
                alt=""
                className="_post_img"
              />
            </div>
            <div className="_feed_inner_timeline_post_box_txt">
              <h4 className="_feed_inner_timeline_post_box_title">
                {post.owner.first_name} {post.owner.last_name}
              </h4>
              <p className="_feed_inner_timeline_post_box_para">
                {new Date(post.created_at).toLocaleDateString()} .
                <span className="badge bg-light text-dark ms-2 border">
                  {post.visibility}
                </span>
              </p>
            </div>
          </div>
        </div>

        <h4 className="_feed_inner_timeline_post_title">{post.content}</h4>

        {post.image_url && (
          <div className="_feed_inner_timeline_image">
            <img
              src={`http://localhost:8000${post.image_url}`}
              alt="Post"
              className="_time_img"
            />
          </div>
        )}
      </div>

      <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26">
        <div className="_feed_inner_timeline_total_reacts_txt d-flex align-items-center">
          <div
            className="_feed_inner_timeline_total_reacts_para2"
            onMouseEnter={() => {
              setShowLikers(true);
              fetchLikers();
            }}
            onMouseLeave={() => setShowLikers(false)}
            style={{
              position: "relative",
              cursor: "pointer",
              marginRight: "15px",
            }}
          >
            <span style={{ fontWeight: "bold" }}>{likes}</span> Likes
            {showLikers && likes > 0 && (
              <div
                style={{
                  position: "absolute",
                  bottom: "120%",
                  left: 0,
                  background: "white",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  width: "200px",
                  zIndex: 100,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
              >
                <h6
                  style={{
                    fontSize: "12px",
                    margin: 0,
                    borderBottom: "1px solid #eee",
                    paddingBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Liked by:
                </h6>
                <div style={{ maxHeight: "150px", overflowY: "auto" }}>
                  {likers.length > 0 ? (
                    likers.map((like, idx) => (
                      <div
                        key={idx}
                        style={{
                          fontSize: "12px",
                          marginTop: "5px",
                          color: "#333",
                        }}
                      >
                        {like.user.first_name} {like.user.last_name}
                      </div>
                    ))
                  ) : (
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#999",
                        marginTop: "5px",
                      }}
                    >
                      Loading...
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <p className="_feed_inner_timeline_total_reacts_para1 m-0">
            <span style={{ fontWeight: "bold" }}>{post.comments_count}</span>{" "}
            Comments
          </p>
        </div>
      </div>

      <div className="_feed_inner_timeline_reaction">
        <button
          className={`_feed_inner_timeline_reaction_emoji _feed_reaction  _feed_inner_timeline_reaction_link ${
            isLiked ? "_feed_reaction_active" : ""
          }`}
          onClick={handleLike}
          style={isLiked ? { color: "#1890FF" } : {}}
        >
          {isLiked ? "Liked" : "Like"}
        </button>
        <button className="_feed_inner_timeline_reaction_emoji _feed_reaction _feed_inner_timeline_reaction_link">
          Comment
        </button>
      </div>

      <CommentSection postId={post.id} />
    </div>
  );
};

export default PostCard;
