const {db} = require("../services/firestoreService");


const getSpecies = async (req, res) => {
  try {
    // Obtener todos los markers
    const snapshot = await db.collection("animals").get();

    const animals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.json({
        status: 200,
        data: animals
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getSpeciesByFilter = async (req, res) => {
    const { filterId } = req.params;
    
    const snapshot = await db
    .collection("animals")
    .where("typeLife.id", "==", filterId)
    .get();
    const animals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.json({
        status: 200,
        data: animals
    });
}

module.exports = { getSpecies,getSpeciesByFilter};
