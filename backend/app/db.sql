CREATE DATABASE IF NOT EXISTS social_feed_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE social_feed_db;


CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE INDEX idx_users_email (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    content TEXT NULL,
    image_url VARCHAR(255) NULL,
    visibility ENUM('public', 'private') DEFAULT 'public',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_posts_user 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

    INDEX idx_posts_user (user_id),
    
    INDEX idx_posts_feed (visibility, created_at DESC) 
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    parent_id INT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_comments_user 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_comments_post 
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    CONSTRAINT fk_comments_parent 
        FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE,

    INDEX idx_comments_post (post_id),
    INDEX idx_comments_parent (parent_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    target_id INT NOT NULL,
    target_type ENUM('post', 'comment') NOT NULL,
    
    CONSTRAINT fk_likes_user 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

    UNIQUE INDEX idx_unique_like (user_id, target_id, target_type),
    
    INDEX idx_likes_target (target_id, target_type) 
) ENGINE=InnoDB;