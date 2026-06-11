import { modeloService } from "../services/modeloService.js";
import { esc, mostrarFeedback, confirmar } from "../utils/dom.js";
import { validarModelo } from "../utils/validation.js";

const lista = document.querySelector("#listaModelos");
const feedbackEl = document.querySelector("#feedbackModelo");
const overlay = document.querySelector("#overlayModelo");
const form = document.querySelector("#formModelo");
const btnNova = document.querySelector("#btnNovoModelo");
const btnCancelar = document.querySelector("#btnCancelarModelo");
const nomeField = document.querySelector("#nomeField");

const feedback = (msg, tipo = "danger") =>
  mostrarFeedback(feedbackEl, msg, tipo);

function abrirOverlay() {
  overlay.classList.remove("hidden");
}
function fecharOverlay() {
  overlay.classList.add("hidden");
  form.reset();
}

function renderizarCard(modelo) {
  return `
    <li class="flex flex-col gap-4 rounded-[2rem] bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-4">
        <div class="flex h-14 w-14 items-center justify-center rounded-[1.75rem] bg-pink-100 text-2xl">🚘</div>
        <div>
          <p class="text-lg font-semibold text-slate-950">${esc(modelo.nome)}</p>
          <p class="mt-2 text-sm text-slate-500">modelo · detalhes na api</p>
        </div>
      </div>
      <div class="flex items-center gap-3 text-slate-400">
        <button data-action="editar" data-id="${esc(modelo.id)}" data-nome="${esc(modelo.nome)}" class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition hover:bg-pink-50 hover:text-pink-500" aria-label="editar ${esc(modelo.nome)}">✏️</button>
        <button data-action="excluir" data-id="${esc(modelo.id)}" data-nome="${esc(modelo.nome)}" class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition hover:bg-rose-50 hover:text-rose-500" aria-label="excluir ${esc(modelo.nome)}">🗑️</button>
      </div>
    </li>`;
}

async function render() {
  lista.innerHTML = `<li class="rounded-[2rem] bg-white p-6 text-slate-500 shadow-sm">carregando modelos...</li>`;
  try {
    const modelos = await modeloService.listar();
    if (!modelos || !modelos.length) {
      lista.innerHTML = `<li class="rounded-[2rem] bg-white p-6 text-slate-500 shadow-sm">nenhum modelo cadastrado.</li>`;
      return;
    }
    lista.innerHTML = modelos.map(renderizarCard).join("");
  } catch (erro) {
    lista.innerHTML = `<li class="rounded-[2rem] bg-white p-6 text-rose-500 shadow-sm">${esc(erro.message)}</li>`;
  }
}

btnNova.addEventListener("click", () => {
  document.getElementById("idField").value = "";
  nomeField.value = "";
  abrirOverlay();
});
btnCancelar.addEventListener("click", () => fecharOverlay());

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("idField").value;
  const dados = { nome: nomeField.value.trim() };
  const erro = validarModelo(dados);
  if (erro) {
    feedback(erro, "warning");
    return;
  }
  try {
    if (id) await modeloService.atualizar(id, dados);
    else await modeloService.cadastrar(dados);
    fecharOverlay();
    render();
    feedback("modelo salvo.", "success");
  } catch (err) {
    feedback(err.message);
  }
});

lista.addEventListener("click", async (evento) => {
  const botao = evento.target.closest("[data-action]");
  if (!botao) return;
  const { action, id, nome } = botao.dataset;
  if (action === "editar") {
    document.getElementById("idField").value = id;
    nomeField.value = nome || "";
    abrirOverlay();
    return;
  }
  if (action === "excluir") {
    const confirmado = await confirmar(`Excluir o modelo "${nome}"?`);
    if (!confirmado) return;
    try {
      await modeloService.excluir(id);
      render();
      feedback("modelo excluído.", "success");
    } catch (erro) {
      feedback(erro.message);
    }
  }
});

render();
