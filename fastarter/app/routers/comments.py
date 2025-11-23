from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import database, models, schemas, auth

router = APIRouter(prefix="/comments", tags=["Comments"])


@router.post("/", response_model=schemas.CommentResponse)
def create_comment(
    comment: schemas.CommentCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db),
):
    post = db.query(models.Post).filter(models.Post.id == comment.post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    if comment.parent_id:
        parent = (
            db.query(models.Comment)
            .filter(models.Comment.id == comment.parent_id)
            .first()
        )
        if not parent:
            raise HTTPException(status_code=404, detail="Parent comment not found")

    new_comment = models.Comment(
        user_id=current_user.id,
        post_id=comment.post_id,
        parent_id=comment.parent_id,
        content=comment.content,
    )
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    return new_comment


@router.get("/post/{post_id}", response_model=List[schemas.CommentResponse])
def get_comments_for_post(
    post_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db),
):
    comments = (
        db.query(models.Comment)
        .filter(models.Comment.post_id == post_id, models.Comment.parent_id == None)
        .order_by(models.Comment.created_at.asc())
        .all()
    )

    def enrich_comment(cmt):
        likes_count = (
            db.query(models.Like)
            .filter(
                models.Like.target_id == cmt.id,
                models.Like.target_type == models.LikeType.comment,
            )
            .count()
        )
        is_liked = (
            db.query(models.Like)
            .filter(
                models.Like.target_id == cmt.id,
                models.Like.target_type == models.LikeType.comment,
                models.Like.user_id == current_user.id,
            )
            .first()
            is not None
        )

        cmt.likes_count = likes_count
        cmt.is_liked_by_user = is_liked

        if cmt.replies:
            for reply in cmt.replies:
                enrich_comment(reply)
        return cmt

    return [enrich_comment(c) for c in comments]


@router.post("/{comment_id}/like")
def like_comment(
    comment_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db),
):
    comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    existing_like = (
        db.query(models.Like)
        .filter(
            models.Like.target_id == comment_id,
            models.Like.target_type == models.LikeType.comment,
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
            user_id=current_user.id,
            target_id=comment_id,
            target_type=models.LikeType.comment,
        )
        db.add(new_like)
        db.commit()
        return {"message": "Liked"}
