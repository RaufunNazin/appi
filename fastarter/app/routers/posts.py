from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, desc
from typing import List, Optional
import shutil
import os
import uuid
from .. import database, models, schemas, auth

router = APIRouter(prefix="/posts", tags=["Posts"])

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)


@router.post("/", response_model=schemas.PostResponse)
async def create_post(
    content: Optional[str] = Form(None),
    visibility: models.Visibility = Form(models.Visibility.public),
    image: Optional[UploadFile] = File(None),
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db),
):
    image_path = None
    if image:
        file_extension = image.filename.split(".")[-1]
        filename = f"{uuid.uuid4()}.{file_extension}"
        file_location = f"{UPLOAD_DIR}/{filename}"
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        image_path = f"/static/{filename}"

    new_post = models.Post(
        user_id=current_user.id,
        content=content,
        image_url=image_path,
        visibility=visibility,
    )
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post


@router.get("/feed", response_model=List[schemas.PostResponse])
def get_feed(
    skip: int = 0,
    limit: int = 20,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db),
):
    posts_query = (
        db.query(models.Post)
        .filter(
            or_(
                models.Post.visibility == models.Visibility.public,
                models.Post.user_id == current_user.id,
            )
        )
        .order_by(desc(models.Post.created_at))
    )

    posts = posts_query.offset(skip).limit(limit).all()

    results = []
    for post in posts:
        post_likes_count = (
            db.query(models.Like)
            .filter(
                models.Like.target_id == post.id,
                models.Like.target_type == models.LikeType.post,
            )
            .count()
        )

        is_liked = (
            db.query(models.Like)
            .filter(
                models.Like.target_id == post.id,
                models.Like.target_type == models.LikeType.post,
                models.Like.user_id == current_user.id,
            )
            .first()
            is not None
        )

        comments_count = (
            db.query(models.Comment).filter(models.Comment.post_id == post.id).count()
        )

        post.likes_count = post_likes_count
        post.is_liked_by_user = is_liked
        post.comments_count = comments_count
        results.append(post)

    return results


@router.post("/{post_id}/like")
def like_post(
    post_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db),
):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    existing_like = (
        db.query(models.Like)
        .filter(
            models.Like.target_id == post_id,
            models.Like.target_type == models.LikeType.post,
            models.Like.user_id == current_user.id,
        )
        .first()
    )

    if existing_like:
        db.delete(existing_like)
        db.commit()
        return {"message": "Unliked"}
    else:
        new_like = models.Like(
            user_id=current_user.id, target_id=post_id, target_type=models.LikeType.post
        )
        db.add(new_like)
        db.commit()
        return {"message": "Liked"}
