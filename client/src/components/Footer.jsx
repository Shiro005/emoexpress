import React, { useEffect, useState } from "react";
import axios from "axios";

const Footer = () => {
    const [views, setViews] = useState({
        totalViews: 0,
        uniqueViews: 0,
    });

    // Fetch the view data from the backend
    const fetchViews = async () => {
        try {
            const response = await axios.get("https://nither.vercel.app/api/views");
            setViews(response.data);
        } catch (err) {
            console.error("Error fetching view data:", err);
        }
    };

    // Track page view
    const trackView = async () => {
        // Check if the current session has already tracked the user
        if (!sessionStorage.getItem("hasVisited")) {
            try {
                // Mark the user as visited for the current session
                sessionStorage.setItem("hasVisited", "true");

                // Track the view in the backend
                await axios.post("https://nither.vercel.app/api/track-view", {
                    userAgent: navigator.userAgent,
                    timestamp: new Date().toISOString(),
                });
            } catch (err) {
                console.error("Error tracking view:", err);
            }
        }
    };

    useEffect(() => {
        fetchViews();  // Fetch initial view data
        trackView();   // Track the current page visit

        // Set interval to refresh the views count every 10 seconds (or desired interval)
        const interval = setInterval(fetchViews, 10000);
        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);

    return (
        <footer className="bg-gray-800 p-4 fixed bottom-0 w-full">
                <div className="text-blue-400 font-semibold text-sm">
                    <p>Paglo Ki Sankhya {views.totalViews} <span className="text-sm"> version 1.0</span></p>
                </div>
        </footer>
    );
};

export default Footer;
