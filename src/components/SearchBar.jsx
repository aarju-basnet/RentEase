/**
 * SearchBar Component
 *
 * Filter bar for searching properties by location, price range (NPR),
 * and property type (Room / Apartment).
 */

const SearchBar = ({ filters, onFilterChange, onSearch, className = '' }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form className={`search-bar ${className}`} onSubmit={handleSubmit}>
      {/* Location */}
      <div className="search-field">
        <label htmlFor="search-location">Location</label>
        <input
          id="search-location"
          type="text"
          name="location"
          placeholder="e.g. Kathmandu"
          value={filters.location}
          onChange={handleChange}
        />
      </div>

      {/* Min Price */}
      <div className="search-field">
        <label htmlFor="search-minPrice">Min Price (NPR)</label>
        <input
          id="search-minPrice"
          type="number"
          name="minPrice"
          placeholder="NPR 0"
          value={filters.minPrice}
          onChange={handleChange}
        />
      </div>

      {/* Max Price */}
      <div className="search-field">
        <label htmlFor="search-maxPrice">Max Price (NPR)</label>
        <input
          id="search-maxPrice"
          type="number"
          name="maxPrice"
          placeholder="NPR 100,000"
          value={filters.maxPrice}
          onChange={handleChange}
        />
      </div>

      {/* Type */}
      <div className="search-field">
        <label htmlFor="search-type">Type</label>
        <select
          id="search-type"
          name="type"
          value={filters.type}
          onChange={handleChange}
        >
          <option value="">All</option>
          <option value="Apartment">Apartment</option>
          <option value="Room">Room</option>
        </select>
      </div>

      {/* Search Button */}
      <button type="submit" className="btn btn-accent">
        🔍 Search
      </button>
    </form>
  );
};

export default SearchBar;
