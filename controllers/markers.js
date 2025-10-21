const { batchGetAnimals, batchGetCategories,combineData, getUniqueIdsAnimalsAndCategories } = require("../utils/index.js");

const { admin, bucket, db } = require('../services/firestoreService.js');


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
        console.log("3333")

    // Batch get categorías
    const categoriesData = await batchGetCategories(dataIds.categoryIds);

    // Combinar datos con markers
    const markersWithDetails = await combineData(markers, animalsData, categoriesData);

    res.json({
        status: 200,
        data: markersWithDetails
    });
  } catch (err) {
    console.log("error: " , err)
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


const submitImage = (file) => {
  return new Promise((resolve, reject) => {
    const imageName = `markets/${uuidv4()}_${file.originalname}`;
    const blob = bucket.file(imageName);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on('error', (err) => {
      console.error('Error al subir a Firebase:', err);
      reject(err);
    });

    blobStream.on('finish', async () => {
      try {
        await blob.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${imageName}`;
        resolve(publicUrl);
      } catch (err) {
        reject(err);
      }
    });

    blobStream.end(file.buffer);
  });
};


const createAnimal = async (description,name,urlImage,typeLife) => {
    try{
        console.log("entre al endpoint")
       const docRef = await admin.firestore().collection('animals').add({
        name,
        description,
        urlImage: urlImage,
        typeLife: {
            id: typeLife.id,
            name: typeLife.name
        },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        const id = docRef.id;

        // Agregar el campo "id" al documento
        await admin.firestore().collection('animals').doc(id).update({ id });

        // Obtener el documento completo con los datos
        const docSnap = await admin.firestore().collection('animals').doc(id).get();

        if (!docSnap.exists) {
            return res.status(404).json({ error: 'Animal no encontrado' });
        }

        // Retornar los datos al cliente
        return docSnap.data()

    }catch(error){
        console.error("Error al crear el animal", error)
    }
}


const getDataTypeLife = async (categoryId) => {
    try{
       const docRef = admin.firestore().collection('typeLife').doc(categoryId);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
            const data = docSnap.data();
            console.log('Datos del documento:', data);

            return data
        }
        return null

    }catch(error){
        console.error("Error al crear el animal", error)
    }
}


const createMarket = async (req,res) => {
 try {
    console.log("Entre a crear imagen")
    const { name, description, category, latitude, longitude } = req.body;
    const file = req.file;
    console.log("image: ", file)
    if (!file) {
      return res.status(400).json({ error: 'No se recibió imagen' });
    }

    const urlImage = await submitImage(file)

    if(!urlImage){
        throw Error()
    }

    const dateTypeLife = await getDataTypeLife(category)

    if(!dateTypeLife){
        throw Error()
    }

    const animalData = await createAnimal(description,name,urlImage,dateTypeLife)

    const docRef = await admin.firestore().collection('markersMap').add({
        name,
        description,
        idAnimal,
        coordinate: {
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
        },
        typeLife: {
            id: animalData.typeLife.id,
            name: animalData.typeLife.name
        },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const id = docRef.id
    const fieldId = { id: id };

    await admin.firestore().collection('markersMap').doc(id).update(fieldId);

    res.status(200).json({ message: 'Marcador Creado' });

  } catch (error) {
    console.error('Error en createMarket:', error);
    res.status(500).json({ message: 'Ocurrio un error al crear el marcador' });
  }
}


module.exports = { getMarkers, getMarkersByFilter, createMarket};
