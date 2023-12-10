const ccxt = require('ccxt');

async function getCurrentPrice(pair, exchange) {
    try {
        const ticker = await exchange.fetchTicker(pair);
        return ticker.last;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { pair} = req.body; // Trading pair, e.g., 'ETH/USDT'
        const exchange = new ccxt.mexc();

        const price = await getCurrentPrice(pair, exchange);

        if (price !== null) {
            res.status(200).json({ currentPrice: price });
        } else {
            res.status(500).json({ error: 'Failed to fetch current price' });
        }
    } else {
        res.status(405).end();
    }
}
