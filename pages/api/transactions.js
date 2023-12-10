const axios = require('axios');
const API_KEY = process.env.API_KEY;
const API = 'https://api.etherscan.io/api';

async function etherscanGet(taskParams) {
    const params = { apikey: API_KEY, ...taskParams };
    try {
        const response = await axios.get(API, { params });
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { address, startBlock, endBlock } = req.body;
        const transactions = await etherscanGet({
            module: 'account',
            action: 'txlist',
            address,
            startblock: startBlock,
            endblock: endBlock,
            sort: 'asc',
        });

        if (transactions) {
            res.status(200).json({ transactions: transactions.result });
        } else {
            res.status(500).json({ error: 'Failed to fetch transactions' });
        }
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}
