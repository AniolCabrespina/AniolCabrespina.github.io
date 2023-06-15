const express = require('express');
const router = express.Router();

const User = require('../models/UserModel');
const Transcript = require('../models/TranscriptModel');

/*****USERS ROUTES*****/
router.get('/users', async (req, res) => {
    const users = await User.find();
    res.json(users);
});

router.get('/users/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    res.json(user);
});

router.post('/users', async (req, res) => {
    const {username, email, password, mainHand, nomenclature} = req.body;
    const user = new User({username, email, password, mainHand, nomenclature});
    await user.save();
    res.json({status: 'User Saved'});
});

router.put('/users/:id', async (req, res) => {
    const {username, email, mainHand, nomenclature} = req.body;
    const updatedUser = {username, email, mainHand, nomenclature};
    await User.findByIdAndUpdate(req.params.id, updatedUser);
    res.json({status: 'User Updated'});
})

router.delete('/users/:id', async (req, res) => {
    await User.findByIdAndRemove(req.params.id);
    res.json({status: 'User Deleted'});
});

/*****TRANSCRIPTS ROUTES*****/
router.get('/transcripts', async (req, res) => {
    const transcripts = await Transcript.find();
    res.json(transcripts);
});

router.get('/transcripts/:id', async (req, res) => {
    const transcript = await Transcript.findById(req.params.id);
    res.json(transcript);
});

router.post('/transcripts', async (req, res) => {
    const {singer, capo, chords, difficulty, keyWritten, labels, lyrics, rhythms, tabs, title, youtubeLink, owningUsers, isPublished, nomenclatureWritten, savedByUsers, userRatings} = req.body;
    const transcript = new Transcript({singer, capo, chords, difficulty, keyWritten, labels, lyrics, rhythms, tabs, title, youtubeLink, owningUsers, isPublished, nomenclatureWritten, savedByUsers, userRatings});
    await transcript.save();
    res.json({status: 'Transcript Saved'});
});

router.put('/transcripts/:id', async (req, res) => {
    const {singer, capo, chords, difficulty, keyWritten, labels, lyrics, rhythms, tabs, title, youtubeLink, owningUsers, isPublished, nomenclatureWritten, savedByUsers, userRatings} = req.body;
    const newTranscript = {singer, capo, chords, difficulty, keyWritten, labels, lyrics, rhythms, tabs, title, youtubeLink, owningUsers, isPublished, nomenclatureWritten, savedByUsers, userRatings};
    await Transcript.findByIdAndUpdate(req.params.id, newTranscript);
    res.json({status: 'Transcript Updated'});
})

router.delete('/transcripts/:id', async (req, res) => {
    await Transcript.findByIdAndRemove(req.params.id);
    res.json({status: 'Transcript Deleted'});
});

module.exports = router;