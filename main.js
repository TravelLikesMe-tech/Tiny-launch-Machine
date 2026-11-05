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
