(() => {
  const header=document.querySelector('.oc-header');
  if(!header)return;
  const toggle=header.querySelector('.menu-toggle');
  const links=header.querySelector('#navigation');
  const close=()=>{links.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.textContent='Menu +';};
  toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';links.classList.toggle('open',open);toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'Fechar −':'Menu +';});
  links.querySelectorAll('a').forEach(link=>{
    if(link.origin===location.origin&&link.pathname.replace(/\/$/,'')===location.pathname.replace(/\/$/,'')&&!link.hash)link.setAttribute('aria-current','page');
    link.addEventListener('click',close);
  });
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true'){close();toggle.focus();}});
  document.addEventListener('click',event=>{if(!header.contains(event.target))close();});
  matchMedia('(max-width:1100px)').addEventListener('change',close);
})();
