(function () {
  const API = "https://nextstack-admin-dashboard.vercel.app";

  function getSessionId() {
    let id = sessionStorage.getItem("_sid");
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem("_sid", id);
    }
    return id;
  }

  function trackEvent(eventType, metadata) {
    fetch(API + "/api/portfolio-events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({ sessionId: getSessionId(), eventType: eventType, metadata: metadata || {} }),
    }).catch(function () {});
  }

  fetch(API + "/api/visitors", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: getSessionId(),
      entryPage: location.pathname,
      referrer: document.referrer || "direct",
      screenResolution: screen.width + "x" + screen.height,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }),
  }).catch(function () {});

  document.addEventListener("click", function (e) {
    const link = e.target.closest("a");
    if (!link || !link.href) return;
    if (link.href.startsWith("mailto:")) trackEvent("email_click");
  });

  function findField(data, patterns) {
    for (const [key, value] of data.entries()) {
      if (patterns.some((p) => key.toLowerCase().includes(p))) return value;
    }
    return "";
  }

  ["joinForm", "proposeForm"].forEach(function (formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    form.addEventListener("submit", function () {
      const data = new FormData(form);
      fetch(API + "/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          name: findField(data, ["name"]) || "Unknown",
          email: findField(data, ["email"]) || "unknown@unknown.com",
          subject: formId === "joinForm" ? "Join the Club" : "Project Proposal",
          message: findField(data, ["motivation", "desc", "message"]) || "",
        }),
      }).catch(function () {});
      trackEvent("contact_form_submit");
    });
  });
})();
