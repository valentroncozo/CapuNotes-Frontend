const CHANNEL_NAME = "capunotes_auth";
const STORAGE_FALLBACK_KEY = `${CHANNEL_NAME}_fallback`;

const bc = (typeof BroadcastChannel !== "undefined") ? new BroadcastChannel(CHANNEL_NAME) : null;

export function postBroadcast(message) {
  try {
    if (bc) {
      bc.postMessage(message);
    } else {
      // fallback: write a short-lived signal so other tabs reciban storage event
      localStorage.setItem(STORAGE_FALLBACK_KEY, JSON.stringify({ message, t: Date.now() }));
    }
  } catch (e) {
    // no-op
  }
}

export function subscribeBroadcast(handler) {
  if (bc) {
    const wrapper = (ev) => handler(ev.data);
    bc.addEventListener("message", wrapper);
    return () => bc.removeEventListener("message", wrapper);
  } else {
    // no-op unsubscribe for fallback (storage event used in AuthContext)
    return () => {};
  }
}

export { CHANNEL_NAME, STORAGE_FALLBACK_KEY };