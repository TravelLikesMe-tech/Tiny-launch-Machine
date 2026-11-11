/* =========================================================
   Tiny Launch Machine — main.js
   ========================================================= */

/* ---------------------------------------------------------
   TODO: Rakesh — set the query form endpoint here (ONE place).

   Options:
   - Formspree:  "https://formspree.io/f/xxxxxxx"  (create a form at formspree.io,
                 point it to contact@travellikesme.com, paste the endpoint here)
   - Netlify:    "netlify"   (only if the site is hosted on Netlify; turn on
                 Forms in the Netlify dashboard, submissions arrive there)
   - Empty "":   no backend yet. The form opens the visitor's email app with
                 the message filled in, addressed to FALLBACK_EMAIL.
   --------------------------------------------------------- */
const FORM_ENDPOINT = "netlify";
const FALLBACK_EMAIL = "contact@travellikesme.com";

(function () {
  "use strict";

  /* ---------- footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------- logo / "Back to top": #top is the sticky header, so scroll the page itself ---------- */
  document.querySelectorAll('a[href="#top"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0 });
      if (history.replaceState) history.replaceState(null, "", location.pathname + location.search);
    });
  });

  /* ---------- in-page links: jump straight to the target and re-check once.
     Long smooth scrolls get cut short while lazy images / the calendar load. ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    var id = link.getAttribute("href").slice(1);
    if (!id || id === "top") return;
    link.addEventListener("click", function (e) {
      var target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      var go = function () { target.scrollIntoView({ behavior: "instant", block: "start" }); };
      go();
      setTimeout(go, 500);
      if (history.replaceState) history.replaceState(null, "", "#" + id);
      if (id === "query") {
        var first = document.getElementById("f-name");
        if (first) first.focus({ preventScroll: true });
      }
    });
  });

  /* ---------- "Talk about this" links prefill the query form ---------- */
  var msg = document.getElementById("f-msg");
  var lastPrefill = "";
  document.querySelectorAll("[data-topic]").forEach(function (link) {
    link.addEventListener("click", function () {
      if (!msg) return;
      var text = "I'd like to talk about: " + link.getAttribute("data-topic") + ".\n\n";
      if (msg.value.trim() === "" || msg.value === lastPrefill) {
        msg.value = text;
        lastPrefill = text;
      }
    });
  });

  /* ---------- mobile sticky bar: hide while the booking section is on screen ---------- */
  var mbar = document.querySelector(".mbar");
  var book = document.getElementById("book");
  if (mbar && book && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        mbar.classList.toggle("is-hidden", e.isIntersecting);
      });
    }, { threshold: 0.05 }).observe(book);
  }

  /* ---------- query form ---------- */
  var form = document.getElementById("query-form");
  if (!form) return;
  var statusEl = form.querySelector(".form__status");
  var submitBtn = form.querySelector('button[type="submit"]');

  var messages = {
    name: "Please tell me your name.",
    email: "Please add an email I can reply to.",
    stage: "Please pick where you are right now.",
    message: "Please tell me a little about what you want to make."
  };

  function setError(field, text) {
    var wrap = field.closest(".field");
    var err = wrap.querySelector(".err-msg");
    if (text) {
      field.setAttribute("aria-invalid", "true");
      if (!err) {
        err = document.createElement("p");
        err.className = "err-msg";
        err.id = field.id + "-err";
        err.style.margin = "0";
        wrap.appendChild(err);
      }
      err.textContent = text;
      field.setAttribute("aria-describedby", err.id);
    } else {
      field.removeAttribute("aria-invalid");
      field.removeAttribute("aria-describedby");
      if (err) err.remove();
    }
  }

  function validate() {
    var firstBad = null;
    ["name", "email", "stage", "message"].forEach(function (n) {
      var f = form.elements[n];
      var ok = f.value.trim() !== "" && (n !== "email" || f.validity.valid);
      setError(f, ok ? "" : messages[n]);
      if (!ok && !firstBad) firstBad = f;
    });
    if (firstBad) firstBad.focus();
    return !firstBad;
  }

  form.addEventListener("input", function (e) {
    if (e.target.getAttribute("aria-invalid") === "true") setError(e.target, "");
  });

  function setStatus(text, kind) {
    statusEl.textContent = text;
    statusEl.className = "form__status" + (kind ? " is-" + kind : "");
  }

  function mailtoFallback(data) {
    var body =
      "Name: " + data.get("name") + "\n" +
      "Email: " + data.get("email") + "\n" +
      "WhatsApp: " + (data.get("whatsapp") || "-") + "\n" +
      "Stage: " + data.get("stage") + "\n\n" +
      data.get("message");
    window.location.href = "mailto:" + FALLBACK_EMAIL +
      "?subject=" + encodeURIComponent("Tiny Launch Machine query from " + data.get("name")) +
      "&body=" + encodeURIComponent(body);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    setStatus("", "");
    if (!validate()) {
      setStatus("A few things are missing. Please check the fields above.", "err");
      return;
    }

    var data = new FormData(form);
    if (data.get("_gotcha")) return; // bot

    if (!FORM_ENDPOINT) {
      mailtoFallback(data);
      setStatus("Your email app should open with the message ready. If it doesn't, write to " + FALLBACK_EMAIL + ".", "ok");
      return;
    }

    var request;
    if (FORM_ENDPOINT === "netlify") {
      request = fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data).toString()
      });
    } else {
      request = fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data
      });
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";

    request
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        form.reset();
        setStatus("Thanks, your query is in. I'll reply to you by email soon.", "ok");
      })
      .catch(function () {
        setStatus("Sorry, that didn't send. Please try again, or email " + FALLBACK_EMAIL + ".", "err");
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send my query";
      });
  });
})();

