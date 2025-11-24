import { useState } from "react";
import api from "../api";
import CommentSection from "./CommentSection";

const PostCard = ({ post }) => {
  const [likes, setLikes] = useState(post.likes_count);
  const [isLiked, setIsLiked] = useState(post.is_liked_by_user);
  const [likers, setLikers] = useState([]);
  const [showLikers, setShowLikers] = useState(false);

  const fetchLikers = async () => {
    if (likers.length > 0) return;
    try {
      const res = await api.get(`/posts/${post.id}/likes`);
      setLikers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async () => {
    try {
      await api.post(`/posts/${post.id}/like`);
      setLikes(isLiked ? likes - 1 : likes + 1);
      setIsLiked(!isLiked);
    } catch (err) {
      console.error(err);
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
        <div className="_feed_inner_timeline_total_reacts_txt">
          <div
            className="_feed_inner_timeline_total_reacts_para2"
            onMouseEnter={() => {
              setShowLikers(true);
              fetchLikers();
            }}
            onMouseLeave={() => setShowLikers(false)}
            style={{ position: "relative", cursor: "pointer" }}
          >
            <span>{likes}</span> Likes
            {showLikers && likers.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  bottom: "100%",
                  left: 0,
                  background: "white",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  width: "200px",
                  zIndex: 10,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                }}
              >
                <h6
                  style={{
                    fontSize: "12px",
                    margin: 0,
                    borderBottom: "1px solid #eee",
                    paddingBottom: "5px",
                  }}
                >
                  Liked by:
                </h6>
                {likers.map((like, idx) => (
                  <div key={idx} style={{ fontSize: "11px", marginTop: "3px" }}>
                    {like.user.first_name} {like.user.last_name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <p className="_feed_inner_timeline_total_reacts_para1 ms-3">
            <span>{post.comments_count}</span> Comments
          </p>
        </div>
      </div>

      <div className="_feed_inner_timeline_reaction">
        <button
          className={`_feed_inner_timeline_reaction_emoji _feed_reaction ${
            isLiked ? "_feed_reaction_active" : ""
          }`}
          onClick={handleLike}
        >
          {isLiked ? "Unlike" : "Like"}
        </button>
        <button className="_feed_inner_timeline_reaction_comment _feed_reaction">
          Comment
        </button>
      </div>

      <CommentSection postId={post.id} />
    </div>
  );
};

export default PostCard;
