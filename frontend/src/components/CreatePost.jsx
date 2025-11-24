import { useState } from "react";
import api from "../api";

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content && !image) return;

    setLoading(true);
    const formData = new FormData();
    if (content) formData.append("content", content);
    formData.append("visibility", visibility);
    if (image) formData.append("image", image);

    try {
      await api.post("/posts/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setContent("");
      setImage(null);
      if (onPostCreated) onPostCreated();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="_feed_inner_text_area _b_radious6 _padd_b24 _padd_t24 _padd_r24 _padd_l24 _mar_b16">
      <div className="_feed_inner_text_area_box">
        <div className="_feed_inner_text_area_box_image">
          <img
            src="assets/images/txt_img.png"
            alt="User"
            className="_txt_img"
          />
        </div>
        <div className="form-floating _feed_inner_text_area_box_form">
          <textarea
            className="form-control _textarea"
            placeholder="Write something..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>
      </div>

      {image && (
        <div className="p-3 position-relative">
          <img
            src={URL.createObjectURL(image)}
            alt="Preview"
            style={{ maxHeight: "200px", borderRadius: "8px" }}
          />
          <button
            onClick={() => setImage(null)}
            className="btn btn-danger btn-sm position-absolute top-0 start-0 m-2"
            style={{ borderRadius: "50%" }}
          >
            &times;
          </button>
        </div>
      )}

      <div className="_feed_inner_text_area_bottom">
        <div className="_feed_inner_text_area_item">
          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            onChange={(e) => setImage(e.target.files[0])}
          />
          <div
            className="_feed_inner_text_area_bottom_photo _feed_common"
            onClick={() => document.getElementById("fileInput").click()}
          >
            <button
              type="button"
              className="_feed_inner_text_area_bottom_photo_link"
            >
              <span className="_mar_img">📷</span> Photo
            </button>
          </div>

          <select
            className="form-select form-select-sm w-auto ms-3"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
        <div className="_feed_inner_text_area_btn">
          <button
            type="button"
            className="_feed_inner_text_area_btn_link"
            onClick={handleSubmit}
            disabled={loading}
          >
            <span>{loading ? "Posting..." : "Post"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
