const Brand = require('../models/brand');
const Fragrance = require('../models/fragrance');
const Gender = require('../models/gender');
const PerfumeType = require('../models/perfume-type');
const errorHandler = require('./utils/error-handler');
const getByFilterName = require('./utils/filters-utils/get-by-filter-name');


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
module.exports.getFilter = async (req, res)=>{

    let filterName = req.params.category;
    try {
        let [filter, schema] = await getByFilterName(filterName);
        res.status(200).json(filter);
    }catch (e) {
        errorHandler(res, 404, e);
    }
};
module.exports.addFilter = async (req, res)=>{
    if(req.user.role!=='Admin'){
        errorHandler(res, 403,null,'Only admin can use this route!');
        return;
    }
    let type = req.body.type;
    let filterName = req.params.category;
    try {
        let [filter, schema] = await getByFilterName(filterName);
        let newOption = new schema({type:type});
        try {
            await newOption.save();
            res.status(200).json({...filter, items:[...filter.items, newOption]});
        }catch (e) {
            errorHandler(res, 500, e);
        }
    }catch (e) {
        errorHandler(res, 404, e);
    }
};
module.exports.removeFilter = async (req, res)=>{
    if(req.user.role!=='Admin'){
        errorHandler(res, 403,null,'Only admin can use this route!');
        return;
    }
    let optionId = req.params.optionId;
    let filterName = req.params.category;
    try {
        let [filter, schema] = await getByFilterName(filterName);

        try {
            await schema.deleteOne({_id:optionId}).exec();
            res.status(200).json({...filter, items:filter.items.filter(item=>!item._id.equals(optionId))});
        }catch (e) {
            errorHandler(res, 500, e);
        }
    }catch (e) {
        errorHandler(res, 404, e);
    }
};
