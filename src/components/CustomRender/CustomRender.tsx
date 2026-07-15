import React, { useEffect, useRef } from "react";

interface CustomRenderProps {
  html?: string;
  css?: string;
  js?: string;
  postId: string;
}

export const CustomRender: React.FC<CustomRenderProps> = ({ html, css, js, postId }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Check if browser supports shadow DOM
    if (!containerRef.current.attachShadow) {
      // Fallback if shadow DOM is not supported
      containerRef.current.innerHTML = `
        <style>${css || ""}</style>
        <div>${html || ""}</div>
      `;
      if (js) {
        try {
          const runner = new Function(js);
          runner();
        } catch (e) {
          console.error("Error executing fallback JS:", e);
        }
      }
      return;
    }

    // Set up Shadow Root
    let shadowRoot = containerRef.current.shadowRoot;
    if (!shadowRoot) {
      shadowRoot = containerRef.current.attachShadow({ mode: "open" });
    } else {
      shadowRoot.innerHTML = "";
    }

    // Create a container inside shadow DOM
    const wrapper = document.createElement("div");
    wrapper.id = "custom-content-wrapper";
    wrapper.style.width = "100%";
    wrapper.style.fontFamily = "inherit";

    // Inject Scoped CSS
    if (css) {
      const styleTag = document.createElement("style");
      styleTag.textContent = css;
      shadowRoot.appendChild(styleTag);
    }

    // Inject HTML
    wrapper.innerHTML = html || "";
    shadowRoot.appendChild(wrapper);

    // Execute Custom JS inside the shadow DOM scope
    if (js && js.trim()) {
      try {
        // Create a Proxy for document to redirect queries to Shadow DOM
        const documentProxy = new Proxy(window.document, {
          get(target, prop, receiver) {
            if (prop === "getElementById") {
              return (id: string) => shadowRoot!.getElementById(id) || target.getElementById(id);
            }
            if (prop === "querySelector") {
              return (selector: string) => shadowRoot!.querySelector(selector) || target.querySelector(selector);
            }
            if (prop === "querySelectorAll") {
              return (selector: string) => {
                const shadowResults = shadowRoot!.querySelectorAll(selector);
                return shadowResults.length > 0 ? shadowResults : target.querySelectorAll(selector);
              };
            }
            if (prop === "getElementsByClassName") {
              return (className: string) => {
                const shadowResults = shadowRoot!.querySelectorAll("." + className);
                return shadowResults.length > 0 ? shadowResults : target.getElementsByClassName(className);
              };
            }
            if (prop === "getElementsByTagName") {
              return (tagName: string) => {
                const shadowResults = shadowRoot!.querySelectorAll(tagName);
                return shadowResults.length > 0 ? shadowResults : target.getElementsByTagName(tagName);
              };
            }
            
            const value = Reflect.get(target, prop, receiver);
            if (typeof value === "function") {
              return value.bind(target);
            }
            return value;
          }
        });

        const executeScript = new Function(
          "document",
          "container",
          `
            try {
              ${js}
            } catch (err) {
              console.error("Lỗi chạy script tùy chỉnh của bài viết [${postId}]:", err);
            }
          `
        );
        
        // Delay execution slightly to ensure elements are mounted inside Shadow DOM
        const timeoutId = setTimeout(() => {
          executeScript(documentProxy, wrapper);
        }, 80);

        return () => clearTimeout(timeoutId);
      } catch (err) {
        console.error("Lỗi khởi tạo script tùy chỉnh:", err);
      }
    }
  }, [html, css, js, postId]);

  // If there's no custom code, render nothing
  if (!html && !css && !js) return null;

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: "100%", 
        marginTop: "24px",
        marginBottom: "16px",
        borderRadius: "12px",
        overflow: "hidden" 
      }} 
      data-post-id={postId}
    />
  );
};
