"use client";

import React, { useEffect, useState } from "react";

export const GlobalInjector: React.FC = () => {
  const [globalHtml, setGlobalHtml] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadGlobalCode = () => {
      const saved = localStorage.getItem("slime_global_code");
      if (saved) {
        try {
          const { html, css, js } = JSON.parse(saved);

          // 1. Handle Global CSS
          let styleTag = document.getElementById("slime-global-css");
          if (css && css.trim()) {
            if (!styleTag) {
              styleTag = document.createElement("style");
              styleTag.id = "slime-global-css";
              document.head.appendChild(styleTag);
            }
            styleTag.textContent = css;
          } else if (styleTag) {
            styleTag.remove();
          }

          // 2. Handle Global HTML
          setGlobalHtml(html || "");

          // 3. Handle Global JS
          let scriptTag = document.getElementById("slime-global-js");
          if (scriptTag) scriptTag.remove(); // Remove old script to execute fresh

          if (js && js.trim()) {
            scriptTag = document.createElement("script");
            scriptTag.id = "slime-global-js";
            scriptTag.textContent = `
              setTimeout(() => {
                try {
                  ${js}
                } catch(e) {
                  console.error("Lỗi thực thi JS toàn trang:", e);
                }
              }, 150);
            `;
            document.body.appendChild(scriptTag);
          }
        } catch (e) {
          console.error("Lỗi giải mã cấu hình toàn trang:", e);
        }
      } else {
        // Clear if not present
        const styleTag = document.getElementById("slime-global-css");
        if (styleTag) styleTag.remove();
        const scriptTag = document.getElementById("slime-global-js");
        if (scriptTag) scriptTag.remove();
        setGlobalHtml("");
      }
    };

    loadGlobalCode();

    // Listen to storage events (so edits in the admin tab apply instantly to the reader tab)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "slime_global_code") {
        loadGlobalCode();
      }
    };

    window.addEventListener("storage", handleStorage);
    // Periodically sync (in case state changes without triggering event in same tab)
    const interval = setInterval(loadGlobalCode, 2000);

    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
      // Clean up tags on unmount
      const styleTag = document.getElementById("slime-global-css");
      if (styleTag) styleTag.remove();
      const scriptTag = document.getElementById("slime-global-js");
      if (scriptTag) scriptTag.remove();
    };
  }, []);

  if (!globalHtml) return null;

  return (
    <div 
      id="slime-global-html-container" 
      dangerouslySetInnerHTML={{ __html: globalHtml }} 
      style={{ display: "contents" }}
    />
  );
};
