var mongoose = require("mongoose"),
random       = require("mongoose-simple-random");

var StoriesSchema = new mongoose.Schema({
    image: String,
    imageDelete: String,
    text: {
        type: String,
        required: true
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        username: String,
    },
});

StoriesSchema.plugin(random);

module.exports = mongoose.model("Story", StoriesSchema);