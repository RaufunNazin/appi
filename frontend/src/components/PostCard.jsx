import { useState } from "react";

const PostCard = () => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
      <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
        <div className="_feed_inner_timeline_post_top">
          <div className="_feed_inner_timeline_post_box">
            <div className="_feed_inner_timeline_post_box_image">
              <img
                src="assets/images/post_img.png"
                alt=""
                className="_post_img"
              />
            </div>
            <div className="_feed_inner_timeline_post_box_txt">
              <h4 className="_feed_inner_timeline_post_box_title">
                Karim Saif
              </h4>
              <p className="_feed_inner_timeline_post_box_para">
                5 minute ago . <a href="#0">Public</a>
              </p>
            </div>
          </div>
          <div className="_feed_inner_timeline_post_box_dropdown">
            <div className="_feed_timeline_post_dropdown">
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="_feed_timeline_post_dropdown_link"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="4"
                  height="17"
                  fill="none"
                  viewBox="0 0 4 17"
                >
                  <circle cx="2" cy="2" r="2" fill="#C4C4C4" />
                  <circle cx="2" cy="8" r="2" fill="#C4C4C4" />
                  <circle cx="2" cy="15" r="2" fill="#C4C4C4" />
                </svg>
              </button>
            </div>
            <div
              className={`_feed_timeline_dropdown _timeline_dropdown ${
                showOptions ? "show" : ""
              }`}
            >
              <ul className="_feed_timeline_dropdown_list">
                <li className="_feed_timeline_dropdown_item">
                  <a href="#0" className="_feed_timeline_dropdown_link">
                    <span>Save Post</span>
                  </a>
                </li>
                <li className="_feed_timeline_dropdown_item">
                  <a href="#0" className="_feed_timeline_dropdown_link">
                    <span>Hide Post</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <h4 className="_feed_inner_timeline_post_title">
          -Healthy Tracking App
        </h4>
        <div className="_feed_inner_timeline_image">
          <img
            src="assets/images/timeline_img.png"
            alt=""
            className="_time_img"
          />
        </div>
      </div>
      <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26">
        <div className="_feed_inner_timeline_total_reacts_image">
          <img
            src="assets/images/react_img1.png"
            alt="Image"
            className="_react_img1"
          />
          <p className="_feed_inner_timeline_total_reacts_para">9+</p>
        </div>
        <div className="_feed_inner_timeline_total_reacts_txt">
          <p className="_feed_inner_timeline_total_reacts_para1">
            <span>12</span> Comment
          </p>
          <p className="_feed_inner_timeline_total_reacts_para2">
            <span>122</span> Share
          </p>
        </div>
      </div>
      <div className="_feed_inner_timeline_reaction">
        <button className="_feed_inner_timeline_reaction_emoji _feed_reaction">
          Like
        </button>
        <button className="_feed_inner_timeline_reaction_comment _feed_reaction">
          Comment
        </button>
        <button className="_feed_inner_timeline_reaction_share _feed_reaction">
          Share
        </button>
      </div>
    </div>
  );
};

export default PostCard;
