const router = require("express").Router();
const { param } = require("express-validator");
const validation = require("../handlers/validation");
const tokenHandler = require("../handlers/tokenHandler");
const boardController = require("../controllers/board");

router.post("/", tokenHandler.verifyToken, boardController.create);

router.get("/", tokenHandler.verifyToken, boardController.getAll);

router.put("/", tokenHandler.verifyToken, boardController.updatePosition);

router.get(
  "/:boardId",
  param("boardId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("Invalid board id");
    } else {
      return Promise.resolve();
    }
  }),
  validation.validate,
  tokenHandler.verifyToken,
  boardController.getContent
);

router.delete("/:boardId", tokenHandler.verifyToken, boardController.delete);

router.put("/:boardId", tokenHandler.verifyToken, boardController.update);

module.exports = router;
