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

  // ===== Hitung kecepatan sudut per hari =====
  function angularSpeed(period) {
    return 360 / period;
  }

  // ===== Set posisi planet =====
  function setPlanetAngle(orbit, angle) {
    const planet = orbit.querySelector(".planet");
    if (planet) {
      planet.style.transform = `rotate(${angle}deg) translateX(var(--r))`;
    }
  }

  // ===== Loop utama animasi =====
  function update() {
    if (playing) {
      simDay += simSpeed * 0.6; // percepatan waktu simulasi
      orbits.forEach((orbit) => {
        const period = parseFloat(orbit.style.getPropertyValue("--period")) || 365;
        const angle = (simDay * angularSpeed(period)) % 360;
        setPlanetAngle(orbit, angle);
      });
      timeInput.value = simDay % 365; // sinkron slider waktu
    }
    requestAnimationFrame(update);
  }
  update();

  // ===== Tombol Play / Pause =====
  playBtn.addEventListener("click", () => {
    playing = !playing;
    playBtn.textContent = playing ? "Jeda" : "Putar";
    playBtn.setAttribute("aria-pressed", playing);
  });

  // ===== Slider kecepatan =====
  speedInput.addEventListener("input", (e) => {
    simSpeed = parseFloat(e.target.value);
  });

  // ===== Slider waktu manual =====
  timeInput.addEventListener("input", (e) => {
    simDay = parseFloat(e.target.value);
    orbits.forEach((orbit) => {
      const period = parseFloat(orbit.style.getPropertyValue("--period")) || 365;
      const angle = (simDay * angularSpeed(period)) % 360;
      setPlanetAngle(orbit, angle);
    });
  });

  // ===== Tampilkan info planet =====
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

  // ===== Klik planet =====
  document.querySelectorAll(".planet").forEach((planet) => {
    planet.addEventListener("click", (e) => {
      e.stopPropagation();
      showInfo(planet);
    });
  });

  // ===== Klik luar planet (reset info) =====
  scene.addEventListener("click", (e) => {
    if (e.target === scene) {
      panelTitle.textContent = "Pilih sebuah planet";
      planetData.innerHTML = "<dd>Klik salah satu planet untuk melihat detailnya.</dd>";
      document.querySelectorAll(".planet").forEach((p) => p.classList.remove("selected"));
    }
  });

  // ===== Responsif: skala otomatis sesuai lebar layar =====
  function resizeScene() {
    const width = window.innerWidth;
    const scale = Math.min(width / 900, 1);
    scene.style.transform = `scale(${scale})`;
    scene.style.transformOrigin = "top center";
  }

  window.addEventListener("resize", resizeScene);
  resizeScene();

  // ===== Default panel kosong =====
  panelTitle.textContent = "Pilih sebuah planet";
  planetData.innerHTML = "<dd>Klik salah satu planet di tata surya untuk melihat detailnya.</dd>";
});
