import bcrypt from 'bcryptjs'
import { UserModel } from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { sendMail } from './utils/sendMail.js';

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
            email: user.email,
            action: 'login'
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
                email: user.email,
                action: 'login'
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
                message: "Email o password non validi."
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

export const resetPasswordRequest = async (req, res) => {
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
        const resetPasswordToken = jwt.sign({
            id: user._id,
            email: user.email,
            action: 'changePassword'
        }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const setNewPasswordUrl = `${process.env.PUBLIC_URL}/set-new-password?email=${user.email}&token=${resetPasswordToken}`;
        const emailBody = `
        <h1>Reset della password per l'area riservata Vincanta carta dei vini</h1>
        <h5>(Email automatica)</h5>
        <h2>Clicca il tasto per settare la tua nuova password</h2>
        <a href="${setNewPasswordUrl}"><button style="background-color: #782a76; padding: 8px; color: #ffffff; border-radius: 8px">Imposta nuova password</button></a>
        <p>oppure, copia e incolla il seguente link nella barra degli indirizzi del tuo browser</p>
        <h4>${setNewPasswordUrl}</h4>
        `

        await sendMail(user.email, emailBody);
        res.status(200).send({
            statusCode: 200,
            message: 'Email di reset della password inviata con successo.'
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            statusCode: 500,
            message: "Internal Server Error",
            error: error
        })
    }
}

export const setNewPassword = async (req, res) => {
    console.log('req.body: ', req.body)
    const { email, token, newPassword } = req.body;
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if (decodedToken) {
            if (decodedToken.email !== email) {
                return res.status(401).send({
                    statusCode: 401,
                    message: "Accesso non autorizzato."
                })
            }
            const user = await UserModel.findOne({ email: email });
            if (!user) {
                return res.status(404).send({
                    statusCode: 404,
                    message: "Accesso non consentito."
                })
            }
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            const newUserPassword = await UserModel.findByIdAndUpdate(
                decodedToken.id,
                { password: hashedNewPassword },
                { new: true }
            )
        }
        res.status(200).send({
            statusCode: 200,
            message: "Password aggiornata con successo."
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

export const verifyAndRefreshToken = async (req, res) => {
    const { id, token } = req.body;
    try {
        //Controllo che esiste l'utente
        const user = await UserModel.findById(id);
        if (!user) {
            return res.status(404).send({
                statusCode: 404,
                message: "Utente non presente, token non valido."
            })
        }
        // verifico che il token sia valido
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if (decodedToken) {
            // verifico che non sia associato all'utente corretto
            if (user._id.toString() !== id) {
                return res.status(401).send({
                    statusCode: 401,
                    message: "Utente non autorizzato, token non valido."
                })
            }
            // Verifico che sia un token di login
            if (decodedToken.action !== 'login') {
                return res.status(400).send({
                    statusCode: 400,
                    message: 'Token non idoneo.'
                })
            }
            // verifico che non sia scaduto
            const currentTime = Date.now() / 1000;
            if (decodedToken.exp < currentTime) {
                return res.status(400).send({
                    statusCode: 400,
                    message: "Token scaduto"
                })
            }

            // creo un nuovo token da mandare in frontend e sostituirlo
            const newToken = jwt.sign({
                id: user._id,
                email: user.email,
                action: 'login'
            }, process.env.JWT_SECRET, { expiresIn: '24h' });
            const userData = {
                id: user._id,
                email: user.email
            };
            res.status(200).send({
                statusCode: 200,
                message: "Sessione autorizzata. Token aggiornato.",
                payload: { newToken, userData }
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