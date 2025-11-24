/* eslint-disable no-unused-vars */
import { useState } from "react";
import api from "../api";

const CommentItem = ({ comment, postId, refreshComments }) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const [likes, setLikes] = useState(comment.likes_count);
  const [isLiked, setIsLiked] = useState(comment.is_liked_by_user);

  const [likers, setLikers] = useState([]);
  const [showLikers, setShowLikers] = useState(false);
  const [loadingLikers, setLoadingLikers] = useState(false);

  const fetchLikers = async () => {
    if (likers.length > 0 || likes === 0) return;

    setLoadingLikers(true);
    try {
      const res = await api.get(`/comments/${comment.id}/likes`);
      setLikers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLikers(false);
    }
  };

  const handleLike = async () => {
    try {
      const newLikedState = !isLiked;
      setLikes(newLikedState ? likes + 1 : likes - 1);
      setIsLiked(newLikedState);

      setLikers([]);

      await api.post(`/comments/${comment.id}/like`);
    } catch (err) {
      setLikes(isLiked ? likes + 1 : likes - 1);
      setIsLiked(!isLiked);
    }
  };

  const handleReply = async () => {
    if (!replyContent.trim()) return;
    try {
      await api.post("/comments/", {
        content: replyContent,
        post_id: postId,
        parent_id: comment.id,
      });
      setReplyContent("");
      setShowReplyBox(false);

      if (refreshComments) {
        refreshComments();
      }
    } catch (err) {
      console.error("Failed to reply", err);
    }
  };

  return (
    <div className="_comment_main mb-3">
      <div className="_comment_image">
        <img
          src="assets/images/txt_img.png"
          className="_comment_img1"
          alt="User"
        />
      </div>
      <div className="_comment_area">
        <div className="_comment_details">
          <h4 className="_comment_name_title">
            {comment.user.first_name} {comment.user.last_name}
          </h4>
          <p className="_comment_status_text">{comment.content}</p>
        </div>

        <div
          className="_comment_reply_num"
          style={{ position: "relative", bottom: "auto", marginTop: "5px" }}
        >
          <ul className="_comment_reply_list">
            <li
              style={{ position: "relative" }}
              onMouseEnter={() => {
                setShowLikers(true);
                fetchLikers();
              }}
              onMouseLeave={() => setShowLikers(false)}
            >
              <span
                onClick={handleLike}
                style={{
                  cursor: "pointer",
                  color: isLiked && "#1890FF",
                  fontWeight: "normal",
                  fontSize: "16px",
                }}
              >
                {isLiked ? "Liked" : "Like"}
              </span>

              {showLikers && likes > 0 && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "100%",
                    left: "0",
                    background: "white",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    width: "180px",
                    zIndex: 1000,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    marginBottom: "5px",
                  }}
                >
                  <h6
                    style={{
                      fontSize: "11px",
                      margin: 0,
                      borderBottom: "1px solid #eee",
                      paddingBottom: "5px",
                      fontWeight: "bold",
                      color: "#333",
                    }}
                  >
                    Liked by:
                  </h6>
                  <div style={{ maxHeight: "120px", overflowY: "auto" }}>
                    {loadingLikers && likers.length === 0 ? (
                      <div
                        style={{
                          fontSize: "10px",
                          color: "#999",
                          padding: "5px 0",
                        }}
                      >
                        Loading...
                      </div>
                    ) : (
                      likers.map((like, idx) => (
                        <div
                          key={idx}
                          style={{
                            fontSize: "11px",
                            marginTop: "4px",
                            color: "#333",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {like.user.first_name} {like.user.last_name}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </li>

            <li
              onClick={() => setShowReplyBox(!showReplyBox)}
              style={{ cursor: "pointer", fontWeight: "normal" }}
            >
              Reply
            </li>
          </ul>
        </div>

        {showReplyBox && (
          <div className="mt-2 d-flex align-items-center">
            <input
              className="form-control form-control-sm"
              placeholder="Write a reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              autoFocus
            />
            <button
              className="btn btn-sm btn-primary ms-2"
              onClick={handleReply}
              disabled={!replyContent.trim()}
            >
              Send
            </button>
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="ms-4 mt-3">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                postId={postId}
                refreshComments={refreshComments}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
