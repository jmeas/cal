// The `data-hook` attribute provides a way to access nodes without
// relying on IDs or Classes. This prevents any confusion when it
// comes to what's used for styling and what's used in the JavaScript app
export default function(hook) {
  return document.querySelector(`[data-hook="${hook}"]`);
}
