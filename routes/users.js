const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

// register user
router.post("/register", async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user)
        return res
            .status(403)
            .send({ message: "User with given email already Exist!" });
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    let newUser = await new User({
        ...req.body,
        password: hashPassword,
    }).save();

    res
        .status(200)
        .send({ data: newUser.email, message: "Account created successfully" });
});

// login
router.post("/login", async (req, res) => {
	const user = await User.findOne({ email: req.body.email });
	if (!user)
		return res.status(400).send({ message: "invalid email or password!" });

	const validPassword = await bcrypt.compare(req.body.password, user.password);
	if (!validPassword)
		return res.status(400).send({ message: "Invalid email or password!" });

	const token = user.generateAuthToken();
	res.status(200).send({ data: token, message: "Signing in please wait..." });
});

// get all users
router.get("/", async (req, res) => {
	const users = await User.find();
	res.status(200).send({ data: users });
});

module.exports = router;