import { Link } from "react-router-dom";

const LeftSidebar = () => {
  return (
    <div className="_layout_left_sidebar_wrap">
      <div className="_layout_left_sidebar_inner">
        <div className="_left_inner_area_explore _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
          <h4 className="_left_inner_area_explore_title _title5 _mar_b24">
            Explore
          </h4>
          <ul className="_left_inner_area_explore_list">
            <li className="_left_inner_area_explore_item _explore_item">
              <Link to="/feed" className="_left_inner_area_explore_link">
                Learning
              </Link>
              <span className="_left_inner_area_explore_link_txt">New</span>
            </li>
            <li className="_left_inner_area_explore_item">
              <Link to="/insights" className="_left_inner_area_explore_link">
                Insights
              </Link>
            </li>
            <li className="_left_inner_area_explore_item">
              <Link to="/groups" className="_left_inner_area_explore_link">
                Groups
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="_layout_left_sidebar_inner">
        <div className="_left_inner_area_suggest _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
          <div className="_left_inner_area_suggest_content _mar_b24">
            <h4 className="_left_inner_area_suggest_content_title _title5">
              Suggested People
            </h4>
            <span className="_left_inner_area_suggest_content_txt">
              <Link
                className="_left_inner_area_suggest_content_txt_link"
                to="/suggestions"
              >
                See All
              </Link>
            </span>
          </div>
          <div className="_left_inner_area_suggest_info">
            <div className="_left_inner_area_suggest_info_box">
              <div className="_left_inner_area_suggest_info_image">
                <img
                  src="assets/images/people1.png"
                  alt="Image"
                  className="_info_img"
                />
              </div>
              <div className="_left_inner_area_suggest_info_txt">
                <h4 className="_left_inner_area_suggest_info_title">
                  Steve Jobs
                </h4>
                <p className="_left_inner_area_suggest_info_para">
                  CEO of Apple
                </p>
              </div>
            </div>
            <div className="_left_inner_area_suggest_info_link">
              <button className="_info_link">Connect</button>
            </div>
          </div>
        </div>
      </div>

      <div className="_layout_left_sidebar_inner">
        <div className="_left_inner_area_event _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
          <div className="_left_inner_event_content">
            <h4 className="_left_inner_event_title _title5">Events</h4>
            <Link to="/events" className="_left_inner_event_link">
              See all
            </Link>
          </div>
          <Link className="_left_inner_event_card_link" to="/event-single">
            <div className="_left_inner_event_card">
              <div className="_left_inner_event_card_iamge">
                <img
                  src="assets/images/feed_event1.png"
                  alt="Image"
                  className="_card_img"
                />
              </div>
              <div className="_left_inner_event_card_content">
                <div className="_left_inner_card_date">
                  <p className="_left_inner_card_date_para">10</p>
                  <p className="_left_inner_card_date_para1">Jul</p>
                </div>
                <div className="_left_inner_card_txt">
                  <h4 className="_left_inner_event_card_title">
                    No more terrorism no more cry
                  </h4>
                </div>
              </div>
              <hr className="_underline" />
              <div className="_left_inner_event_bottom">
                <p className="_left_iner_event_bottom">17 People Going</p>
                <span className="_left_iner_event_bottom_link">Going</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
