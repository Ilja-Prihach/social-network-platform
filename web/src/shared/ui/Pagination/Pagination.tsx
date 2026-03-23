import React, { useState, useRef, useEffect } from 'react';
import styles from './Pagination.module.scss';

export interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  showItemsPerPageOptions?: boolean;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  onItemsPerPageChange,
  showItemsPerPageOptions = true,
  className = '',
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const itemsPerPageOptions = [10, 20, 30, 50, 100];

  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsSelectOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage <= 4) {
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number' && page !== currentPage) {
      onPageChange(page);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleItemsPerPageChange = (value: number) => {
    if (onItemsPerPageChange) {
      onItemsPerPageChange(value);
      setIsSelectOpen(false);
    }
  };

  const toggleSelect = () => {
    setIsSelectOpen(!isSelectOpen);
  };

  return (
    <div className={`${styles.pagination_container} ${className}`}>
      <div className={styles.pagination_wrapper}>
        <div className={styles.pagination}>
          <button
            className={`${styles.page_button} ${styles.nav_button}`}
            onClick={handlePrevious}
            disabled={currentPage === 1}
            aria-label="Предыдущая страница"
          >
            <svg className={styles.icon} width="14" height="14">
              <use xlinkHref="#arrow-ios-back-outline" />
            </svg>
          </button>

          {getPageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className={styles.ellipsis}>{page}</span>
              ) : (
                <button
                  className={`${styles.page_button} ${page === currentPage ? styles.active : ''}`}
                  onClick={() => handlePageClick(page)}
                  aria-current={page === currentPage ? 'page' : undefined}
                  aria-label={`Страница ${page}`}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}

          <button
            className={`${styles.page_button} ${styles.nav_button}`}
            onClick={handleNext}
            disabled={currentPage === totalPages}
            aria-label="Следующая страница"
          >
            <svg className={styles.icon} width="14" height="14">
              <use xlinkHref="#arrow-ios-forward-outline" />
            </svg>
          </button>
        </div>

        {showItemsPerPageOptions && (
          <div className={styles.items_per_page} ref={selectRef}>
            <span className={styles.items_per_page_label}>Show</span>
            <div className={styles.custom_select}>
              <button
                className={styles.select_button}
                onClick={toggleSelect}
                type="button"
                aria-expanded={isSelectOpen}
                aria-label="Выбрать количество элементов на странице"
              >
                <span className={styles.selected_value}>{itemsPerPage}</span>
                <svg className={styles.select_icon} width="12" height="12">
                  <use xlinkHref={isSelectOpen ? '#arrow-ios-Up' : '#arrow-ios-Down-outline'} />
                </svg>
              </button>

              {isSelectOpen && (
                <div className={styles.select_dropdown}>
                  {itemsPerPageOptions.map((option) => (
                    <button
                      key={option}
                      className={`${styles.select_option} ${option === itemsPerPage ? styles.selected : ''}`}
                      onClick={() => handleItemsPerPageChange(option)}
                      type="button"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <span className={styles.items_per_page_label}>on page</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pagination;
