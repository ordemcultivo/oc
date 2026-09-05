(function () {
  'use strict';

  const measurementId = 'G-LF6F1WZBX2';
  const storageKey = 'oc-analytics-consent';
  let tagLoaded = false;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500
  });

  function readChoice() {
    try { return localStorage.getItem(storageKey); } catch (_) { return null; }
  }

  function saveChoice(choice) {
    try { localStorage.setItem(storageKey, choice); } catch (_) {}
  }

  function loadTag() {
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    if (tagLoaded) return;
    tagLoaded = true;
    window.gtag('js', new Date());
    window.gtag('config', measurementId, { anonymize_ip: true });

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(measurementId);
    document.head.appendChild(script);
  }

  const style = document.createElement('style');
  style.textContent = '.oc-consent{position:fixed;z-index:9999;left:50%;bottom:20px;transform:translateX(-50%);width:min(680px,calc(100% - 32px));padding:20px 22px;background:#192c26;color:#f5f4ed;border:1px solid #52675d;box-shadow:0 18px 55px rgba(10,25,20,.28);font:13px/1.55 "Segoe UI",sans-serif}.oc-consent[hidden],.oc-consent-manage[hidden]{display:none}.oc-consent__row{display:flex;align-items:center;justify-content:space-between;gap:24px}.oc-consent p{margin:0;max-width:420px}.oc-consent strong{display:block;margin-bottom:3px;color:#d9ed9a;font-size:14px}.oc-consent__actions{display:flex;gap:9px;flex-shrink:0}.oc-consent button{border:1px solid #d9ed9a;padding:10px 14px;background:transparent;color:#f5f4ed;font:600 12px "Segoe UI",sans-serif;cursor:pointer}.oc-consent .oc-consent__accept{background:#d9ed9a;color:#192c26}.oc-consent-manage{position:fixed;z-index:9998;left:14px;bottom:14px;border:1px solid #aab7ae;background:#f5f4ed;color:#192c26;padding:8px 11px;font:11px "Segoe UI",sans-serif;cursor:pointer;box-shadow:0 5px 18px rgba(10,25,20,.12)}@media(max-width:620px){.oc-consent{bottom:12px;padding:18px}.oc-consent__row{display:block}.oc-consent__actions{margin-top:15px}.oc-consent button{flex:1}}';
  document.head.appendChild(style);

  const panel = document.createElement('aside');
  panel.className = 'oc-consent';
  panel.hidden = true;
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Preferências de métricas');
  panel.innerHTML = '<div class="oc-consent__row"><p><strong>Podemos medir sua visita?</strong>Usamos o Google Analytics para entender o uso do site e melhorar nossas páginas. As métricas só são ativadas com sua autorização.</p><div class="oc-consent__actions"><button type="button" data-choice="denied">Recusar</button><button type="button" class="oc-consent__accept" data-choice="granted">Aceitar métricas</button></div></div>';

  const manage = document.createElement('button');
  manage.type = 'button';
  manage.className = 'oc-consent-manage';
  manage.textContent = 'Preferências de métricas';
  manage.hidden = true;

  function closePanel() {
    panel.hidden = true;
    manage.hidden = false;
  }

  panel.addEventListener('click', function (event) {
    const button = event.target.closest('[data-choice]');
    if (!button) return;
    const choice = button.getAttribute('data-choice');
    saveChoice(choice);
    if (choice === 'granted') loadTag();
    else window.gtag('consent', 'update', { analytics_storage: 'denied' });
    closePanel();
  });

  manage.addEventListener('click', function () {
    manage.hidden = true;
    panel.hidden = false;
    panel.querySelector('button').focus();
  });

  document.body.appendChild(panel);
  document.body.appendChild(manage);

  document.addEventListener('click', function (event) {
    const link = event.target.closest('a[href*="wa.me/"]');
    if (!link || readChoice() !== 'granted') return;
    window.gtag('event', 'generate_lead', {
      method: 'WhatsApp',
      link_url: link.href
    });
  });

  const choice = readChoice();
  if (choice === 'granted') loadTag();
  if (choice) manage.hidden = false;
  else panel.hidden = false;
})();
