const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// CADASTRO
router.post("/register", async (req, res) => {

    const { nome, email, senha } = req.body;

    const hash = await bcrypt.hash(senha, 10);

    const user = new User({
        nome,
        email,
        senha: hash
    });

    await user.save();

    res.json({ msg: "Usuário criado" });
});


// LOGIN
router.post("/login", async (req, res) => {

    const { email, senha } = req.body;

    const user = await User.findOne({ email });

    if (!user)
        return res.status(400).json({ msg: "Usuário não encontrado" });

    const senhaValida = await bcrypt.compare(senha, user.senha);

    if (!senhaValida)
        return res.status(400).json({ msg: "Senha inválida" });

    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.json({ token });
});

module.exports = router;

