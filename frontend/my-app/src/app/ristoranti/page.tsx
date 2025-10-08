'use client';
import { useState } from "react";
import '../globals.css';
import Tabs from "../components/Tabs";
import SearchBar from "../components/SearchBar";
import RestaurantList from "../components/RestaurantList";
import TorinoRestaurantsMap from "@/app/osm/page";
import dynamic from "next/dynamic";
import { useMemo } from "react";

const RistorantiPage = () => {
    const [selectedTab, setSelectedTab] = useState("");
    const [search, setSearch] = useState("");
    const RestaurantMap = useMemo(() => dynamic(
    () => import('../components/Map'), // Assicurati che il percorso sia corretto
    { 
      loading: () => <p style={{textAlign: 'center', marginTop: '20px'}}>Caricamento mappa...</p>,
      ssr: false // Fondamentale: Disabilita il Server-Side Rendering
    }
  ), []);
    return (
        <main className="px-8 sm:px-20 py-20 ">
            
            <section 
                className="relative h-[420px] rounded-lg overflow-hidden my-8 bg-cover bg-center flex items-center justify-center px-4 "
                style={{
    backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.25)), url('/divImg.png')"
}}
            >

                
                <div className="relative">
                    <h1 className="text-4xl md:text-5xl font-bold text-white text-center leading-tight">
                        Scopri quali sono i ristoranti più amati di Torino
                    </h1>
                </div>
            </section>
      
            <div className="my-6 p-3 bg-orange-500 rounded-xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
                <SearchBar value={search} onChange={setSearch} />
            </div>

            <div className="flex flex-col lg:flex-row gap-8 mt-8">
                <div className="w-full lg:w-2/3 flex flex-col gap-6">
                    <RestaurantList search={search} selectedTab={selectedTab} />
                </div>
                <div className="w-full lg:w-1/3">
                    <div className="lg:sticky lg:top-24">
                        <div className="h-[80vh] w-full rounded-2xl overflow-hidden">
                            <RestaurantMap />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default RistorantiPage;