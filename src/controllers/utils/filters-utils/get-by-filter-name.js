const Brand = require('../../../models/brand');
const Fragrance = require('../../../models/fragrance');
const Gender = require('../../../models/gender');
const PerfumeType = require('../../../models/perfume-type');

module.exports = async(filterName)=>{
    switch (filterName) {
        case 'gender':
            return await getFilter(Gender, 'gender', 'Для кого');
        case 'brand':
            return await getFilter(Brand, 'brand', 'Брэнд');
        case 'fragrance':
            return await getFilter(Fragrance, 'fragrance', 'Аромат');
        case 'perfumeType':
            return await getFilter(PerfumeType, 'perfumeType', 'Тип парфюма');
        default:
            throw new Error('Filter not found!');
    }
};
const getFilter = async (schema, category, name)=>{
    let filter = await schema.find();
    if (filter) {
        return [{
            category: category,
            name: name,
            items: filter
        }, schema];
    } else {
        throw new Error('Filter not found!');
    }
};