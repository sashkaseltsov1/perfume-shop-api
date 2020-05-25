
module.exports = (res,statusCode, error, message)=>{
    let msg;
    if(error) msg=error.message?error.message:error;
    if(message) msg=message;
    res.status(statusCode).json({message:msg});
};