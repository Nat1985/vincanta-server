import { WineModel } from "../models/wineModel.js"

// Inserisce un nuovo tag a tutti gli oggetti. Key e value attuali: sboccatura e false
export const insertNewTag = async (req, res) => {
    try {
        const allWines = await WineModel.updateMany({}, { $set: { sboccatura: { isTrue: false, date: '' } } })
        res.status(200).send({
            statusCode: 200,
            message: "Il tag è stato aggiunto a tutti gli oggetti"
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            statusCode: 500,
            message: 'Internal Server Error',
            error: error
        })
    }
}