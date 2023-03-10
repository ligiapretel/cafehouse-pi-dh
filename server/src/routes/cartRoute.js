const express = require("express");
const router = express.Router();
const cartController = require("../controllers/CartController");

router.get("/",cartController.index);
router.post("/adicionar",cartController.addCart);
router.post("/atualizar/:id",cartController.updateQuantity);
router.get("/:id/remover",cartController.removeCart);
router.get("/esvaziar",cartController.resetCart);

module.exports = router;