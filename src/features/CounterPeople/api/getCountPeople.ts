// frontend/src/features/CounterPeople/api/getCountPeople.ts

export interface CountPeopleResponse {
  totalCount: number;
  // Могут быть и другие поля в ответе, если нужно можно добавить
}

export const getCountPeople = async (): Promise<number> => {
  try {
    const response = await fetch('https://socialnetwork-ai.com/api/v1/public-user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Добавьте другие заголовки если нужны (например, авторизацию)
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: CountPeopleResponse = await response.json();

    // Возвращаем только totalCount как число
    return data.totalCount;
  } catch (error) {
    console.error('Error fetching count people:', error);
    // В случае ошибки можно вернуть значение по умолчанию или пробросить ошибку дальше
    throw error; // или return 0; если нужно значение по умолчанию
  }
};

// Альтернативная версия с кэшированием (если нужно)
export const getCountPeopleWithCache = async (): Promise<number> => {
  // Здесь можно добавить логику кэширования, например, в localStorage
  // или использовать кэш на уровне HTTP (fetch уже использует кэш по умолчанию)
  return getCountPeople();
};
