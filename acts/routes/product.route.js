const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const product_controller = require('../controllers/product.controller');


router.post('/categories',product_controller.category_create);
router.get('/categories',product_controller.all_category_detail);
router.delete('/categories/:categoryName',product_controller.category_delete);
router.delete('/categories',product_controller.category_delete_empty);
router.post('/acts',product_controller.act_create);
router.get('/acts',product_controller.all_act_detail);
router.get('/acts/count',product_controller.all_act_count);
router.delete('/acts/:actid',product_controller.act_delete);

router.get('/categories/:categoryName/acts',product_controller.all_act_category_detail);
router.post('/categories/:categoryName/acts',product_controller.act_create);
router.delete('/categories/:categoryName/acts',product_controller.category_delete_empty);
router.get('/_count',product_controller.count_get);
router.delete('/_count',product_controller.count_reset);
router.get('/categories/:categoryName/acts/size',product_controller.all_act_category_size);
router.post('/acts/upvote',product_controller.act_upvote);
router.post('/users/login',product_controller.user_login);

router.get('/acts/count',product_controller.act_count);
router.get('/_health',product_controller.health);
router.post('/_crash',product_controller.crash);
module.exports = router;

