const tabs = [
    "Offerte", "Pizza", "Burgers & Fast Food", "Sushi", "Ristoranti",
    "Pasta", "Bruschette", "Insalate"
];

interface Props {
    selectedTab: string;
    setSelectedTab: (tab: string) => void;
}

const Tabs = ({ selectedTab, setSelectedTab }: Props) => (
    <div className="tabs-container">
        {tabs.map(tab => (
            <button
                key={tab}
                className={`tab-btn ${tab === selectedTab ? 'active' : ''}`}
                onClick={() => setSelectedTab(tab)}
            >{tab}</button>
        ))}
    </div>
);
export default Tabs;
