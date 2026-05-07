import "@testing-library/jest-dom";

// jsdom does not implement scrollIntoView
Element.prototype.scrollIntoView = () => {};

// jsdom does not implement matchMedia
Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: () => ({ matches: false }),
});
