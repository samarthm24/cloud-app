const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const product_controller = require('../controllers/product.controller');



router.post('/users',product_controller.user_create);
router.get('/users',product_controller.all_user_detail);
router.get('/users/:username',product_controller.user_details);
router.delete('/users/:username',product_controller.user_delete);
router.post('/users/login',product_controller.user_login);
router.get('/_count',product_controller.count_get);
router.delete('/_count',product_controller.count_reset);
module.exports = router;

