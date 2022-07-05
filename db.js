import mongoose from "mongoose";
import Joi from "joi";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		min: 1,
		max: 100,
	},
	email: {
		type: String,
		required: true,
		min: 10,
		max: 255,
		unique: true,
		validate: [
			{
				validator: async function (v) {
					const emailSchema = Joi.object({
						email: Joi.string().min(8).max(255).required().email(),
					});

					return await emailSchema.validateAsync({ email: v });
				},
				message: "Please enter a valid email..",
			},
			{
				validator: async function (v) {
					return !(await User.findOne({ email: v }));
				},
				message: "Email Already in use..",
			},
		],
	},
	password: {
		type: String,
		required: true,
		min: 8,
		max: 1024,
	},
	isAdmin: {
		type: Boolean,
		default: false,
	},
});

userSchema.methods.generateAuthToken = function () {
	return jwt.sign(
		{
			_id: this._id,
			email: this.email,
			isAdmin: this.isAdmin,
			dateCreated: Date.now(),
		},
		process.env.JWT_KEY
	);
};

const User = mongoose.model("User", userSchema);

const Conversation = mongoose.model(
	"Conversation",
	new mongoose.Schema({
		users: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },

		messages: [{
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      message: {type:String, required: true},
      date: {
        type: Date,
        default: Date.now(),
      },
    }],
	})
);

export { User, Conversation };
