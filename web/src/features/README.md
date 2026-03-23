# Features

Этот каталог организует slices по правилам Feature-Sliced Design. Добавлен пример `example-feature` в качестве шаблона минимальной структуры:

```
features/
└── example-feature/
    ├── index.ts
    ├── lib/
    │   └── getExampleMessage.ts
    ├── model/
    │   └── types.ts
    └── ui/
        ├── ExampleFeature.module.scss
        └── ExampleFeature.tsx
```

Скопируйте и переименуйте директорию, замените текст и логику на реальные данные, оставляя разделение `lib/model/ui`.
