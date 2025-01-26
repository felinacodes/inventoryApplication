function togglePasswordPrompt() {
    const passwordPrompt = document.getElementById('passwordPrompt');
    if (passwordPrompt.style.display === 'block') {
        passwordPrompt.style.display = 'none';
    } else {
        passwordPrompt.style.display = 'block';
    }
}