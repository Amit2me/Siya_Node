const router = require('express').Router();
const Chat = require('../models/chat');
const Faq = require('../models/faq');

const passport = require("passport");
const bcrypt = require('bcrypt');
const User = require('../models/user')

router.get('/', checkNotAuthenticated, (req, res) => {
    res.render('admin');
})

router.get('/add-question', checkAuthenticated, checkAdminAuthentication, (req, res) => {
    res.render('addQuestion');
});

router.get('/all-questions', checkAuthenticated, checkAdminAuthentication, async (req, res) => {
    try {
        let faqs = await Faq.find().sort({ date: -1 });
        let chats = await Chat.find().sort({ date: -1 });
        res.render('allQuestion', { faqs, chats });
    } catch (error) {
        console.log(error);
    }
})

router.delete('/faq/:id', checkAuthenticated, checkAdminAuthentication, async (req, res) => {
    try {
        await Faq.findByIdAndDelete(req.params.id);
        res.redirect('/admin/all-questions');
    } catch (error) {
        console.log(error);
    }
})
router.delete('/chat/:id', checkAuthenticated, checkAdminAuthentication, async (req, res) => {
    try {
        await Chat.findByIdAndDelete(req.params.id);
        res.redirect('/admin/all-questions');
    } catch (error) {
        console.log(error);
    }
})

router.put('/chat/:id', checkAuthenticated, checkAdminAuthentication, async (req, res) => {
    try {
        await Chat.findByIdAndUpdate(req.params.id, {
            question: req.body.question,
            answer: req.body.answer
        })
        // console.log(await Chat.findById(req.params.id))
        res.redirect('/admin/all-questions')
    } catch (error) {
        console.log(error);
    }
})
router.put('/faq/:id', checkAuthenticated, checkAdminAuthentication, async (req, res) => {
    try {
        await Faq.findByIdAndUpdate(req.params.id, {
            question: req.body.question,
            answer: req.body.answer
        })
        res.redirect('/admin/all-questions')
    } catch (error) {
        console.log(error);
    }
})

router.get('/chat/edit/:id', checkAuthenticated, checkAdminAuthentication, async (req, res) => {
    try {
        let message = await Chat.findById(req.params.id);
        res.render('edit', { message, type: "chat" });
    } catch (error) {
        console.log(error);
    }
})

router.get('/faq/edit/:id', checkAuthenticated, checkAdminAuthentication, async (req, res) => {
    try {
        let message = await Faq.findById(req.params.id);
        res.render('edit', { message, type: "faq" });
    } catch (error) {
        console.log(error);
    }
})

router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/admin/add-question',
    failureRedirect: '/admin',
    failureFlash: true
}));

router.delete('/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
});

router.post('/chat', checkAuthenticated, checkAdminAuthentication, async (req, res) => {
    try {

        let chat = new Chat({
            question: req.body.question,
            answer: req.body.answer
        });
        await chat.save();
        res.redirect('/admin/all-questions');

    } catch (error) {
        console.log(error);
        res.redirect('/admin/all-questions');
    }
})
router.post('/faq', checkAuthenticated, checkAdminAuthentication, async (req, res) => {
    try {

        let faq = new Faq({
            question: req.body.question,
            answer: req.body.answer
        });
        await faq.save();
        res.redirect('/admin/all-questions');

    } catch (error) {
        console.log(error);
        res.redirect('/admin/all-questions');
    }
})

router.delete('/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else
        res.redirect('/');
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/admin/add-question');
    }
    else
        return next();
}

function checkAdminAuthentication(req, res, next) {
    if (req.user.role === "admin") {
        return next();
    }
    else
        res.redirect('/');
}

module.exports = router;