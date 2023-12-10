const axios = require('axios');
const API_KEY = process.env.API_KEY;
const API = 'https://api.etherscan.io/api';

async function getBlock(blockDate) {
    const unixTs = Math.floor(new Date(blockDate).getTime() / 1000);
    const params = {
        module: 'block',
        action: 'getblocknobytime',
        timestamp: unixTs,
        closest: 'before',
        apikey: API_KEY
    };

    try {
        const response = await axios.get(API, { params });
        return response.data.result;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { startDt, endDt } = req.body;
        const startBlock = await getBlock(startDt);
        const endBlock = await getBlock(endDt);

        if (startBlock && endBlock) {
            res.status(200).json({ startBlock, endBlock });
        } else {
            res.status(500).json({ error: 'Failed to fetch block numbers' });
        }
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}
