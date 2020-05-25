module.exports = (query, arr, err)=>{
    let portion = query.portion;
    portion = portion===undefined? 24: Number(portion);
    portion = (typeof portion !=="number" || portion<9 || !Number.isInteger(portion))? 24: portion;
    portion = portion>36? 36:portion;
    portion = portion>arr.length? arr.length: portion;

    let pageCount = arr.length===0? 1:Math.ceil(arr.length/portion);

    let page = query.page;
    page = (page===undefined)? 1: Number(page);
    page = (page===undefined || typeof page !=="number" || page<1 || !Number.isInteger(page))? 1: page;
    page = page>pageCount?pageCount:page;

    let end = page*portion>arr.length? arr.length:page*portion;
    let begin = page*portion-portion;

    return {
        products:arr.slice(begin, end),
        count:arr.length,
        page:page,
        pageCount:pageCount,
        error:err,
        queries:query
    };
};