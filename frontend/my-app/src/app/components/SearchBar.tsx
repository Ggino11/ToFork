interface Props {
    value: string;
    onChange: (val: string) => void;
}

const SearchBar = ({ value, onChange }: Props) => (
    <div className="w-full sm:w-auto flex-grow sm:flex-grow-0">
        <input
            type="text"
            className="w-full px-4 py-2 text-sm
                       bg-white/10 placeholder-white/60 text-white 
                       border-2 border-transparent rounded-full 
                       transition-all duration-300
                       focus:bg-white/20 focus:border-orange-400 focus:outline-none"
            placeholder="Cerca un ristorante o un piatto..."
            value={value}
            onChange={e => onChange(e.target.value)}
        />
    </div>
);

export default SearchBar;