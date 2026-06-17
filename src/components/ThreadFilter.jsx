/**
 * components/ThreadFilter.jsx
 * Filter kategori thread menggunakan local state React.
 * Filter dilakukan di sisi client (tidak ada endpoint filter dari API).
 */

import PropTypes from 'prop-types';

function ThreadFilter({ categories, activeCategory, onSelectCategory }) {
  return (
    <div className="thread-filter">
      <span className="thread-filter__label">Filter Kategori:</span>
      <div className="thread-filter__buttons">
        <button
          type="button"
          className={`filter-btn ${activeCategory === '' ? 'filter-btn--active' : ''}`}
          onClick={() => onSelectCategory('')}
        >
          Semua
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`filter-btn ${activeCategory === cat ? 'filter-btn--active' : ''}`}
            onClick={() => onSelectCategory(cat)}
          >
            #
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}

ThreadFilter.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeCategory: PropTypes.string.isRequired,
  onSelectCategory: PropTypes.func.isRequired,
};

export default ThreadFilter;
