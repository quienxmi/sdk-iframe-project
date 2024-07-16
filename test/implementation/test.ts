
const form = document.getElementById('formInput') as HTMLFormElement;
const input = document.getElementById('input') as HTMLInputElement;
const submitButton = document.getElementById('submitButton') as HTMLButtonElement;

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const newName = input.value.trim();

    if (newName.length < 3) {
        return;
    }
});

input.addEventListener('input', () => {
    submitButton.disabled = !form.checkValidity();
});