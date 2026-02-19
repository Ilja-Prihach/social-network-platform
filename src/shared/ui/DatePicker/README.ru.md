# DatePicker: полная инструкция (RU)

`DatePicker` из `src/shared/ui/DatePicker/DatePicker.tsx` — контролируемый UI-компонент выбора даты.
Он поддерживает:

- `range` (по умолчанию): выбор периода `start + end`;
- `single`: выбор одной даты (`end` всегда `null`).

## Импорт

```tsx
import { DatePicker } from '@/shared/ui/DatePicker';
```

## Типы

```ts
type DateRange = {
  start: Date | null;
  end: Date | null;
};

type DatePreset = {
  label: string;
  value: DateRange;
};
```

## Быстрый старт

```tsx
'use client';

import { useState } from 'react';
import { DatePicker } from '@/shared/ui/DatePicker';

type DateRange = {
  start: Date | null;
  end: Date | null;
};

export const Example = () => {
  const [value, set_value] = useState<DateRange>({ start: null, end: null });

  return <DatePicker value={value} onChange={set_value} />;
};
```

## Пропсы

- `label?: string` — подпись над полем. Если не передан:
  - в `range` будет `Date range`;
  - в `single` будет `Date select`.
- `value: DateRange` — текущее значение (обязательно).
- `onChange: (value: DateRange) => void` — обработчик изменения (обязательно).
- `selectionMode?: 'range' | 'single'` — режим выбора, по умолчанию `range`.
- `disabled?: boolean` — блокирует открытие и выбор.
- `error?: string` — текст ошибки под полем.
- `placeholder?: string` — плейсхолдер в закрытом поле, если нет выбранных дат.
- `presets?: DatePreset[]` — список пресетов (кнопки внизу календаря).

## Формат отображения в инпуте

- Одна дата: `dd/mm/yyyy`
- Период: `dd/mm/yyyy - dd/mm/yyyy`
- Если дат нет:
  - используется `placeholder`, если передан;
  - иначе дефолт:
    - `dd/mm/yyyy` для `single`;
    - `dd/mm/yyyy - dd/mm/yyyy` для `range`.

## Логика выбора даты

### `selectionMode="range"`

- Первый клик выбирает `start`, `end = null`.
- Второй клик:
  - если выбранная дата раньше `start`, даты автоматически меняются местами;
  - иначе ставится `end`.
- Если период уже полный (`start` и `end` есть), новый клик начинает новый выбор (`start = picked`, `end = null`).
- Попап после выбора не закрывается автоматически.

### `selectionMode="single"`

- При клике всегда устанавливается `{ start: pickedDate, end: null }`.
- Попап закрывается сразу после выбора.

## Пресеты

- Кнопки пресетов отображаются только если `presets.length > 0`.
- В `single` режиме `preset.value.end` игнорируется и принудительно становится `null`.
- Значения из пресета нормализуются до даты без времени (год/месяц/день).

Пример:

```tsx
const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const month_start = new Date(today.getFullYear(), today.getMonth(), 1);
const month_end = new Date(today.getFullYear(), today.getMonth() + 1, 0);

const presets = [
  { label: 'Today', value: { start: today, end: today } },
  {
    label: 'Last 7 days',
    value: {
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6),
      end: today,
    },
  },
  { label: 'This month', value: { start: month_start, end: month_end } },
  { label: 'Clear', value: { start: null, end: null } },
];
```

## Навигация и клавиатура

### Открытие попапа

- `Enter`, `Space`, `ArrowDown` на триггере открывают календарь.
- Клик по триггеру открывает/закрывает календарь.
- Клик вне компонента закрывает попап.

### Управление фокусом в сетке дней

- `ArrowLeft` / `ArrowRight`: -1 / +1 день
- `ArrowUp` / `ArrowDown`: -7 / +7 дней
- `Home` / `End`: начало / конец недели
- `PageUp` / `PageDown`: предыдущий / следующий месяц
- `Enter` / `Space`: выбрать день
- `Escape`: закрыть попап

### Переключение месяцев и годов

- Кнопки стрелок в шапке переключают месяц.
- Клик по заголовку месяца открывает выбор года.
- Список годов строится как диапазон `[текущий год - 100; текущий год + 20]`.
- При открытии списка годов происходит скролл к текущему году.

## Важные особенности реализации

- Компонент использует локаль `en-US` для заголовка месяца (`January 2026`, и т.д.).
- Неделя начинается с понедельника (`Mo ... Su`).
- Время у выбранных дат нормализуется до начала дня для сравнения/выбора.
- Компонент не имеет встроенных ограничений `min/max`, валидации бизнес-правил и таймзонной логики.
  Эти проверки нужно делать снаружи (в родительском компоненте или форме).

## Рекомендуемый паттерн использования

- Храните `value` в состоянии родителя.
- Обновляйте только через `onChange`.
- Ошибки (`error`) и правила валидности рассчитывайте в родителе.
- Для очистки значения передайте `{ start: null, end: null }`.

## Где смотреть живой пример

- `src/pages/feed/ui/DatePickerPreview.tsx` — демонстрация `range`, `single`, `error`, `disabled` и `presets`.
