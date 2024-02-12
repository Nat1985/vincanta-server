import { WineModel } from "../models/wineModel.js";

export const addNewWine = async (req, res) => {
    try {
        const newWine = new WineModel({
            country: req.body.country,
            region: req.body.region,
            city: req.body.city,
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

export const deleteWineById = async (req, res) => {
    const { wineId } = req.body;
    try {
        const wineToDelete = await WineModel.findByIdAndDelete(wineId);
        if (!wineToDelete) {
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

/* export const getAllWines = async (req, res) => {
    try {
        const wines = await WineModel.find();
        res.status(200).send({
            statusCode: 200,
            payload: wines
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            statusCode: 500,
            message: 'Internal Server Error',
            error: error
        })
    }
} */

export const getAllWines = async (req, res) => {
    try {
        const wines = await WineModel.find();

        // Raggruppa i vini per regione e azienda
        const groupedWines = wines.reduce((result, wine) => {
            const regionName = wine.region;
            const companyName = wine.company;

            // Se la regione non è presente nell'oggetto raggruppato, aggiungila
            if (!result[regionName]) {
                result[regionName] = {
                    region: regionName,
                    data: []
                };
            }

            // Trova l'oggetto della regione corrente
            const regionObject = result[regionName];

            // Cerca l'oggetto azienda corrente nell'array data della regione
            let companyObject = regionObject.data.find(obj => obj.company === companyName);

            // Se l'azienda non è presente, aggiungila
            if (!companyObject) {
                companyObject = {
                    company: companyName,
                    data: []
                };
                regionObject.data.push(companyObject);
            }

            // Aggiungi il vino all'array dell'azienda nella regione
            companyObject.data.push(wine);

            return result;
        }, {});

        // Trasforma l'oggetto raggruppato in un array di oggetti
        const groupedWinesArray = Object.values(groupedWines);

        // Ordina l'array di oggetti in base al nome della regione (in ordine alfabetico)
        groupedWinesArray.sort((a, b) => a.region.localeCompare(b.region));

        // Ordina anche gli array di oggetti azienda all'interno di ogni regione
        groupedWinesArray.forEach(region => {
            region.data.sort((a, b) => a.company.localeCompare(b.company));
        });

        res.status(200).send({
            statusCode: 200,
            payload: groupedWinesArray
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            statusCode: 500,
            message: 'Internal Server Error',
            error: error
        });
    }
};