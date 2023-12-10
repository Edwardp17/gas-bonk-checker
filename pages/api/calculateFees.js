export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { transactions, historicalEthPrices, historicalBonkPrices, currentBonkPrice } = req.body;

        let totalTxnFeeEth = 0, totalTxnFeeUsd = 0, totalBonkCoins = 0;

        transactions.forEach((txn, index) => {
            const txnFeeEth = (parseFloat(txn.gasPrice) / 1e9 * parseFloat(txn.gasUsed)) / 1e9;
            const ethPrice = historicalEthPrices[index];
            const bonkPrice = historicalBonkPrices[index];

            if (ethPrice && bonkPrice) {
                const txnFeeUsd = parseFloat((txnFeeEth * ethPrice).toFixed(2));
                const bonkPurchased = txnFeeUsd / bonkPrice;

                totalTxnFeeEth += txnFeeEth;
                totalTxnFeeUsd += txnFeeUsd;
                totalBonkCoins += bonkPurchased;
            }
        });

        res.status(200).json({
            totalTxnFeeEth,
            totalTxnFeeUsd: parseFloat(totalTxnFeeUsd.toFixed(2)),
            totalBonkCoins: parseFloat(totalBonkCoins.toFixed(2)),
            totalBonkUsd: parseFloat((currentBonkPrice * totalBonkCoins).toFixed(2))
        });
    } else {
        res.status(405).end();
    }
}
