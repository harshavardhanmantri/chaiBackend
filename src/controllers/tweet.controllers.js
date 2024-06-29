import mongoose, {isValidObjectId} from "mongoose";
import {Tweet} from "../models/tweet.models.js";
import {User} from "../models/user.models.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  const {content} = req.body;
  if (!content) {
    throw new ApiError(400, "Content fields is required");
  }

  const tweet = await Tweet.create({
    content,
    owner: req.user._id,
  });

  if (!tweet) {
    throw new ApiError(500, "Something went wrong!");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet Successfully Completed"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet

  const {tweetId} = req.params;
  const {content} = req.body;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(401, "Wrong tweet Id");
  }
  if (!tweetId) {
    throw new ApiError(401, "TweetId not found ");
  }
  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(401, "tweet id is wrong");
  }
  tweet.content = content;
  await tweet.save();

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Updated tweet successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  const {tweetId} = req.params;
  if (!isValidObjectId(tweetId)) {
    throw new ApiError(401, "Wrong tweet Id");
  }
  if (!tweetId) {
    throw new ApiError(401, "TweetId not found ");
  }
  await Tweet.findByIdAndDelete(tweetId);
  const tweet = await Tweet.findById(tweetId);
  if (tweet) {
    throw new ApiError("Something went wrong while deleting");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Deleted the tweet Successfully"));
});

export {createTweet, getUserTweets, updateTweet, deleteTweet};
