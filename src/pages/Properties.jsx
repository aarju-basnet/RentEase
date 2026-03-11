/**
 * Properties Page
 *
 * Displays all available rental properties in a responsive grid.
 * Includes a SearchBar for client-side filtering by:
 *   - Location (text match)
 *   - Price range (min/max)
 *   - Property type
 *
 * Uses URL search params to pre-fill filters when navigating from Home.
 */

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import SearchBar from '../components/SearchBar';
import { mockProperties } from '../services/api';

const Properties = () => {
  const [searchParams] = useSearchParams();

  // Initialize filters from URL search params (passed from Home page search)
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    type: searchParams.get('type') || '',
  });

  // Filtered properties list
  const [properties, setProperties] = useState(mockProperties);

  // Apply filters whenever the filter state changes
  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update a single filter field
  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Apply all active filters to the mock properties list.
   * Filters by location (case-insensitive substring), price range, and type.
   */
  const applyFilters = () => {
    let result = [...mockProperties];

    // Filter by location
    if (filters.location.trim()) {
      result = result.filter((p) =>
        p.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Filter by minimum price
    if (filters.minPrice) {
      result = result.filter((p) => p.price >= Number(filters.minPrice));
    }

    // Filter by maximum price
    if (filters.maxPrice) {
      result = result.filter((p) => p.price <= Number(filters.maxPrice));
    }

    // Filter by property type
    if (filters.type) {
      result = result.filter((p) => p.type === filters.type);
    }

    setProperties(result);
  };

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <h1>Browse Properties</h1>
        <p>Find your ideal rental from our curated collection</p>
      </div>

      {/* Search / Filter Bar (overlaps page header) */}
      <div className="container">
        <SearchBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={applyFilters}
        />
      </div>

      {/* Property Cards Grid */}
      <section className="section">
        <div className="container">
          {properties.length > 0 ? (
            <div className="property-grid">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <h3>No properties found</h3>
              <p>Try adjusting your search filters to find what you're looking for.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Properties;
