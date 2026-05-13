if ("serviceWorker" in navigator)
  navigator.serviceWorker.register("/StockNestReact/dev-sw.js?dev-sw", {
    scope: "/StockNestReact/",
    type: "classic",
  });
