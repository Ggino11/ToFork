'use client';
import { ReactNode } from "react";
import '../globals.css';
import { useState } from "react";
import Tabs from "../components/Tabs";
import SearchBar from "../components/SearchBar";
import RestaurantList from "../components/RestaurantList";

const RistorantiPage = () => {
    const [selectedTab, setSelectedTab] = useState("");
    const [search, setSearch] = useState("");

    return (
        <main>
            <section className="div-ristorante">
                <h1 className="div-text">
                    Scopri quali sono i ristoranti più amati di Torino
                </h1>
            </section>
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem', margin: '20px 0'}}>
                <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
                <SearchBar value={search} onChange={setSearch} />
            </div>
            <RestaurantList search={search} selectedTab={selectedTab} />
        </main>
    );
};

export default RistorantiPage;
