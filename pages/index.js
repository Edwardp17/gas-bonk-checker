import Head from 'next/head';
import React, { useState } from 'react';
import styles from '../styles/Home.module.css';
import ccxt from 'ccxt';

const HomePage = () => {
    const [address, setAddress] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [results, setResults] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Check if all fields are filled out
        if (!address || !startDate || !endDate) {
            setResults("Invalid request: All fields are required.");
            setIsLoading(false);
            return;
        }

        // Convert dates to Date objects for comparison
        const startDt = new Date(startDate);
        let endDt = new Date(endDate);
        const today = new Date();

        // Check if endDate is greater than today and adjust if necessary
        if (endDt > today) {
            endDt = today;
        }

        // Check if startDate is greater than or equal to endDate
        if (startDt >= endDt) {
            setResults("Invalid request: Start date cannot be equal to or after end date.");
            setIsLoading(false);
            return;
        }

        try {
            // Fetch block numbers
            const blockResponse = await fetch('/api/blocks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ startDt, endDt })
            });
            const blockData = await blockResponse.json();

            // Fetch transactions
            const txnResponse = await fetch('/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    address, 
                    startBlock: blockData.startBlock, 
                    endBlock: blockData.endBlock 
                })
            });
            const txnData = await txnResponse.json();
            const timestamps = txnData.transactions.map(txn => txn.timeStamp);

            // Fetch historical ETH/USDT prices
            const ethPriceResponse = await fetch('/api/historicalPrices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ timestamps, pair:'ETH/USDT'})
            });
            const ethPriceData = await ethPriceResponse.json();

            // Fetch historical BONK/USDT prices
            const bonkPriceResponse = await fetch('/api/historicalPrices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ timestamps, pair:'BONK/USDT'})
            });
            const bonkPriceData = await bonkPriceResponse.json();

            // Fetch current BONK/USDT price
            const currentBonkPriceResponse = await fetch('/api/currentPrice', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pair:'BONK/USDT'})
            });
            const currentBonkPriceData = await currentBonkPriceResponse.json();

            // Calculate fees and potential coins
            const calculateFeesResponse = await fetch('/api/calculateFees', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    transactions: txnData.transactions,
                    historicalEthPrices: ethPriceData.prices,
                    historicalBonkPrices: bonkPriceData.prices,
                    currentBonkPrice: currentBonkPriceData.currentPrice
                })
            });
            const calculateFeesData = await calculateFeesResponse.json();

            // Format and set results
            const formattedResult = `You spent ${calculateFeesData.totalTxnFeeEth} ETH or $${calculateFeesData.totalTxnFeeUsd} USD on gas. Meanwhile, you could have bought ${calculateFeesData.totalBonkCoins} BONK which today would be worth...........${calculateFeesData.totalBonkUsd} USD.`;
            setResults(formattedResult);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <>
            <Head>
                <link rel="icon" href="/bonk_gas.jpeg" />
                <title>ETH Gas Calculator</title>
            </Head>
            <div className={styles.imageContainer}>
                <img src="/bonk_gas.jpeg" alt="Bonk Gas" className={styles.bonkImage} />
            </div>
            <div className={styles.mainContainer}>
                <div className={styles.formContainer}>
                    <h1 className={styles.heading}>You couldve bought a coin with no soul</h1>
                    <h4 className={styles.subHeading}>What if you bought BONK with all of your ETH gas instead of well, throwing that money away?</h4>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <label className={styles.label} htmlFor="address">ETH Address:</label>
                        <input type="text" id="address" className={styles.inputText} value={address} onChange={(e) => setAddress(e.target.value)} />
                        
                        <label className={styles.label} htmlFor="startDate">Start Date:</label>
                        <input type="date" id="startDate" min="2023-01-05" className={styles.inputDate} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        
                        <label className={styles.label} htmlFor="endDate">End Date:</label>
                        <input type="date" id="endDate" className={styles.inputDate} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        
                        <input type="submit" className={styles.inputSubmit} value="Calculate" />
                    </form>
                    {isLoading && (
                        <div className={styles.spinner}>
                            <img src="/bonk.jpeg" alt="Loading..." className={styles.spinnerImage} />
                        </div>
                    )}
                    <div className={styles.resultsContainer}>
                        <pre className={styles.results}>{results}</pre>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomePage;
