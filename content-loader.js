(function () {
  const API = "https://nextstack-admin-dashboard.vercel.app";

  function el(html) {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstChild;
  }

  // ---- Projects ----
  fetch(API + "/api/projects")
    .then((r) => r.json())
    .then((projects) => {
      const container = document.getElementById("projects-gallery");
      if (!container || !Array.isArray(projects) || projects.length === 0) return;
      container.innerHTML = "";
      projects.forEach((p) => {
        const card = el(`
          <div class="project-panel reveal" style="margin-top:24px;">
            <div>
              ${p.featured ? '<div class="status-pill">FEATURED</div>' : ""}
              <h3>${p.title}</h3>
              <p>${p.description || ""}</p>
              <div class="tag-list">
                ${(p.tags || []).map((t) => `<span class="tag">${t}</span>`).join("")}
              </div>
              ${p.live_url ? `<a href="${p.live_url}" class="btn btn-ghost" style="margin-top:16px;display:inline-block;" target="_blank" rel="noopener">View project</a>` : ""}
            </div>
          </div>
        `);
        container.appendChild(card);
      });
    })
    .catch(function () {});

  // ---- Testimonials ----
  fetch(API + "/api/testimonials")
    .then((r) => r.json())
    .then((items) => {
      const container = document.getElementById("testimonials-list");
      if (!container || !Array.isArray(items) || items.length === 0) return;
      container.innerHTML = "";
      items.forEach((t) => {
        const card = el(`
          <div class="reveal" style="background:var(--bg-elev,#12141c);border:1px solid var(--border,#2a2d3a);border-radius:12px;padding:24px;margin-bottom:16px;">
            <p style="font-style:italic;margin-bottom:12px;">"${t.quote}"</p>
            <p class="mono" style="opacity:.7;">— ${t.name}${t.role ? ", " + t.role : ""}</p>
          </div>
        `);
        container.appendChild(card);
      });
    })
    .catch(function () {});

  // ---- Blog ----
  fetch(API + "/api/blog-posts")
    .then((r) => r.json())
    .then((posts) => {
      const container = document.getElementById("blog-list");
      if (!container || !Array.isArray(posts) || posts.length === 0) return;
      container.innerHTML = "";
      posts.forEach((p) => {
        const card = el(`
          <div class="reveal" style="background:var(--bg-elev,#12141c);border:1px solid var(--border,#2a2d3a);border-radius:12px;padding:24px;margin-bottom:16px;">
            <h3 style="margin-bottom:8px;">${p.title}</h3>
            <p style="opacity:.8;">${p.excerpt || ""}</p>
          </div>
        `);
        container.appendChild(card);
      });
    })
    .catch(function () {});
})();
