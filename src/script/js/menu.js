document.addEventListener('DOMContentLoaded', () => {
  const produtos = document.querySelector('.produtos');

  produtos.addEventListener('click', (e) => {
    e.stopPropagation();
    produtos.classList.toggle('active');
  });

  document.addEventListener('click', () => {
    produtos.classList.remove('active');
  });
});