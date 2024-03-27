import { WineModel } from "../models/wineModel.js";

// vini per nazione
export const getWinesByCountry = async (req, res) => {
    const { country } = req.query;
    try {
        const wineByCountry = await WineModel.find({country: {$regex: country, $options: 'i'}});
        if (wineByCountry) {
            res.status(200).send({
                statusCode: 200,
                message: `${wineByCountry.length} oggetti trovati`,
                payload: wineByCountry
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            statusCode: 500,
            message: 'Internal Server Error',
            error: error
        })
    }
}