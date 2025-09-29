interface Props {
    value: string;
    onChange: (val: string) => void;
}

const SearchBar = ({ value, onChange }: Props) => (
    <input
        className="search-bar"
        placeholder="Cerca ristorante..."
        value={value}
        onChange={e => onChange(e.target.value)}
    />
);
export default SearchBar;
