const express = require("express");
const router = express.Router();

router.get('/logout', function(req, res) {
    // if (err) res.json({ "result": "failed" });
    // else {
    delete req.session.userid;
    res.json({ "result": "success" });
    // }

})

module.exports = router;