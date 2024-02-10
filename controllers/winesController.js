import { WineModel } from "../models/wineModel.js";

export const addNewWine = async (req, res) => {
    try {
        const newWine = new WineModel({
            country: req.body.country,
            region: req.body.region,
            company: req.body.company,
            type: req.body.type,
            name: req.body.name,
            year: req.body.year,
            tablePrice: req.body.tablePrice,
            takeAwayPrice: req.body.takeAwayPrice,
            description: req.body.description,
            favourite: req.body.favourite,
            available: req.body.available,
        });
        const wine = await newWine.save();
        res.status(201).send({
            statusCode: 201,
            message: 'Nuovo vino inserito correttamente.',
            payload: wine
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            statusCode: 500,
            message: 'Internal Server Error',
            error: error
        })
    }
};

export const deleteWineById = async( req, res) => {
    const { wineId } = req.body;
    try {
        const wineToDelete = await WineModel.findByIdAndDelete(wineId);
        if(!wineToDelete) {
            return res.status(404).send({
                statusCode: 404,
                message: `Vino con id ${wineId} non trovato.`,
            })
        }
        res.status(200).send({
            statusCode: 200,
            message: `Vino con id ${wineId} eliminato correttamente.`
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