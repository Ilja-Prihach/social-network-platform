# Entities

Слой для доменных сущностей по правилам Feature-Sliced Design. Добавлен пример `example-entity` как шаблон минимальной структуры:

```
entities/
└── example-entity/
    ├── index.ts
    ├── lib/
    │   └── formatExampleEntity.ts
    ├── model/
    │   └── types.ts
    └── ui/
        ├── ExampleEntityCard.module.scss
        └── ExampleEntityCard.tsx
```

Скопируйте директорию, переименуйте и адаптируйте данные/разметку под реальную сущность, сохраняя разделение `model/lib/ui`.
