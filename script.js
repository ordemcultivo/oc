const canvas = document.querySelector("#signalCanvas");
const form = document.querySelector("#prelaunch");
const statusEl = document.querySelector("#formStatus");
const LEAD_ENDPOINT = "";

function setupSignalCanvas() {
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const colors = ["rgba(249,115,22,0.95)", "rgba(121,214,123,0.9)", "rgba(255,255,255,0.72)"];
  let width = 0;
  let height = 0;
  let points = [];
  let pointer = { x: -1000, y: -1000 };

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = width < 760 ? 34 : 58;
    points = Array.from({ length: count }, (_, index) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      r: index % 7 === 0 ? 2.4 : 1.4,
      color: colors[index % colors.length],
      pulse: Math.random() * Math.PI * 2
    }));
  }

  function drawLines(point, index) {
    for (let nextIndex = index + 1; nextIndex < points.length; nextIndex += 1) {
      const next = points[nextIndex];
      const dx = point.x - next.x;
      const dy = point.y - next.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 148) {
        ctx.strokeStyle = `rgba(255,255,255,${0.16 - distance / 1100})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(next.x, next.y);
        ctx.stroke();
      }
    }
  }

  function tick(time = 0) {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#07111f";
    ctx.fillRect(0, 0, width, height);

    points.forEach((point, index) => {
      if (!reducedMotion) {
        point.x += point.vx;
        point.y += point.vy;

        if (point.x < -10) point.x = width + 10;
        if (point.x > width + 10) point.x = -10;
        if (point.y < -10) point.y = height + 10;
        if (point.y > height + 10) point.y = -10;
      }

      drawLines(point, index);

      const dx = point.x - pointer.x;
      const dy = point.y - pointer.y;
      const nearPointer = Math.sqrt(dx * dx + dy * dy) < 180 ? 1.4 : 1;
      const pulse = reducedMotion ? 1 : 1 + Math.sin(time / 850 + point.pulse) * 0.28;

      ctx.fillStyle = point.color;
      ctx.beginPath();
      ctx.arc(point.x, point.y, point.r * pulse * nearPointer, 0, Math.PI * 2);
      ctx.fill();
    });

    if (!reducedMotion) requestAnimationFrame(tick);
  }

  resize();
  tick();

  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  });
}

function saveLeadLocally(payload) {
  const existing = JSON.parse(localStorage.getItem("oc_prelaunch_leads") || "[]");
  existing.push(payload);
  localStorage.setItem("oc_prelaunch_leads", JSON.stringify(existing));
}

async function submitLead(payload) {
  if (!LEAD_ENDPOINT) {
    saveLeadLocally(payload);
    return;
  }

  const response = await fetch(LEAD_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("Lead endpoint failed");
  }
}

function setupForm() {
  if (!form || !statusEl) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      interest: String(data.get("interest") || "").trim(),
      source: "oc-prelaunch-site",
      createdAt: new Date().toISOString()
    };

    if (!payload.name || !payload.email || !payload.interest) {
      statusEl.textContent = "Preencha nome, e-mail e interesse para entrar na lista.";
      return;
    }

    statusEl.textContent = "Enviando inscrição...";

    try {
      await submitLead(payload);
      form.reset();
      statusEl.textContent = "Inscrição recebida. Você está na lista de pré-lançamento da O.C.";
    } catch (error) {
      statusEl.textContent = "Não consegui enviar agora. Tente novamente em instantes.";
    }
  });
}

setupSignalCanvas();
setupForm();
