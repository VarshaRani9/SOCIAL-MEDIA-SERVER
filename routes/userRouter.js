const requireUser = require("../middleware/requireUser");
const userController = require("../controllers/userController");

const router = require("express").Router();

router.post("/follow",requireUser,userController.followOrUnfollowUserController);
router.get("/getfeedData",requireUser,userController.getPostsOfFollowing);
router.get("/getMyPosts", requireUser, userController.getMyPosts);
router.get("/getUserPosts", requireUser, userController.getUserPosts);
router.delete("/", requireUser, userController.deleteMyProfile);
router.get('/getMyInfo', requireUser, userController.getMyInfo);
router.put('/', requireUser, userController.updateUserProfile);
router.post('/getUserProfile', requireUser, userController.getUserProfile);

module.exports = router;
