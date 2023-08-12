const router = require('express').Router();
const PostController = require('../controllers/postController.js')
const requireUser = require("../middleware/requireUser");

router.post("/", requireUser, PostController.createPostController);
router.post("/like", requireUser, PostController.likeAndUnlikePost);
router.put("/", requireUser, PostController.updatePostController);
router.delete("/", requireUser, PostController.deletePost);

module.exports = router;