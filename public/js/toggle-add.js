function toggleForm(button) {
    const form = button.nextElementSibling;
    const icon = button.querySelector('#toggle-icon');
    if (form && form.classList.contains('add-form')) {
        form.classList.toggle('hidden');
        if(icon) {
            icon.classList.toggle('fa-angle-down');
            icon.classList.toggle('fa-angle-up');
        }
    }
}

// document.addEventListener('DOMContentLoaded', function() {
//     console.log('here');
//     const toggleFormButtons = document.querySelectorAll('.toggle-form-button');
//     toggleFormButtons.forEach(button => {
//         button.addEventListener('click', function() {
//             toggleForm(this);
//         });
//     });
// });