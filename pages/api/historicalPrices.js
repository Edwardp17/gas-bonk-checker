const ccxt = require('ccxt');

async function getHistoricalPrice(unixTsMs, pair, exchange) {
    try {
        const price = await exchange.fetchOHLCV(pair, '1m', unixTsMs, 1);
        return price[0][1]; // Return the closing price
    } catch (error) {
        console.error(error);
        return null;
    }
}

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { timestamps, pair} = req.body; // Array of timestamps

        const exchange = new ccxt.mexc();
        const prices = await Promise.all(
            timestamps.map(timestamp => getHistoricalPrice(timestamp * 1000, pair, exchange))
        );

        res.status(200).json({ prices });
    } else {
        res.status(405).end();
    }
}