/* ---------------------------------------------------------
   v3 motion: hero film + line drawings
   - The film plays muted, loops, pauses when off screen or the tab is hidden,
     and has a Pause/Play button (WCAG 2.2.2).
   - Under prefers-reduced-motion the film does not autoplay (poster shows the
     problem statement) and every drawing is shown finished.
   --------------------------------------------------------- */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- hero film ---------- */
  var video = document.querySelector(".hero__video");
  var toggle = document.querySelector(".film-toggle");
  if (video && toggle) {
    var userPaused = reduce.matches;   // reduced motion = start paused
    var onScreen = true;

    function sync() {
      var shouldPlay = !userPaused && onScreen && !document.hidden;
      if (shouldPlay && video.paused) {
        var p = video.play();
        if (p && p.catch) p.catch(function () { /* autoplay blocked: poster stays */ });
      } else if (!shouldPlay && !video.paused) {
        video.pause();
      }
      toggle.textContent = userPaused ? "Play" : "Pause";
      toggle.setAttribute("aria-pressed", String(userPaused));
      toggle.setAttribute("aria-label", userPaused ? "Play the animation" : "Pause the animation");
    }

    toggle.hidden = false;
    toggle.addEventListener("click", function () { userPaused = !userPaused; sync(); });
    document.addEventListener("visibilitychange", sync);
    reduce.addEventListener("change", function () { userPaused = reduce.matches; sync(); });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        onScreen = entries[0].isIntersecting; sync();
      }, { threshold: 0.2 }).observe(video);
    }
    sync();
  }

  /* ---------- line drawings: draw once when they come into view ---------- */
  if (reduce.matches || !("IntersectionObserver" in window)) return;
  document.documentElement.classList.add("js-motion");
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      el.classList.add("is-drawn");
      setTimeout(function () { el.classList.add("is-done"); }, 1600);
      io.unobserve(el);
    });
  }, { threshold: 0.35 });
  document.querySelectorAll("[data-draw]").forEach(function (el) { io.observe(el); });
})();
