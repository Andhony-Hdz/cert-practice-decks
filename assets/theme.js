/* ============================================================
   Light/dark theme toggle — shared by the landing page and
   app/quiz.html. Load this script tag BEFORE theme.css (still in
   <head>) so the saved preference is applied before first paint.
   Any button with [data-theme-toggle] is auto-wired.
   ============================================================ */
(function(){
  var KEY = "site-theme"; // stored value: "light" | "dark" (absent = follow OS)
  var root = document.documentElement;

  function apply(pref){
    if(pref === "light" || pref === "dark") root.setAttribute("data-theme", pref);
    else root.removeAttribute("data-theme");
  }
  var saved = null;
  try{ saved = localStorage.getItem(KEY); }catch(e){}
  apply(saved); // runs immediately, before CSS paints, to avoid a flash of the wrong theme

  function effective(){
    var explicit = root.getAttribute("data-theme");
    if(explicit) return explicit;
    return (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";
  }
  function updateButtons(){
    var eff = effective();
    document.querySelectorAll("[data-theme-toggle]").forEach(function(btn){
      btn.setAttribute("aria-pressed", eff==="dark" ? "true" : "false");
      btn.textContent = eff==="dark" ? "☀ Light" : "☾ Dark";
      btn.title = eff==="dark" ? "Switch to light theme" : "Switch to dark theme";
    });
  }
  function wire(){
    document.querySelectorAll("[data-theme-toggle]").forEach(function(btn){
      btn.onclick = function(){
        var next = effective()==="dark" ? "light" : "dark";
        apply(next);
        try{ localStorage.setItem(KEY, next); }catch(e){}
        updateButtons();
      };
    });
    updateButtons();
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", wire);
  else wire();
})();
