module.exports= (queries) => {
    const filters = {
        gender: queries.gender,
        brand: queries.brand,
        fragrance: queries.fragrance,
        perfumeType: queries.perfumeType,
    };
    const toObject = (query, key) => {
        if (query !== undefined)
            return {$or: query.split('|').map(prm => ({[key]: prm}))};
        else
            return undefined;
    };
    const arr = [];
    for (let k in filters) {
        let obj = toObject(filters[k], k);
        if (obj !== undefined) arr.push(obj);
    }

    let offers = {$or:[]};
    if(queries.isDiscount) offers.$or.push({isDiscount: true});
    if(queries.isNovelty) offers.$or.push({isNovelty: true});
    if(offers.$or.length!==0) arr.push(offers);

    if(queries.min)
        arr.push({fullPrise:{ $gt: queries.min }});
    if(queries.max)
        arr.push({fullPrise:{ $lt: queries.max }});
    if (queries.find){
        arr.push({ name: { $regex: queries.find, $options: "i" } });
    }
    if (arr.length !== 0)
        return {$and: arr};
    else
        return {}
};