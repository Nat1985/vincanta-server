import { WineModel } from "../models/wineModel.js";

export const addNewWine = async (req, res) => {
    const trimCompany = req.body.company.trim();
    const isChampagne = req.body.type === 'champagne' ? true : false;
    try {
        const newWine = new WineModel({
            country: isChampagne ? 'Champagne' : req.body.country,
            region: req.body.region,
            city: req.body.city,
            company: trimCompany,
            type: req.body.type,
            name: req.body.name,
            year: req.body.year,
            volume: req.body.volume,
            tablePrice: req.body.tablePrice,
            takeAwayPrice: req.body.takeAwayPrice,
            award: req.body.award,
            sboccatura: req.body.sboccatura,
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

export const getWineById = async (req, res) => {
    const { wineId } = req.query;
    try {
        const wine = await WineModel.findById(wineId);
        if (!wine) {
            return res.status(404).send({
                statusCode: 404,
                message: `Nessun prodotto trovato con id ${wineId}.`
            })
        }
        res.status(200).send({
            statusCode: 200,
            message: 'Prodotto trovato.',
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
}

export const editWineById = async (req, res) => {
    const { id, data } = req.body;
    try {
        const updatedWine = await WineModel.findByIdAndUpdate(
            id,
            data,
            { new: true }
        );
        if (!updatedWine) {
            return res.status(404).send({
                statusCode: 404,
                message: `Nessun prodotto trovato con id ${id}`
            })
        };
        res.status(200).send({
            statusCode: 200,
            message: `Prodotto con id ${id} modificato correttamente.`,
            payload: updatedWine
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

export const getAllWines = async (req, res) => {
    try {
        let query = {};
        if (req.query.type === '') {
            query = {};
        } else {
            const typeValue = req.query.type;
            query = { type: typeValue };
        }    

        const wines = await WineModel.find(query);

        // Raggruppa i vini per nazione, regione e azienda
        const groupedWines = wines.reduce((result, wine) => {
            const countryName = wine.country;
            const regionName = wine.region;
            const companyName = wine.company;

            // Se la nazione non è presente nell'oggetto raggruppato, aggiungila
            if (!result[countryName]) {
                result[countryName] = {
                    country: countryName,
                    data: []
                };
            }

            // Trova l'oggetto della nazione corrente
            const countryObject = result[countryName];

            // Se la regione non è presente nell'array data della nazione, aggiungila
            let regionObject = countryObject.data.find(obj => obj.region === regionName);

            if (!regionObject) {
                regionObject = {
                    region: regionName,
                    data: []
                };
                countryObject.data.push(regionObject);
            }

            // Trova l'oggetto azienda corrente nell'array data della regione
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

        // Ordina l'array di oggetti in base al nome della nazione (in ordine alfabetico)
        groupedWinesArray.sort((a, b) => a.country.localeCompare(b.country));

        // Ordina anche gli array di oggetti regione e azienda all'interno di ogni nazione
        groupedWinesArray.forEach(country => {
            country.data.forEach(region => {
                region.data.sort((a, b) => a.company.localeCompare(b.company));
            });
            country.data.sort((a, b) => a.region.localeCompare(b.region));
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

