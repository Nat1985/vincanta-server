import bcrypt from 'bcryptjs'
import { UserModel } from '../models/userModel.js';
import jwt from 'jsonwebtoken';

export const addNewUser = async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const email = req.body.email;
    const isUserExists = await UserModel.findOne({ email: email });
    if (isUserExists) {
        return res.status(400).send({
            statusCode: 400,
            message: `Utente con email ${email} già presente`
        })
    }
    try {
        const newUser = new UserModel({
            email: email,
            password: hashedPassword
        })
        const user = newUser.save();

        const token = jwt.sign({
            id: user._id,
            email: user.email
        }, process.env.JWT_SECRET, { expiresIn: '24h' });
        const userData = {
            id: user._id,
            email: user.email
        };

        res.status(201).send({
            statusCode: 201,
            message: "Nuovo utente inserito correttamente",
            payload: { token, userData }
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({
            statusCode: 500,
            message: "Internal Server Error",
            error: error
        })
    }
}

export const login = async (req, res) => {
    const { email } = req.body;
    const lowerEmail = email.toLowerCase();
    try {
        const user = await UserModel.findOne({ email: lowerEmail });
        if (!user) {
            return res.status(404).send({
                statusCode: 404,
                message: `Nome utente o password non validi.`
            })
        };
        if (await bcrypt.compare(req.body.password, user.password)) {
            const token = jwt.sign({
                id: user._id,
                email: user.email
            }, process.env.JWT_SECRET, { expiresIn: '24h' });
            const userData = {
                id: user._id,
                email: user.email
            };
            res.status(200).send({
                statusCode: 200,
                message: "Login effettuato con successo",
                payload: { token, userData }
            })
        } else {
            res.status(401).send({
                statusCode: 401,
                message: "Nome utente o password non validi."
            })
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({
            statusCode: 500,
            message: "Internal Server Error",
            error: error
        })
    }
}
