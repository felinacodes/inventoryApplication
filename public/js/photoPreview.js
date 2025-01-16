document.addEventListener('DOMContentLoaded', () => {
    const photoInput = document.getElementById('photo');
    const photoPreview = document.getElementById('photoPreview');

    photoInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                photoPreview.src = e.target.result; // Set the preview image source
            };
            reader.readAsDataURL(file); // Read the file as a data URL
        } else {
            // If no file is selected, revert to the default or existing photo
            photoPreview.src = photoPreview.dataset.defaultSrc;
        }
    });
});