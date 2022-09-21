export function notification(message, type) {
  const style = type === "error" ? "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(255,0,10,0.5777661406359419) 61%)" : "linear-gradient(90deg, rgba(18,255,0,0.5301470930168943) 63%, rgba(207,207,209,1) 100%);"
  Toastify({
    text: message,
    style: {
      background: style
    },
    classname: "error-300"
  }).showToast();
}