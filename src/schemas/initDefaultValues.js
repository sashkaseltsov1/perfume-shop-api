const Gender = require('./gender');
const Brand = require('./brand');
const Fragrance = require('./fragrance');
const PerfumeType = require('./perfumeType')

module.exports = ()=>{
    const genders = [{ type: 'Man' }, { type: 'Woman' }, {type:'Niche'}];
    Gender.insertMany(genders, (err)=> {
        if(err) console.log(err); else console.log('Genders are initialized');
    });

    const brands = [
        {name: 'Acqua Di Parma'},
        {name: 'Adopt'},
        {name:'Ajmal'},
        {name: 'Antonio Banderas'},
        {name: 'Bruno Banani'},
        {name:'Calvin Klein'},
        {name: 'D.S&Durga'},
        {name: 'Dior'},
        {name:'Diptique'},
        {name: 'Dolce&Gabbana'},
        {name: 'Frederic Malle'},
        {name:'Giorgio Armani'},
    ];
    Brand.insertMany(brands, (err)=> {
        if(err) console.log(err); else console.log('Brands are initialized');
    });

    const fragrances=[
        {type: 'Цветочные'},
        {type: 'Древесные'},
        {type:'Амбровые'},
        {type: 'Пряные'},
        {type: 'Восточные'},
        {type:'Фужерные'},
        {type: 'Цитрусовые'},
        {type: 'Шипровые'},
        {type:'Удовые'},
        {type: 'Кожаные'},
        {type: 'Пудровые'},
    ];
    Fragrance.insertMany(fragrances, (err)=> {
        if(err) console.log(err); else console.log('Fragrances are initialized');
    });

    const perfumeTypes=[
        {type: 'Парфюмерная вода'},
        {type: 'Туалетная вода'},
        {type:'Одеколон'},
    ];
    PerfumeType.insertMany(perfumeTypes, (err)=> {
        if(err) console.log(err); else console.log('PerfumeTypes are initialized.');
    });
};
