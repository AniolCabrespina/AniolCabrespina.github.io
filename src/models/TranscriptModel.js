const mongoose = require('mongoose')
const {Schema} = mongoose;

const LabelsSchema = new Schema({
    labelType: {type: String, required: true},
    aboveLine: {type: String, required: true}
});

const ChordsSchema = new Schema({
    chord: {type: String, required: true},
    aboveLine: {type: String, required: true},
    lineSlot: {type: String, required: true}
});

const RhythmsSchema = new Schema({
    rhythmType: {type: String, required: true},
    owningLabel: {type: String, required: true},
    tempoSlot: {type: String, required: true}
});

const TabInputSchema = new Schema({
    string: {type: String, required: true},
    slot: {type: String, required: true},
    textInput: {type: String, required: true}
});

const TabSchema = new Schema({
    tabInputs: {type: [TabInputSchema], required: true},
    belowLine: {type: String, required: true}
});

const UserRating = new Schema({
    username: {type: String, required: true},
    rating: {type: Number, required: true}
});

const TranscriptSchema = new Schema({
    transcriptId: {type: String, required: false},
    owningUsers: {type: [String], required: true},
    singer: {type: String, required: true},
    title: {type: String, required: true},
    lyrics: {type: [String], required: true},
    labels: {type: [LabelsSchema], required: true},
    chords: {type: [ChordsSchema], required: true},
    rhythms: {type: [RhythmsSchema], required: true},
    tabs: {type: [TabSchema], required: true},
    youtubeLink: {type: String, required: false},
    capo: {type: String, required: false},
    difficulty: {type: String, required: false},
    keyWritten: {type: String, required: false},
    isPublished: {type: Boolean, required: true},
    savedByUsers: {type: [String], required: false},
    userRatings: {type: [UserRating], required: false},
    nomenclatureWritten: {type: String, required: true}
});

module.exports = mongoose.model('Transcript', TranscriptSchema);