const Gender = require('./gender');
const Brand = require('./brand');
const Fragrance = require('./fragrance');
const PerfumeType = require('./perfume-type')

module.exports = ()=>{
    const genders = [{ type: 'Мужские' }, { type: 'Женские' }, {type:'Нишевые'}];
    Gender.insertMany(genders, (err)=> {
        if(err) console.log(err); else console.log('Genders are initialized');
    });

    const brands = [
        {
            type: 'Acqua Di Parma'
        },
        {
            type: 'Adopt'
        },
        {
            type:'Ajmal'
        },
        {
            type: 'Antonio Banderas'
        },
        {
            type: 'Bruno Banani'
        },
        {
            type:'Calvin Klein'
        },
        {
            type: 'D.S&Durga'
        },
        {
            type: 'Dior'
        },
        {
            type:'Diptique'
        },
        {
            type: 'Dolce&Gabbana'
        },
        {
            type: 'Frederic Malle'
        },
        {
            type:'Giorgio Armani'
        },
    ];
    Brand.insertMany(brands, (err)=> {
        if(err) console.log(err); else console.log('Brands are initialized.');
    });

    const fragrances=[
        {
            type: 'Цветочные'
        },
        {
            type: 'Древесные'
        },
        {
            type:'Амбровые'
        },
        {
            type: 'Пряные'
        },
        {
            type: 'Восточные'
        },
        {
            type:'Фужерные'
        },
        {
            type: 'Цитрусовые'
        },
        {
            type: 'Шипровые'
        },
        {
            type:'Удовые'
        },
        {
            type: 'Кожаные'
        },
        {
            type: 'Пудровые'
        },
    ];
    Fragrance.insertMany(fragrances, (err)=> {
        if(err) console.log(err); else console.log('Fragrances are initialized');
    });

    const perfumeTypes=[
        { type: 'Парфюмерная вода'},
        {type: 'Туалетная вода'},
        {type:'Одеколон'}
    ];
    PerfumeType.insertMany(perfumeTypes, (err)=> {
        if(err) console.log(err); else console.log('PerfumeTypes are initialized');
    });
};
