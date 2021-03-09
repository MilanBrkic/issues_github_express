const connect = require('./db.js');
const db = connect();


const commentSchema = db.Schema({
    user: String,
    text: String
})

const issueSchema = db.Schema({
    title: String,
    text: String,
    user: String,
    closed: Boolean,
    file: [String],
    comment: [commentSchema]
})

module.exports = db.model('Issue', issueSchema);