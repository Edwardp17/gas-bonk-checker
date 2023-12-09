import Head from 'next/head';
import React, { useState } from 'react';
import styles from '../styles/Home.module.css';

const HomePage = () => {
    const [address, setAddress] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [results, setResults] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address, startDate, endDate })
            });
            const data = await response.json();
            setResults(JSON.stringify(data, null, 2));
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
