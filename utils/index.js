const {db} = require("../services/firestoreService");


const batchGetAnimals = async (animalIds) => {
    let animalsData = {};
    const chunkSize = 10;

    const validIds = animalIds.map(id => String(id)).filter(id => id);

    for (let i = 0; i < validIds.length; i += chunkSize) {
        const chunk = validIds.slice(i, i + chunkSize);

        const animalsSnap = await db
            .collection("animals")
            .where('__name__', 'in', chunk)
            .get();

        animalsSnap.docs.forEach(doc => {
            animalsData[doc.id] = doc.data();
        });
    }

    return animalsData;
};


const batchGetCategories = async (categoryIds) => {

    let categoriesData = {};

    const validIds = categoryIds.map(id => String(id)).filter(id => id);

    if (validIds.length > 0) {
        const categoriesSnap = await db
            .collection("category")
            .where('__name__', 'in', validIds)
            .get();

        categoriesSnap.docs.forEach(doc => {
            categoriesData[doc.id] = doc.data();
        });
    }

    return categoriesData;
}; 

const combineData = (markers, animalsData) => {
    return markers.map(marker => ({
      ...marker,
      animal: animalsData[marker.idAnimal] || null,
     // category: categoriesData[marker.idCategory] || null
    }));
  
}

const getUniqueIdsAnimalsAndCategories = (markers) => {
    const animalIds = [...new Set(markers.map(m => String(m.idAnimal)))];
    const categoryIds = [...new Set(markers.map(m => String(m.idCategory)))];
    return { animalIds, categoryIds };
}

module.exports = {batchGetAnimals,batchGetCategories,combineData,getUniqueIdsAnimalsAndCategories };
