const db = require("../services/firestoreService");
const { batchGetAnimals, batchGetCategories,combineData, getUniqueIdsAnimalsAndCategories } = require("../utils/index.js");


/* 

{
    "status": 200,
    "data": [
        {
            "id": "4H8LGAmn7k1iWyTvji57",
            "coordinate": {
                "latitude": 27.9655,
                "longitude": -112.9388
            },
            "idAnimal": "65A7p1X0LSMXmUzAhVk6",
            "idCategory": "va6sDJZuFtZNiHuaLF3d",
            "typeLife": {
                "name": "Flora",
                "id": "2mvFSZ9mN0vzy4BrRgkT"
            },
            "animal": {
                "name": "Ballena Gris",
                "description": "El animal más grande del mundo",
                "urlImage": "",
                "id": "65A7p1X0LSMXmUzAhVk6",
                "typeLife": {
                    "id": "VX8DsEiLXS1AtX6wpgkw",
                    "name": "Fauna"
                }
            },
            "category": {
                "name": "Marino",
                "id": "va6sDJZuFtZNiHuaLF3d"
            }
        },
        {
            "id": "",
            "coordinate": {
                "latitude": 26.1,
                "longitude": -110.31
            },
            "idAnimal": "",
            "idCategory": "",
            "typeLife": {
                "id": "",
                "name": "Fauna"
            },
            "animal": null,
            "category": null
        }
    ]
}
*/

const getMarkers = async (req, res) => {
  try {
    // Obtener todos los markers
    const snapshot = await db.collection("markersMap").get();

    const markers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Obtener IDs únicos de animales y categorías 
    const dataIds = getUniqueIdsAnimalsAndCategories(markers);

    // Batch get animales
    const animalsData = await batchGetAnimals(dataIds.animalIds);

    // Batch get categorías
    const categoriesData = await batchGetCategories(dataIds.categoryIds);

    // Combinar datos con markers
    const markersWithDetails = await combineData(markers, animalsData, categoriesData);

    res.json({
        status: 200,
        data: markersWithDetails
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getMarkersByFilter = async (req, res) => {
    const { filterId } = req.params;
    
    const snapshot = await db
    .collection("markersMap")
    .where("typeLife.id", "==", filterId)
    .get();
    const markers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Obtener IDs únicos de animales y categorías
    const dataIds = getUniqueIdsAnimalsAndCategories(markers);

    // Batch get animales
    const animalsData = await batchGetAnimals(dataIds.animalIds);

    // Batch get categorías
    const categoriesData = await batchGetCategories(dataIds.categoryIds);

    // Combinar datos con markers
    const markersFilteredWithDetails = await combineData(markers, animalsData, categoriesData);

    res.json({
        status: 200,
        data: markersFilteredWithDetails
    });
}


module.exports = { getMarkers,getMarkersByFilter};
