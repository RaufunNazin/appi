/* eslint-disable no-unused-vars */
import { useState } from "react";
import api from "../api";

const CommentItem = ({ comment, postId }) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [likes, setLikes] = useState(comment.likes_count);
  const [isLiked, setIsLiked] = useState(comment.is_liked_by_user);

  const handleLike = async () => {
    try {
      await api.post(`/comments/${comment.id}/like`);
      setLikes(isLiked ? likes - 1 : likes + 1);
      setIsLiked(!isLiked);
    } catch (err) {
      console.error("Failed to like comment");
    }
  };

  const handleReply = async () => {
    try {
      await api.post("/comments/", {
        content: replyContent,
        post_id: postId,
        parent_id: comment.id,
      });
      setReplyContent("");
      setShowReplyBox(false);
    } catch (err) {
      console.error("Failed to reply");
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

        <div className="_comment_reply_num">
          <ul className="_comment_reply_list">
            <li
              onClick={handleLike}
              style={{ cursor: "pointer", color: isLiked ? "#1890FF" : "" }}
            >
              {isLiked ? "Unlike" : "Like"} ({likes})
            </li>
            <li
              onClick={() => setShowReplyBox(!showReplyBox)}
              style={{ cursor: "pointer" }}
            >
              Reply
            </li>
          </ul>
        </div>

        {showReplyBox && (
          <div className="mt-2 d-flex">
            <input
              className="form-control form-control-sm"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />
            <button
              className="btn btn-sm btn-primary ms-2"
              onClick={handleReply}
            >
              Send
            </button>
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="ms-4 mt-3">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} postId={postId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [loaded, setLoaded] = useState(false);

  const loadComments = async () => {
    if (loaded) return;
    setLoading(true);
    try {
      const res = await api.get(`/comments/post/${postId}`);
      setComments(res.data);
      setLoaded(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostComment = async () => {
    try {
      await api.post("/comments/", { content: newComment, post_id: postId });
      setNewComment("");
      setLoaded(false);
      loadComments();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="_feed_inner_timeline_cooment_area">
      {!loaded && (
        <button className="btn btn-link btn-sm" onClick={loadComments}>
          {loading ? "Loading..." : "View Comments"}
        </button>
      )}

      {loaded &&
        comments.map((c) => (
          <CommentItem key={c.id} comment={c} postId={postId} />
        ))}

      <div className="_feed_inner_comment_box mt-3">
        <div className="_feed_inner_comment_box_content">
          <input
            className="form-control _comment_textarea"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            onClick={handlePostComment}
            className="btn btn-sm text-primary"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
