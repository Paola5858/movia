/**
 * Escapa caracteres HTML para prevenir XSS ao inserir dados do backend no DOM.
 * @param {*} valor
 * @returns {string}
 */
export function esc(valor) {
  return String(valor ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

/**
 * Exibe uma mensagem de feedback acessível e some após `ms` milissegundos.
 * @param {HTMLElement} el
 * @param {string} mensagem
 * @param {"danger"|"success"|"warning"|"info"} tipo
 * @param {number} ms
 */
export function mostrarFeedback(el, mensagem, tipo = "danger", ms = 4000) {
  el.textContent = mensagem;
  el.className = `alert alert-${tipo} mt-2`;
  el.hidden = false;
  clearTimeout(el._feedbackTimer);
  el._feedbackTimer = setTimeout(() => (el.hidden = true), ms);
}

/**
 * Substitui confirm() nativo por um modal Bootstrap não-bloqueante.
 * Retorna uma Promise<boolean>.
 * @param {string} mensagem
 * @returns {Promise<boolean>}
 */
export function confirmar(mensagem) {
  // se o bootstrap não estiver presente usamos o confirm nativo como fallback
  if (typeof bootstrap === "undefined") {
    return Promise.resolve(window.confirm(String(mensagem)));
  }

  return new Promise((resolve) => {
    const id = "_confirmModal";
    document.getElementById(id)?.remove();

    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
      <div class="modal fade" id="${id}" tabindex="-1" aria-modal="true" role="dialog">
        <div class="modal-dialog modal-sm modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-body py-4 text-center">${esc(mensagem)}</div>
            <div class="modal-footer justify-content-center border-0 pt-0">
              <button id="${id}Nao" class="btn btn-secondary btn-sm">Cancelar</button>
              <button id="${id}Sim" class="btn btn-danger btn-sm">Confirmar</button>
            </div>
          </div>
        </div>
      </div>`;
    document.body.appendChild(wrapper.firstElementChild);

    const modalEl = document.getElementById(id);
    const modal = new bootstrap.Modal(modalEl, { backdrop: "static" });

    const cleanup = (resultado) => {
      modal.hide();
      modalEl.addEventListener("hidden.bs.modal", () => modalEl.remove(), { once: true });
      resolve(resultado);
    };

    document.getElementById(`${id}Sim`).addEventListener("click", () => cleanup(true));
    document.getElementById(`${id}Nao`).addEventListener("click", () => cleanup(false));
    modal.show();
  });
}
