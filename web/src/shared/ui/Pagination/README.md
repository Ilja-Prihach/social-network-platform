Чтобы использоваться компонент <Pagination>, надо добавить на странице:

import { useState } from 'react';
import Pagination from '@/shared/ui/Pagination';

const items = Array.from({ length: 200 }, (\_, index) => ({
id: index + 1,
name: `Элемент ${index + 1}`,
description: `Описание элемента ${index + 1}`,
}));

const [currentPage, setCurrentPage] = useState(6);
const [itemsPerPage, setItemsPerPage] = useState(10);

const startIndex = (currentPage - 1) \* itemsPerPage;
const endIndex = startIndex + itemsPerPage;
const currentItems = items.slice(startIndex, endIndex);

<h1>Пример пагинации с 200 элементами</h1>

      <div style={{ marginBottom: '24px' }}>
        <h2>Элементы на странице {currentPage}:</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          {currentItems.map((item) => (
            <div
              key={item.id}
              style={{
                padding: '16px',
                border: '1px solid var(--dark-100-color)',
                borderRadius: '6px',
                backgroundColor: 'var(--dark-900-color)',
                color: 'var(--light-100-color)',
              }}
            >
              <h3 style={{ marginTop: 0 }}>{item.name}</h3>
              <p style={{ marginBottom: 0, color: 'var(--light-900-color)' }}>{item.description}</p>
            </div>
          ))}
        </div>

        <div style={{ fontSize: '14px', color: 'var(--light-900-color)' }}>
          Показано {startIndex + 1}-{Math.min(endIndex, items.length)} из {items.length} элементов
        </div>
      </div>

      <Pagination
        totalItems={items.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
      />
    </div>
