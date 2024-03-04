import { WineModel } from "../models/wineModel.js"

// Inserisce un nuovo tag a tutti gli oggetti. Key e value attuali: volume e 750
export const insertVolumeTag = async (req, res) => {
    try {
        const allWines = await WineModel.updateMany({}, { $set: { country: 'Italia' } })
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