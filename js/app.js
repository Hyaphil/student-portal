(function () {
  "use strict";

  const data = PORTAL_DATA;
  const STORAGE = {
    profile: "sp_profile",
    theme: "sp_theme",
    read: "sp_read_announcements",
  };

  // ---------- Helpers ----------
  const $ = (sel) => document.querySelector(sel);
  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const load = (key, fallback) => {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch {
      return fallback;
    }
  };
  const save = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
  };

  const escapeHtml = (str) =>
    String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const formatDate = (iso) =>
    new Date(iso + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const showToast = (msg) => {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => t.classList.remove("show"), 2500);
  };

  // ---------- Student ----------
  let student = { ...data.student, ...load(STORAGE.profile, {}) };
  const fullName = () => `${student.firstName} ${student.lastName}`;
  const initials = () => (student.firstName[0] || "") + (student.lastName[0] || "");

  // ---------- Grades math ----------
  const finalGrade = (g) => Math.round((g.midterm + g.finals) / 2);
  const toPoint = (score) => {
    if (score >= 97) return 4.0;
    if (score >= 93) return 3.75;
    if (score >= 90) return 3.5;
    if (score >= 87) return 3.25;
    if (score >= 84) return 3.0;
    if (score >= 80) return 2.75;
    if (score >= 75) return 2.5;
    return 0;
  };
  const letter = (score) => {
    if (score >= 93) return "A";
    if (score >= 90) return "A-";
    if (score >= 87) return "B+";
    if (score >= 83) return "B";
    if (score >= 80) return "B-";
    if (score >= 75) return "C";
    return "F";
  };
  const computeGpa = (list) => {
    const units = list.reduce((s, g) => s + g.units, 0);
    const pts = list.reduce((s, g) => s + toPoint(finalGrade(g)) * g.units, 0);
    return units ? (pts / units).toFixed(2) : "0.00";
  };
  const semesters = Object.keys(data.grades);
  const currentSem = semesters[0];
  const currentGpa = computeGpa(data.grades[currentSem]);

  // ---------- Header ----------
  function renderHeader() {
    $("#todayDate").textContent = new Date().toLocaleDateString("en-US", {
      weekday: "long", month: "long", day: "numeric", year: "numeric",
    });
    $("#topAvatar").textContent = initials();
    $("#topName").textContent = fullName();
    $("#topId").textContent = student.studentId;
  }

  // ---------- Dashboard ----------
  function renderDashboard() {
    const hour = new Date().getHours();
    const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
    $("#welcomeText").textContent = `${greet}, ${student.firstName}! 👋`;

    $("#statGpa").textContent = currentGpa;
    $("#statCourses").textContent = data.grades[currentSem].length;
    $("#statAttendance").textContent = student.attendance + "%";
    $("#statUnits").textContent = student.unitsEarned;

    const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
    const todays = data.schedule.filter((c) => c.day === todayName);
    $("#todayClasses").innerHTML = todays.length
      ? todays.map((c) => `
          <li class="today-item" style="--accent:${c.color}">
            <div class="today-time">${c.time.split(" - ")[0]}</div>
            <div class="today-info">
              <strong>${c.title}</strong>
              <small>${c.code} · ${c.room} · ${c.instructor}</small>
            </div>
          </li>`).join("")
      : `<li class="empty">🎉 No classes today. Enjoy your day!</li>`;

    const read = load(STORAGE.read, []);
    $("#dashAnnouncements").innerHTML = data.announcements.slice(0, 3).map((a) => `
      <li class="${read.includes(a.id) ? "" : "unread"}">
        <span class="tag tag-${a.category.toLowerCase()}">${a.category}</span>
        <strong>${a.title}</strong>
        <small>${formatDate(a.date)}</small>
      </li>`).join("");

    $("#dashChart").innerHTML = data.grades[currentSem].map((g) => {
      const fg = finalGrade(g);
      return `
        <div class="bar-row">
          <span class="bar-label">${g.code}</span>
          <div class="bar-track"><div class="bar-fill" data-width="${fg}"></div></div>
          <span class="bar-value">${fg}</span>
        </div>`;
    }).join("");

    // animate bars after paint
    requestAnimationFrame(() => {
      document.querySelectorAll(".bar-fill").forEach((b) => (b.style.width = b.dataset.width + "%"));
    });
  }

  // ---------- Schedule ----------
  let selectedDay = DAYS.includes(new Date().toLocaleDateString("en-US", { weekday: "long" }))
    ? new Date().toLocaleDateString("en-US", { weekday: "long" })
    : "Monday";

  function renderSchedule() {
    $("#dayTabs").innerHTML = DAYS.map((d) =>
      `<button class="tab ${d === selectedDay ? "active" : ""}" data-day="${d}">${d.slice(0, 3)}</button>`
    ).join("");

    const classes = data.schedule.filter((c) => c.day === selectedDay);
    $("#scheduleList").innerHTML = classes.length
      ? classes.map((c) => `
          <div class="schedule-item" style="--accent:${c.color}">
            <div class="schedule-time">⏰ ${c.time}</div>
            <div class="schedule-body">
              <h4>${c.title}</h4>
              <p>${c.code} · ${c.instructor}</p>
            </div>
            <div class="schedule-room">📍 ${c.room}</div>
          </div>`).join("")
      : `<p class="empty">No classes scheduled.</p>`;

    // Week overview table
    const courses = [...new Map(data.schedule.map((c) => [c.code, c])).values()];
    $("#weekTable").innerHTML = `
      <thead><tr><th>Course</th>${DAYS.map((d) => `<th>${d.slice(0, 3)}</th>`).join("")}</tr></thead>
      <tbody>
        ${courses.map((c) => `
          <tr>
            <td><span class="dot" style="background:${c.color}"></span>${c.code} — ${c.title}</td>
            ${DAYS.map((d) => {
              const s = data.schedule.find((x) => x.code === c.code && x.day === d);
              return `<td>${s ? `<span class="chip" style="--accent:${c.color}">${s.time}</span>` : "—"}</td>`;
            }).join("")}
          </tr>`).join("")}
      </tbody>`;
  }

  // ---------- Grades ----------
  function renderGrades(sem) {
    const list = data.grades[sem];
    const gpa = computeGpa(list);
    $("#gradesTable").innerHTML = `
      <thead>
        <tr><th>Code</th><th>Course</th><th>Units</th><th>Midterm</th><th>Finals</th><th>Final</th><th>Grade</th><th>Remarks</th></tr>
      </thead>
      <tbody>
        ${list.map((g) => {
          const fg = finalGrade(g);
          const passed = fg >= 75;
          return `
            <tr>
              <td><strong>${g.code}</strong></td>
              <td>${g.title}</td>
              <td>${g.units}</td>
              <td>${g.midterm}</td>
              <td>${g.finals}</td>
              <td><strong>${fg}</strong></td>
              <td><span class="grade-letter">${letter(fg)}</span></td>
              <td><span class="pill ${passed ? "pill-success" : "pill-danger"}">${passed ? "Passed" : "Failed"}</span></td>
            </tr>`;
        }).join("")}
      </tbody>
      <tfoot>
        <tr><td colspan="2">Total Units</td><td>${list.reduce((s, g) => s + g.units, 0)}</td><td colspan="3">Semester GPA</td><td colspan="2"><strong>${gpa}</strong></td></tr>
      </tfoot>`;

    const pct = (parseFloat(gpa) / 4) * 100;
    $("#gpaRing").style.setProperty("--pct", pct);
    $("#gpaRingValue").textContent = gpa;
    $("#gpaStanding").textContent =
      gpa >= 3.5 ? "🏆 Dean's Lister" : gpa >= 3.0 ? "⭐ Good Standing" : "📘 Keep pushing!";
  }

  function setupGrades() {
    const select = $("#semesterSelect");
    select.innerHTML = semesters.map((s) => `<option value="${s}">${s}</option>`).join("");
    select.addEventListener("change", () => renderGrades(select.value));
    renderGrades(currentSem);
  }

  // ---------- Announcements ----------
  function updateBadge() {
    const read = load(STORAGE.read, []);
    const unread = data.announcements.filter((a) => !read.includes(a.id)).length;
    const badge = $("#unreadBadge");
    badge.textContent = unread;
    badge.style.display = unread ? "inline-flex" : "none";
  }

  function renderAnnouncements() {
    const q = $("#annSearch").value.trim().toLowerCase();
    const cat = $("#annFilter").value;
    const read = load(STORAGE.read, []);

    const list = data.announcements.filter((a) =>
      (cat === "all" || a.category === cat) &&
      (a.title.toLowerCase().includes(q) || a.body.toLowerCase().includes(q))
    );

    $("#announcementList").innerHTML = list.length
      ? list.map((a) => `
          <article class="announcement ${read.includes(a.id) ? "" : "unread"}" data-id="${a.id}">
            <div class="announcement-head">
              <span class="tag tag-${a.category.toLowerCase()}">${a.category}</span>
              <small>${formatDate(a.date)} · ${a.author}</small>
            </div>
            <h4>${a.title}</h4>
            <p>${a.body}</p>
            ${read.includes(a.id) ? `<span class="read-label">✓ Read</span>` : `<button class="btn btn-sm mark-read" data-id="${a.id}">Mark as read</button>`}
          </article>`).join("")
      : `<p class="empty">No announcements match your search.</p>`;
  }

  function setupAnnouncements() {
    $("#annSearch").addEventListener("input", renderAnnouncements);
    $("#annFilter").addEventListener("change", renderAnnouncements);
    $("#announcementList").addEventListener("click", (e) => {
      const btn = e.target.closest(".mark-read");
      if (!btn) return;
      const id = Number(btn.dataset.id);
      const read = load(STORAGE.read, []);
      if (!read.includes(id)) read.push(id);
      save(STORAGE.read, read);
      renderAnnouncements();
      renderDashboard();
      updateBadge();
      showToast("Marked as read");
    });
    renderAnnouncements();
    updateBadge();
  }

  // ---------- Profile ----------
  const PROFILE_FIELDS = [
    { key: "firstName", label: "First Name", editable: true },
    { key: "lastName", label: "Last Name", editable: true },
    { key: "studentId", label: "Student ID" },
    { key: "program", label: "Program" },
    { key: "yearLevel", label: "Year Level" },
    { key: "advisor", label: "Academic Advisor" },
    { key: "email", label: "Email", editable: true, type: "email" },
    { key: "phone", label: "Phone", editable: true, type: "tel" },
    { key: "birthday", label: "Birthday", editable: true, type: "date" },
    { key: "address", label: "Address", editable: true },
  ];
  let editing = false;

  function renderProfile() {
    $("#profileAvatar").textContent = initials();
    $("#profileName").textContent = fullName();
    $("#profileProgram").textContent = `${student.program} · ${student.studentId}`;
    $("#profileStatus").textContent = student.status + " Student";
    $("#profileYear").textContent = student.yearLevel.split(" ")[0];
    $("#profileGpa").textContent = currentGpa;
    $("#profileUnits").textContent = student.unitsEarned;

    $("#profileForm").innerHTML = PROFILE_FIELDS.map((f) => `
      <label class="info-item">
        <span>${f.label}</span>
        ${editing && f.editable
          ? `<input class="input" name="${f.key}" type="${f.type || "text"}" value="${escapeHtml(student[f.key])}" required />`
          : `<strong>${escapeHtml(f.type === "date" ? formatDate(student[f.key]) : student[f.key])}</strong>`}
      </label>`).join("") +
      (editing ? `<div class="form-actions"><button type="button" class="btn btn-ghost" id="cancelEdit">Cancel</button><button type="submit" class="btn">Save Changes</button></div>` : "");

    $("#editProfileBtn").style.display = editing ? "none" : "inline-flex";
  }

  function setupProfile() {
    $("#editProfileBtn").addEventListener("click", () => { editing = true; renderProfile(); });
    $("#profileForm").addEventListener("click", (e) => {
      if (e.target.id === "cancelEdit") { editing = false; renderProfile(); }
    });
    $("#profileForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const form = new FormData(e.target);
      const updates = {};
      PROFILE_FIELDS.filter((f) => f.editable).forEach((f) => (updates[f.key] = form.get(f.key).trim()));
      student = { ...student, ...updates };
      save(STORAGE.profile, updates);
      editing = false;
      renderProfile();
      renderHeader();
      renderDashboard();
      showToast("Profile updated successfully");
    });
    renderProfile();
  }

  // ---------- Routing ----------
  const TITLES = {
    dashboard: "Dashboard",
    schedule: "Class Schedule",
    grades: "Grades",
    announcements: "Announcements",
    profile: "Student Profile",
  };

  function route() {
    const page = (location.hash || "#dashboard").slice(1);
    const target = TITLES[page] ? page : "dashboard";
    document.querySelectorAll(".page").forEach((p) => p.classList.toggle("active", p.id === "page-" + target));
    document.querySelectorAll(".nav-link").forEach((l) => l.classList.toggle("active", l.dataset.page === target));
    $("#pageTitle").textContent = TITLES[target];
    document.title = `${TITLES[target]} · Student Portal`;
    closeSidebar();
    window.scrollTo(0, 0);
    if (target === "dashboard") renderDashboard();
  }

  // ---------- Sidebar (mobile) ----------
  function openSidebar() { $("#sidebar").classList.add("open"); $("#overlay").classList.add("show"); }
  function closeSidebar() { $("#sidebar").classList.remove("open"); $("#overlay").classList.remove("show"); }

  // ---------- Theme ----------
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    $("#themeIcon").textContent = theme === "dark" ? "☀️" : "🌙";
    $("#themeLabel").textContent = theme === "dark" ? "Light Mode" : "Dark Mode";
  }

  // ---------- Init ----------
  function init() {
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(load(STORAGE.theme, prefersDark ? "dark" : "light"));
    $("#themeToggle").addEventListener("click", () => {
      const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      save(STORAGE.theme, next);
    });

    $("#menuBtn").addEventListener("click", openSidebar);
    $("#overlay").addEventListener("click", closeSidebar);

    $("#dayTabs").addEventListener("click", (e) => {
      const tab = e.target.closest(".tab");
      if (!tab) return;
      selectedDay = tab.dataset.day;
      renderSchedule();
    });

    renderHeader();
    renderDashboard();
    renderSchedule();
    setupGrades();
    setupAnnouncements();
    setupProfile();

    window.addEventListener("hashchange", route);
    route();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
