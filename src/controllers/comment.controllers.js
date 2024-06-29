import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {Video} from "../models/video.models.js";
import {Comment} from "../models/comment.models.js";
import mongoose from "mongoose";
import {Types, isValidObjectId} from "mongoose";

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const {content} = req.body;
  const {videoId} = req.params;
  if (!content) {
    throw new ApiError(400, "Content fieds is required");
  }
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid videoId!");
  }
  if (!videoId) {
    throw new ApiError(400, "Video Id Required");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "Video id is wrong");
  }
  const comment = await Comment.create({
    content: content,
    owner: req.user?._id,
    video: videoId,
  });

  if (!comment) {
    throw new ApiError(500, "Something went wrong while commenting");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Created Comment Successfully"));
});
const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const {commentId} = req.params;
  const {content} = req.body;
  if (!content) {
    throw new ApiError(400, "Content field is required");
  }
  if (!isValidObjectId(commentId)) {
    console.log(commentId);
    throw new ApiError(400, "Invalid comment Id!");
  }
  if (!commentId) {
    throw new ApiError(400, "comment Id  Required");
  }
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(400, "comment id is wrong");
  }
  comment.content = content;
  await comment.save();
  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Updated the comment"));
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const {commentId} = req.params;
  if (!isValidObjectId(commentId)) {
    console.log(commentId);
    throw new ApiError(400, "Invalid comment Id!");
  }
  if (!commentId) {
    throw new ApiError(400, "comment Id  Required");
  }
  await Comment.findByIdAndDelete(commentId);
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Deleted the Comment Successfully"));
});

export {addComment, updateComment, deleteComment};
