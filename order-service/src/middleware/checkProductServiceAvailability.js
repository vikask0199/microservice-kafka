const axios = require('axios');

// Middleware to check if the product service is available
exports.checkProductServiceAvailability = async (res, next) => {
    try {
        const productServiceHealth = await axios.get('http://localhost:3000/health');
        console.log("getgfusgtyrfku",productServiceHealth)

        if (productServiceHealth.status !== 200) {
            return res.status(503).json({ error: 'Product service is unavailable' });
        }
        next();
    } catch (error) {
        console.error('Error checking product service availability:', error);
        return res.status(500).json({ error: 'An error occurred while checking product service availability' });
    }
};
