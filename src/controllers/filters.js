const Brand = require('../models/brand');
const Fragrance = require('../models/fragrance');
const Gender = require('../models/gender');
const PerfumeType = require('../models/perfume-type');
const errorHandler = require('./utils/error-handler')
module.exports.getAll = async (req, res)=>{
    let brands;
    let fragrances;
    let genders;
    let perfumeTypes;
    try{
        brands = await Brand.find();
        fragrances = await Fragrance.find();
        genders = await Gender.find();
        perfumeTypes = await PerfumeType.find();
    }catch (e) {
        errorHandler(res, 500, e);
        return;
    }
    const filters = [
        {
            category:'specialOffers',
            name:'Предложения',
            items:[
                {
                    _id:'isNovelty',
                    type:'Новинки'
                },
                {
                    _id:'isDiscount',
                    type:'Скидки'
                },
            ]
        },
        {
            category:'brand',
            name:'Брэнды',
            items:brands
        },
        {
            category:'fragrance',
            name:'Ароматы',
            items:fragrances
        },
        {
            category:'gender',
            name:'Для кого',
            items:genders
        },
        {
            category:'perfumeType',
            name:'Тип парфюма',
            items:perfumeTypes
        },
    ];
    res.status(200).json({filters:filters});
};