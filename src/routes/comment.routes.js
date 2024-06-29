import {Router} from "express";
import {
  addComment,
  updateComment,
  deleteComment,
} from "../controllers/comment.controllers.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT);

router.route("/:videoId").post(addComment); //.get(getVideoComments)
router.route("/c/:commentId").delete(deleteComment).patch(updateComment);
export default router;
