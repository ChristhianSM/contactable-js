export function input({
  label,
  id,
  name,
  placeholder = "",
  type,
  required = false,
  value = false,
  focus = false,
  error = ""
}) {
  return `
  <div class="container-input">
    <input
      type="${type ? type : "text"}"
      placeholder="${placeholder}"
      class="inputs ${error ? "input-error" : ""}"
      id="${id}"
      name="${name ? name : id}"
      ${value ? `value="${value}"` : ""}
      ${required ? "required" : ""}
      autofocus = ${focus}
      autocomplete="off"
    />
    ${error ? `<p class = "error-300"> ${error} </p>` : ""}
    
  </div>

  `;
}
