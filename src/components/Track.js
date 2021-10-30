const Track = {
  pageview: () => {
    if (typeof gtag !== "undefined") {
      gtag("event", "page_view", {
        page_title: document.title,
      });
    }
  },
  event: (category, action, label) => {
    if (typeof gtag !== "undefined") {
      gtag("event", action, {
        event_category: category,
        event_label: label,
      });
    }
  },
};

export default Track;
