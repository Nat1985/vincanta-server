import { WineModel } from "../models/wineModel.js"

// Inserisce un nuovo tag a tutti gli oggetti. Key e value attuali: sboccatura e false
export const insertNewTag = async (req, res) => {
    try {
        const allWines = await WineModel.updateMany({ country: 'Francia', type: 'champagne-rosé' }, { $set: { country: 'Champagne' } })
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

export const getCoteDuRhone = async (req, res) => {
    try {
        const thatWines = await WineModel.find({ region: 'Cote Du Rhone' });
        if (!thatWines) {
            return res.status(404).send({
                statusCode: 404,
                message: "Nessun vino trovato"
            })
        };
        res.status(200).send({
            statusCode: 200,
            message: thatWines.length + " vini trovati.",
            payload: thatWines
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

export const updateCoteDuRhone = async (req, res) => {
    try {
        const updateWines = await WineModel.updateMany(
            { region: 'Cote Du Rhone' },
            { $set: { region: 'Vallée du Rhône' } }
        );
        if (updateWines.modifiedCount === 0) {
            return res.status(404).send({
                statusCode: 404,
                message: "Nessun vino trovato"
            })
        };
        res.status(200).send({
            statusCode: 200,
            message: updateWines.modifiedCount + " oggetti aggiornati.",
            payload: updateWines
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