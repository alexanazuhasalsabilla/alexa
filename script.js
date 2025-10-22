document.addEventListener("DOMContentLoaded", () => {
  const playBtn = document.getElementById("playPause");
  const speedInput = document.getElementById("speed");
  const timeInput = document.getElementById("time");
  const panelTitle = document.getElementById("panelTitle");
  const planetData = document.getElementById("planetData");
  const scene = document.getElementById("scene");
  const orbits = document.querySelectorAll(".orbit");

  let playing = true;
  let simSpeed = 1;
  let simDay = 0;
  let lastTime = null;

  function angularSpeed(period) {
    return 360 / period;
  }

  function setPlanetAngle(orbit, angle) {
    orbit.style.transform = `rotate(${angle}deg)`;
  }

  // ====== Loop utama animasi ======
  function update(timestamp) {
    if (playing) {
      if (!lastTime) lastTime = timestamp;
      const delta = (timestamp - lastTime) / 1000; // detik
      lastTime = timestamp;

      simDay = (simDay + simSpeed * delta * 50) % 365;

      orbits.forEach((orbit) => {
        const period = parseFloat(orbit.dataset.period) || 365;
        const angle = (simDay * angularSpeed(period)) % 360;
        setPlanetAngle(orbit, angle);
      });

      timeInput.value = simDay;
    }
    requestAnimationFrame(update);
  }
  requestAnimationFrame(update);

  playBtn.addEventListener("click", () => {
    playing = !playing;
    playBtn.textContent = playing ? "Jeda" : "Putar";
    playBtn.setAttribute("aria-pressed", playing);
  });

  speedInput.addEventListener("input", (e) => {
    simSpeed = parseFloat(e.target.value);
  });

  timeInput.addEventListener("input", (e) => {
    simDay = parseFloat(e.target.value);
    orbits.forEach((orbit) => {
      const period = parseFloat(orbit.dataset.period) || 365;
      const angle = (simDay * angularSpeed(period)) % 360;
      setPlanetAngle(orbit, angle);
    });
  });

  function showInfo(planet) {
    const name = planet.dataset.name;
    const radius = planet.dataset.radius;
    const descId = planet.dataset.descId;
    const descEl = descId ? document.getElementById(descId) : null;
    const desc = descEl ? descEl.textContent : "";

    panelTitle.textContent = name;
    planetData.innerHTML = `
      <dt>Radius (km)</dt><dd>${radius}</dd>
      <dt>Deskripsi</dt><dd>${desc}</dd>
    `;

    document.querySelectorAll(".planet").forEach((p) => p.classList.remove("selected"));
    planet.classList.add("selected");
  }

  document.querySelectorAll(".planet").forEach((planet) => {
    planet.addEventListener("click", (e) => {
      e.stopPropagation();
      showInfo(planet);
    });
  });

  scene.addEventListener("click", (e) => {
    if (e.target === scene) {
      panelTitle.textContent = "Pilih sebuah planet";
      planetData.innerHTML = "<dd>Klik salah satu planet untuk melihat detailnya.</dd>";
      document.querySelectorAll(".planet").forEach((p) => p.classList.remove("selected"));
    }
  });

  function resizeScene() {
    const scale = Math.min(window.innerWidth / 900, 1);
    scene.style.transform = `scale(${scale})`;
    scene.style.transformOrigin = "top center";
  }

  window.addEventListener("resize", resizeScene);
  resizeScene();

  panelTitle.textContent = "Pilih sebuah planet";
  planetData.innerHTML = "<dd>Klik salah satu planet di tata surya untuk melihat detailnya.</dd>";
});

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && document.activeElement !== speedInput && document.activeElement !== timeInput) {
    e.preventDefault();
    playBtn.click();
  }
});

const light = document.getElementById("statusLight");
playBtn.addEventListener("click", () => {
  playing = !playing;
  playBtn.textContent = playing ? "Jeda" : "Putar";
  playBtn.setAttribute("aria-pressed", playing);
  light.classList.toggle("off", !playing);
});
