"use client";
import { useEffect, useRef } from "react";

/**
 * iyzico'nun ödeme formunu sayfaya yerleştirir. Backend'in döndürdüğü {@code checkoutFormContent}
 * bir <script> bloğudur; innerHTML ile eklenen script çalışmadığı için içeriği yeni bir script
 * elemanına kopyalanır. Kart bilgisi iyzico'nun formuna girilir, bize hiç gelmez.
 */
export default function IyzicoCheckoutForm({ content }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!content) return undefined;
    // Form aynı sayfada ikinci kez açılırsa iyzico'nun "zaten yüklendi" kontrolü yeniden kurulmayı engeller.
    for (const key of Object.keys(window)) {
      if (key.startsWith("iyzi")) window[key] = undefined;
    }
    const template = document.createElement("div");
    template.innerHTML = content;
    const added = [];
    template.querySelectorAll("script").forEach((source) => {
      const script = document.createElement("script");
      for (const attr of source.attributes) script.setAttribute(attr.name, attr.value);
      script.text = source.textContent;
      document.body.appendChild(script);
      added.push(script);
    });
    const container = containerRef.current;
    return () => {
      added.forEach((script) => script.remove());
      if (container) container.innerHTML = "";
    };
  }, [content]);

  return <div id="iyzipay-checkout-form" ref={containerRef} className="responsive min-h-[420px]" />;
}
