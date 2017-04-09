export const global = typeof globals !== 'undefined' ? globals : window;
export const Image = global.Image;
export const ImageData = global.ImageData;
export const requestAnimationFrame = global.requestAnimationFrame;
export const cancelAnimationFrame = global.cancelAnimationFrame;
export const performance = global.performance;