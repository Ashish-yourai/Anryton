
let checkHeader = (req, res, next) => {
    console.log("req.headers--------", req.headers);
    if (!req.headers['content-type']
    || !req.headers['x-xss-protection'] || req.headers['x-xss-protection'] !== '1; mode=block'
    || !req.headers['strict-transport-security'] || req.headers['strict-transport-security'] !== 'max-age=5184000'
    || !req.headers['content-security-policy']) {
        console.log("header not validated")
        return res.status(400).json({ error: 'There is something wrong with headers' });
    }
    else{
        console.log("header validated")
        next(); 
    }
}; 

module.exports = {
    checkHeader, 
};

