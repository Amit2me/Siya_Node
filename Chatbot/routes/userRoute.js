const router = require('express').Router();
const Faq = require('../models/faq');


router.get('/', searchMiddleware, (req, res) => {
    res.render('chat');
});


router.get('/faqs', async (req, res) => {
    let faqs = await Faq.find().sort({ date: -1 });
    res.render('faq', { faqs });
});


async function searchMiddleware(req, res, next) {

    if (req.query.search) {

        let faqs = await Faq.find({ question: { $regex: req.query.search, $options: '$i' } })

        res.render('faq', { faqs });
        res.end();
    }
    else
        return next();
}

module.exports = router;