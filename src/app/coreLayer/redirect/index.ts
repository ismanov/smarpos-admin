export const fullRedirect = function(url?: string) {
  if (!url) {
    return;
  }
  window.location.href = url;
};
