const Brand = require('../schemas/brand');
const Fragrance = require('../schemas/fragrance');
const Gender = require('../schemas/gender');
const PerfumeType = require('../schemas/perfume-type');

module.exports =  (app)=> {

    app.get('/filters', async (req, res)=>{
        console.log('get filters2222')
        const brands = await Brand.find();
        const fragrances = await Fragrance.find();
        const genders = await Gender.find();
        const perfumeTypes = await PerfumeType.find();
        const filters = [
            {
                category:'specialOffers',
                name:'Предложения',
                items:[
                    {
                        _id:'new',
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
        res.send({filters:filters});
    });
};
