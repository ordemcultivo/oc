(() => {
  const form = document.querySelector('.lead-form');
  if (!form) return;
  form.addEventListener('submit', event => {
    event.preventDefault();
    const priority = form.elements.priority.value;
    const context = form.elements.context.value.trim();
    const message = `Olá, quero conversar com a OC sobre ${form.dataset.service}.\nMinha prioridade: ${priority}.${context ? `\nContexto: ${context}` : ''}`;
    window.location.assign(`https://wa.me/5547991653962?text=${encodeURIComponent(message)}`);
  });
})();
