from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from .database import Base


class Visibility(str, enum.Enum):
    public = "public"
    private = "private"


class LikeType(str, enum.Enum):
    post = "post"
    comment = "comment"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50))
    last_name = Column(String(50))
    email = Column(String(100), unique=True, index=True)
    password_hash = Column(String(255))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    posts = relationship("Post", back_populates="owner")
    comments = relationship("Comment", back_populates="user")
    likes = relationship("Like", back_populates="user")


class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    content = Column(Text, nullable=True)
    image_url = Column(String(255), nullable=True)
    visibility = Column(Enum(Visibility), default=Visibility.public)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    owner = relationship("User", back_populates="posts")
    comments = relationship(
        "Comment", back_populates="post", cascade="all, delete-orphan"
    )
    likes = relationship(
        "Like",
        primaryjoin="and_(foreign(Like.target_id)==Post.id, Like.target_type=='post')",
        overlaps="likes",
        cascade="all, delete-orphan",
    )


class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    post_id = Column(Integer, ForeignKey("posts.id"))
    parent_id = Column(Integer, ForeignKey("comments.id"), nullable=True)
    content = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="comments")
    post = relationship("Post", back_populates="comments")
    replies = relationship("Comment", back_populates="parent", remote_side=[id])
    parent = relationship("Comment", back_populates="replies", remote_side=[parent_id])
    likes = relationship(
        "Like",
        primaryjoin="and_(foreign(Like.target_id)==Comment.id, Like.target_type=='comment')",
        overlaps="likes",
        cascade="all, delete-orphan",
    )


class Like(Base):
    __tablename__ = "likes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    target_id = Column(Integer, nullable=False)
    target_type = Column(Enum(LikeType))

    user = relationship("User", back_populates="likes")
