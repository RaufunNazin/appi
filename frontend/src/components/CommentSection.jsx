/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import api from "../api";
import CommentItem from "./CommentItem";

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [visibleCount, setVisibleCount] = useState(3);

  const loadComments = async () => {
    try {
      const res = await api.get(`/comments/post/${postId}`);
      setComments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadComments();
  }, [postId]);

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    try {
      await api.post("/comments/", { content: newComment, post_id: postId });
      setNewComment("");
      loadComments();
    } catch (err) {
      console.error(err);
    }
  };

  const showMoreComments = () => {
    setVisibleCount((prev) => prev + 5);
  };

  return (
    <div className="_feed_inner_timeline_cooment_area">
      <div className="mt-3">
        {comments.slice(0, visibleCount).map((c) => (
          <CommentItem
            key={c.id}
            comment={c}
            postId={postId}
            refreshComments={loadComments}
          />
        ))}
      </div>

      {visibleCount < comments.length && (
        <button
          className="btn btn-link btn-sm text-decoration-none ps-0 mb-2"
          onClick={showMoreComments}
        >
          View more comments ({comments.length - visibleCount} remaining)
        </button>
      )}

      <div className="_feed_inner_comment_box mt-3">
        <div className="_feed_inner_comment_box_content d-flex align-items-center">
          <img
            src="assets/images/comment_img.png"
            alt=""
            className="_comment_img me-2"
          />
          <input
            className="form-control _comment_textarea border-0 bg-transparent"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            onClick={handlePostComment}
            className="btn btn-sm text-primary fw-bold"
            disabled={!newComment.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
