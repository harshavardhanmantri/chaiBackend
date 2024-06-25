import {Video} from "../models/video.models.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";

import {asyncHandler} from "../utils/asyncHandler.js";
import {uploadOnCloudinary, deleteOnCloudinary} from "../utils/cloudinary.js";
import {Types, isValidObjectId} from "mongoose";

const publishAVideo = asyncHandler(async (req, res) => {
  console.log("hi");

  const {title, description} = req.body;
  if ([title].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Title fieds is required");
  }
  const videoFilePath = req.files?.videoFile[0]?.path;
  const thumbnailFilePath = req.files?.thumbnail[0].path;

  if (!videoFilePath) {
    throw new ApiError(400, "Video is required");
  }
  if (!thumbnailFilePath) {
    throw new ApiError(400, "Video is required");
  }
  const videoFile = await uploadOnCloudinary(videoFilePath);
  const thumbnail = await uploadOnCloudinary(thumbnailFilePath);

  if (!videoFile) {
    throw new ApiError(401, "Video didn't Upload");
  }
  if (!thumbnail) {
    throw new ApiError(401, "thumbnail didn't Upload");
  }
  const video = await Video.create({
    title,
    videoFile: videoFile?.url,
    thumbnail: thumbnail?.url,
    description: description,
    duration: videoFile?.duration,
    owner: req.user._id,
  });

  if (!video) {
    throw new ApiError(500, "Something went wrong while creating video");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, video, "Video Published Successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const {videoId} = req.params;
  //TODO: get video by id
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid videoId!");
  }

  const video = await Video.aggregate([
    {
      $match: {_id: new Types.ObjectId(videoId)},
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              username: 1,
              email: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        owner: {$first: "$owner"},
      },
    },
  ]);
  if (!video) {
    throw new ApiError(401, "Invalid video Id");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {video}, "Found the Video !!"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const {videoId} = req.params;
  //TODO: delete video

  if (!videoId) {
    throw new ApiError(401, "Wrong video id");
  }
  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // if (video?.videoFile) {
  //   console.log(video?.videoFile);
  //   await deleteOnCloudinary(video?.videoFile, "video");
  // }
  // if (video.thumbnail) {
  //   await deleteOnCloudinary(video?.thumbnail);
  // }
  await Video.findByIdAndDelete(videoId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted Successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const {videoId} = req.params;
  //TODO: update video details like title, description, thumbnail
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid videoId!");
  }
  const {title, description} = req.body;

  if (![title, description].every(Boolean)) {
    throw new ApiError(400, "All fields are required");
  }
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid videoId!");
  }

  // if (!thumbnailFilePath) {
  //   throw new ApiError(401, "thumbnail file missing");
  // }

  // const thumbnail = await uploadOnCloudinary(thumbnailFilePath);

  // if (!thumbnail) {
  //   throw new ApiError(
  //     400,
  //     "Error from thumbnail while uploading on cloudinary"
  //   );
  // }
  const oldVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title,
        description,
      },
    },
    {
      new: true,
    }
  );

  const thumbnailFilePath = req.file?.path;
  // const thumbnailFilePath = req.files?.thumbnail?.path;

  if (!thumbnailFilePath) {
    throw new ApiError(401, "video file missing");
  }
  const thumbnail = await uploadOnCloudinary(thumbnailFilePath);
  if (!thumbnail) {
    throw new ApiError(400, "Error from Video while uploading on cloudinary");
  }
  const updatingVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        thumbnail: thumbnail.url,
      },
    },
    {
      new: true,
    }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, updatingVideo, "Successfully updated avatar"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const {videoId} = req.params;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid videoId!");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(401, "Video not found");
  }
  video.isPublished = !video.isPublished;
  await video.save();

  return res
    .status(200)
    .json(new ApiResponse(200, video.isPublished, "Toggeled Successfully"));
});

const getAllVideos = asyncHandler(async (req, res) => {
  const {page = 1, limit = 10, query, sortBy, sortType, userId} = req.query;
});

export {
  publishAVideo,
  getVideoById,
  deleteVideo,
  updateVideo,
  togglePublishStatus,
};
