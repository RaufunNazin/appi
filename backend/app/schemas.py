from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from .models import Visibility, LikeType


class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    first_name: str
    last_name: str
    password: str


class UserResponse(UserBase):
    id: int
    first_name: str
    last_name: str

    class Config:
        from_attributes = True


class LikeCreate(BaseModel):
    target_id: int
    target_type: LikeType


class CommentBase(BaseModel):
    content: str


class CommentCreate(CommentBase):
    post_id: int
    parent_id: Optional[int] = None

class CommentResponse(CommentBase):
    id: int
    user: UserResponse
    created_at: datetime
    likes_count: int = 0
    is_liked_by_user: bool = False
    replies: List["CommentResponse"] = []

    class Config:
        from_attributes = True


class PostBase(BaseModel):
    content: Optional[str] = None
    visibility: Visibility = Visibility.public


class PostCreate(PostBase):
    pass


class PostResponse(PostBase):
    id: int
    image_url: Optional[str] = None
    created_at: datetime
    owner: UserResponse
    likes_count: int = 0
    comments_count: int = 0
    is_liked_by_user: bool = False
    comments: List[CommentResponse] = []

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
