function addItem(inputId, listId, dataListId, inputName) {
    const input = document.getElementById(inputId);
    const list = document.getElementById(listId);
    const itemName = input.value;
    const itemOption = document.querySelector(`#${dataListId} option[value="${itemName}"]`);
    
    if (!itemOption) {
        // alert('Please select a valid item from the list.');
        return; // Exits the function if the item is not valid
    }

    const itemId = itemOption.dataset.id;

    // Check if the item is already selected
    if (document.querySelector(`#${listId} input[value="${itemId}"]`)) {
        // alert('This item is already selected.');
        return; // Exits the function if the item is already selected
    }

    if (itemName && itemId)  {
        const li = document.createElement('li');
        li.textContent = itemName;
        const button = document.createElement('button');
        button.textContent = 'x';
        button.onclick = () => li.remove();
        li.appendChild(button);

        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = inputName;
        hiddenInput.value = itemId;
        li.appendChild(hiddenInput);

        list.appendChild(li);
        input.value = '';
    }
}