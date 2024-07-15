document.addEventListener('DOMContentLoaded', () => {
    const dropdownButton = document.querySelector('.dropdown-button');
    const detailedStatus = document.querySelector('.detailed-status');

    dropdownButton.addEventListener('click', () => {
        detailedStatus.style.display = detailedStatus.style.display === 'block' ? 'none' : 'block';
        dropdownButton.classList.toggle('active');
    });
});
