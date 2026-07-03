"use client";

import React, { useEffect, useState } from "react";

export const GlobalInjector: React.FC = () => {
  const [globalHtml, setGlobalHtml] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadGlobalCode = async () => {
      try {
        const res = await fetch("/api/global-code");
        if (res.ok) {
          const data = await res.json();
          const { html, css, js } = data;

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
        }
      } catch (e) {
        console.error("Lỗi nạp cấu hình toàn trang từ API:", e);
      }
    };

    loadGlobalCode();

    // Poll global config every 6 seconds to capture live updates
    const interval = setInterval(loadGlobalCode, 6000);

    return () => {
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
