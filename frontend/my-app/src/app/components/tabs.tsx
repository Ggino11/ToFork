const tabs = [
    "Offerte", "Pizza", "Burgers & Fast Food", "Sushi", "Ristoranti",
    "Pasta", "Breakfast", "Insalate"
];

interface Props {
    selectedTab: string;
    setSelectedTab: (tab: string) => void;
}

const Tabs = ({ selectedTab, setSelectedTab }: Props) => (
    // Contenitore flessibile e scrollabile orizzontalmente su mobile
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {tabs.map(tab => (
            <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                // Classi condizionali per lo stile attivo/inattivo
                className={`
                    px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap
                    transition-all duration-200 ease-in-out
                    ${selectedTab === tab 
                        ? 'bg-white text-orange-600 shadow-md scale-105' // Stile ATTIVO
                        : 'bg-transparent text-white hover:bg-white/20' // Stile INATTIVO
                    }
                `}
            >
                {tab}
            </button>
        ))}
    </div>
);

export default Tabs;