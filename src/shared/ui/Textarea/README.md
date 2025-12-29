Чтобы использоваться компонент <Textarea>, надо добавить на странице:

const [text, setText] = useState('');

// Функции для обработки ошибок
// не стал заносить логику обработки ошибок в саму компоненту так как логика
// обработки может быть разной
const getErrorMessage = (value: string): string | undefined => {
if (value.length > 0 && value.length < 10) {
return 'Минимальная длина 10 символов';
}
if (value.length > 30) {
return 'Максимальная длина 30 символов';
}
return undefined;
};

const hasError = (value: string): boolean => {
return (value.length > 0 && value.length < 10) || value.length > 30;
};

// Пример использвания:
// из обязательных пропсов только label
<Textarea
label="Text-area"
placeholder="Text-area"
value={text}
onChange={(e) => setText(e.target.value)}
error={hasError(text)}
errorMessage={getErrorMessage(text)}
/>
