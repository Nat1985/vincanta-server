import { WineModel } from "../models/wineModel.js";
import cloudinary from '../services/cloudinary.js';

export const addNewWine = async (req, res) => {
    const trimCompany = req.body.company.trim();
    const isChampagne = req.body.type === 'champagne' || req.body.type === 'champagne-rosé' ? true : false;
    try {
        const newWine = new WineModel({
            country: isChampagne ? 'Champagne' : req.body.country,
            region: req.body.region,
            champagneCategory: isChampagne ? (req.body.champagneCategory ? req.body.champagneCategory : null) : null,
            city: req.body.city,
            company: trimCompany,
            type: req.body.type,
            name: req.body.name,
            year: req.body.year,
            volume: req.body.volume,
            tablePrice: req.body.tablePrice,
            takeAwayPrice: req.body.takeAwayPrice,
            award: req.body.award,
            sboccatura: {
                isTrue: req.body.sboccatura,
                date: req.body.sboccaturaDate
            },
            isGoodValue: req.body.isGoodValue,
            description: req.body.description,
            favourite: req.body.favourite,
            isBio: req.body.isBio,
            available: req.body.available,
            frontLabel: req.body.frontLabel,
            backLabel: req.body.backLabel
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
        // Elimino le immagini da Cloudinary
        const imagesIdArray = [wineToDelete.frontLabel?.public_id, wineToDelete.backLabel?.public_id].filter(id => id); // Elimino gli elementi null
        if (imagesIdArray.length > 0) {
            console.log('here 2');
            // Creo un array di Promise
            const deletingResults = await Promise.all(imagesIdArray.map(async (public_id) => {
                console.log('here 3');
                try {
                    const deleteResponse = await cloudinary.uploader.destroy(public_id);
                    if (deleteResponse.result === 'ok') {
                        return { public_id, status: 'deleted' };
                    } else if (deleteResponse.result === 'not found') {
                        console.log(`Immagine con public_id ${public_id} non trovata.`)
                        return { public_id, status: 'not found' }
                    } else {
                        return { public_id, status: 'error' }
                    }
                } catch (error) {
                    console.error(`Errore nella cancellazione dell'immagine con 'public_id' ${public_id}`)
                    return { public_id, status: 'error' };
                }
            }));

            const success = deletingResults.filter(result => result.status === 'deleted');
            const notFound = deletingResults.filter(result => result.status === 'not found');
            const errors = deletingResults.filter(result => result.status === 'error');

            if (errors.length > 0) {
                console.log('here 4');
                return res.status(500).send({
                    statusCode: 500,
                    message: "Si sono verificati errori durante la cancellazione delle immagini.",
                    results: {
                        success,
                        notFound,
                        errors
                    }
                });
            }
        }
        //
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
    if (data.type === 'champagne' || data.type === 'champagne-rosé') {
        data.country = 'Champagne'
    }

    // Combino le voci sboccatura e sboccaturaDate in un unico oggetto
    const { sboccatura, sboccaturaDate, ...rest } = data;
    let updatedData;
    if (!sboccatura) {
        updatedData = {
            ...rest,
            sboccatura: {
                isTrue: false,
                date: ''
            }
        };
    } else {
        updatedData = {
            ...rest,
            sboccatura: {
                isTrue: true,
                date: sboccaturaDate
            }
        };
    }

    try {
        const updatedWine = await WineModel.findByIdAndUpdate(
            id,
            updatedData,
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

export const countWines = async (req, res) => {
    try {
        const wineCounter = await WineModel.estimatedDocumentCount({});
        res.status(200).send({
            statusCode: 200,
            payload: wineCounter
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
    const { type, search, favourites, from, to, option, volume } = req.query;
    // Fixo il valore di frome to
    let fromRange = from === 'undefined' ? '' : parseInt(from);
    let toRange = to === 'undefined' ? '' : parseInt(to);
    /* let fixedOption = option === 'undefined' ? '' : (option === 'Tavolo' ); */
    let fixedOption;
    if (option === 'undefined') {
        fixedOption = '';
    } else if (option === 'Tavolo') {
        fixedOption = 'tablePrice'
    } else if (option === 'Asporto') {
        fixedOption = 'takeAwayPrice'
    }

    if (fromRange || toRange) {
        fromRange = fromRange ? parseInt(fromRange) : 0;
        toRange = toRange ? parseInt(toRange) : Infinity;
    }

    // Controllo se è presente type o search
    let filter = {};
    if (type) filter = { type: type };
    if (search) {
        filter = {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ]
        };
    }
    if (favourites) filter = { favourite: true };

    try {

        const wines = await WineModel.find(filter)

        // Filtro i vini per 'volume'
        let volumeWineSelection = [...wines];
        if (volume && (
            volume === '35 CL'||
            volume === '50 CL'||
            volume === '75 CL'||
            volume === '1,5 L'||
            volume === '3 L'||
            volume === '5 L'
        )) { // Se c'è 'size' (e il valore è uno di quelli dichiarati nella condizione) il valore è settato, altrimenti 'sizeWineSelection' rimane uguale a 'wines'
            volumeWineSelection = wines.filter(element => element.volume === volume)
        }

        // Filtro i vini per range di prezzo
        let rangedWines = [...volumeWineSelection];
        if (option) { // Se c'è option vuol dire che il range è settato
            rangedWines = volumeWineSelection.filter(element => element[fixedOption] >= fromRange && element[fixedOption] <= toRange)
        }

        // Raggruppo i vini per nazione, regione e azienda
        const groupedWines = rangedWines.reduce((result, wine) => {
            const countryName = wine.country;
            const regionName = wine.region;
            const companyName = wine.company;
            const { tablePrice, takeAwayPrice } = wine;

            // Se la nazione non è presente nell'oggetto raggruppato, la aggiungo
            if (!result[countryName]) {
                result[countryName] = {
                    country: countryName,
                    data: []
                };
            }

            // Trovo l'oggetto della nazione corrente
            const countryObject = result[countryName];

            // Se la regione non è presente nell'array data della nazione, la aggiungo
            let regionObject = countryObject.data.find(obj => obj.region === regionName);

            if (!regionObject) {
                regionObject = {
                    region: regionName,
                    data: []
                };
                countryObject.data.push(regionObject);
            }

            // Trovo l'oggetto azienda corrente nell'array data della regione
            let companyObject = regionObject.data.find(obj => obj.company === companyName);

            // Se l'azienda non è presente, la aggiungo
            if (!companyObject) {
                companyObject = {
                    company: companyName,
                    data: []
                };
                regionObject.data.push(companyObject);
            }

            // Aggiungo il vino all'array dell'azienda nella regione
            companyObject.data.push(wine);
            // Riordino ogni volta per prezzo i vini all'interno dell'azienda
            companyObject.data.sort((a, b) => a.tablePrice - b.tablePrice);
            // Riordino ogni volta in ordine alfabetico le aziende all'interno della regione
            regionObject.data.sort((a, b) => a.company.localeCompare(b.company));

            return result;
        }, {});

        // Faccio gli ordinamenti al di fuori del ciclo, quindi solo alla fine
        // E' più efficiente, rispetto alle ultime due righe all'interno del ciclo. Da testare:
        /* Object.values(groupedWines).forEach(countryObject => {
            countryObject.data.forEach(regionObject => {
                regionObject.data.forEach(companyObject => {
                    companyObject.data.sort((a, b) => a.tablePrice - b.tablePrice);
                });
                regionObject.data.sort((a, b) => a.company.localeCompare(b.company));
            });
        }); */
        //
        //

        // Trasformo l'oggetto raggruppato in un array di oggetti
        let groupedWinesArray = Object.values(groupedWines);

        // Suddivido l'array in tre parti: Italia, Francia (incl. Champagne) e tutte le altre nazioni
        let italy = groupedWinesArray.find(item => item.country.toLowerCase() === 'italia');
        let france = groupedWinesArray.find(item => item.country.toLowerCase() === 'francia');
        let champagne = groupedWinesArray.find(item => item.country.toLowerCase() === 'champagne');
        let otherCountries = groupedWinesArray.filter(item => item !== italy && item !== france && item !== champagne);

        // Ordino le tre parti separatamente
        if (italy) italy.data.sort((a, b) => a.region.localeCompare(b.region));
        if (france) france.data.sort((a, b) => a.region.localeCompare(b.region));
        if (champagne) champagne.data.sort((a, b) => a.region.localeCompare(b.region));
        if (otherCountries.length > 0) {
            otherCountries.sort((a, b) => a.country.localeCompare(b.country));
            otherCountries.forEach(country => {
                country.data.forEach(region => {
                    region.data.sort((a, b) => a.company.localeCompare(b.company));
                });
                country.data.sort((a, b) => a.region.localeCompare(b.region));
            });
        }

        // Concateno le tre parti nell'ordine desiderato
        groupedWinesArray = [];
        if (italy) groupedWinesArray.push(italy);
        if (france) groupedWinesArray.push(france);
        if (champagne) groupedWinesArray.push(champagne);
        groupedWinesArray = groupedWinesArray.concat(otherCountries);

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

export const uploadImage = async (req, res) => {
    const { image } = req.body;
    const spaceOccupied = JSON.stringify(image).length;
    console.log("Spazio occupato da gallery:", spaceOccupied, "byte");

    if (image) {
        try {
            const uploadResponse = await cloudinary.uploader.upload(image, {
                upload_preset: 'vincanta-wines'
            })
            if (uploadResponse) {
                // get rezisedUrl
                const photoUrl = uploadResponse.secure_url;
                const partsOfUrl = photoUrl.split('/');
                const baseUrl = partsOfUrl.slice(0, 6).join('/');
                const finalUrl = partsOfUrl.slice(6, 9).join('/');
                const resizedUrl = baseUrl + '/w_500/' + finalUrl;
                uploadResponse.resizedUrl = resizedUrl;
                if (uploadResponse.width < 500) {
                    uploadResponse.resizedUrl = photoUrl
                }
                //
            }
            res.status(201).send({
                statusCode: 201,
                message: "New image uploaded",
                payload: uploadResponse
            })
        } catch (error) {
            console.log(error);
            if (error.message.includes('File size too large')) {
                res.status(400).send({
                    statusCode: 400,
                    message: error.message,
                });
            } else {
                res.status(500).send({
                    statusCode: 500,
                    message: 'Internal Server Error',
                    error: error
                });
            }
        }
    }
}

export const deleteImage = async (req, res) => {
    console.log('deleteImage 1');
    const { public_id } = req.body;
    if (public_id) {
        try {
            const deleteResponse = await cloudinary.uploader.destroy(public_id);
            if (deleteResponse.result === 'ok') {
                console.log('deleteImage 2');
                res.status(200).send({
                    statusCode: 200,
                    message: "Immagine cancellata con successo"
                })
            } else if (deleteResponse.result === 'not found') {
                console.log(`Immagine con 'public_id' ${public_id} non trovata`)
                res.status(400).send({
                    statusCode: 400,
                    message: `Immagine non trovata.`
                })
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({
                statusCode: 500,
                message: 'Internal Server Error',
                error: error
            });
        }
    } else {
        console.log('deleteImage here 3');
        res.status(400).send({
            statusCode: 400,
            message: `Nessun valore di 'public_id' passato al server.`
        });
    }
}