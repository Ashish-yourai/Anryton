const Joi = require('joi')

const validateNftDetails = data => {
    const schema = Joi.object({
        nft_id: Joi.string().max(24).min(24).required(), 
    }).unknown();
    return schema.validate(data);
}


module.exports = {
    validateNftDetails: validateNftDetails,
}