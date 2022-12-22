const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, unique: true, required: true },
	password: { type: String, required: true },
	likedPosts: { type: [String], default: [] },
});

userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign(
		{ _id: this._id, name: this.name },
		process.env.SECRET_KEY,
		{ expiresIn: "7d" }
	);
	return token;
};

// const validate = (user) => {
// 	const schema = Joi.object({
// 		name: Joi.string().required(),
// 		email: Joi.string().email().required(),
// 		password: passwordComplexity().required(),		
// 	});
// 	return schema.validate(user);
// };

const User = mongoose.model("User", userSchema);

module.exports = User;