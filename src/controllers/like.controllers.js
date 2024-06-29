import mongoose, {isValidObjectId} from "mongoose";
import {Like} from "../models/like.models.js";
import {Video} from "../models/video.models.js";
import {Comment} from "../models/comment.models.js";
import {Tweet} from "../models/tweet.models.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const {videoId} = req.params;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid videoId!");
  }
  if (!videoId) {
    throw new ApiError(401, "Video Id not found");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found!");
  }
  const videoLike = await Like.findOne({video: videoId});

  let unlike;
  let like;
  if (videoLike) {
    unlike = await Like.deleteOne({video: videoId});
  } else {
    like = await Like.create({
      video: videoId,
      owner: req.user._id,
    });
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        `Video ${unlike ? "unlike" : "like"} successfully`
      )
    );
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const {commentId} = req.params;
  //TODO: toggle like on comment
  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid commentId!");
  }
  if (!commentId) {
    throw new ApiError(401, "comment Id not found");
  }
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found!");
  }
  const commentedLike = await Like.findOne({comment: commentId});

  let unlike;
  let like;
  if (commentedLike) {
    unlike = await Like.deleteOne({comment: commentId});
  } else {
    like = await Like.create({
      comment: commentId,
      owner: req.user._id,
    });
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        `Comment ${unlike ? "unlike" : "like"} successfully`
      )
    );
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const {tweetId} = req.params;
  //TODO: toggle like on comment
  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweetId!");
  }
  if (!tweetId) {
    throw new ApiError(401, "tweet Id not found");
  }
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "tweet not found!");
  }
  const tweetLike = await Like.findOne({tweet: tweetId});

  let unlike;
  let like;
  if (tweetLike) {
    unlike = await Like.deleteOne({tweet: tweetId});
  } else {
    like = await Like.create({
      tweet: tweetId,
      owner: req.user._id,
    });
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        `Tweet ${unlike ? "unlike" : "like"} successfully`
      )
    );
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
});

export {toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos};
