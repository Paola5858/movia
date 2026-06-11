import { marcaService } from "../services/marcaService.js";
import { esc, mostrarFeedback, confirmar } from "../utils/dom.js";
import { validarMarca } from "../utils/validation.js";

const lista = document.querySelector("#listaMarcas");
const feedbackEl = document.querySelector("#feedbackMarca");
const overlay = document.querySelector("#overlayMarca");
const form = document.querySelector("#formMarca");
const btnNova = document.querySelector("#btnNovaMarca");
const btnCancelar = document.querySelector("#btnCancelarMarca");
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

function renderizarCard(marca) {
  return `
    <li class="flex flex-col gap-4 rounded-[2rem] bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-4">
        <div class="flex h-14 w-14 items-center justify-center rounded-[1.75rem] bg-pink-100 text-2xl">🏷️</div>
        <div>
          <p class="text-lg font-semibold text-slate-950">${esc(marca.nome)}</p>
          <p class="mt-2 text-sm text-slate-500">id oculto · detalhes na api</p>
        </div>
      </div>
      <div class="flex items-center gap-3 text-slate-400">
        <button data-action="editar" data-id="${esc(marca.id)}" data-nome="${esc(marca.nome)}" class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition hover:bg-pink-50 hover:text-pink-500" aria-label="editar ${esc(marca.nome)}">✏️</button>
        <button data-action="excluir" data-id="${esc(marca.id)}" data-nome="${esc(marca.nome)}" class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition hover:bg-rose-50 hover:text-rose-500" aria-label="excluir ${esc(marca.nome)}">🗑️</button>
      </div>
    </li>`;
}

async function render() {
  lista.innerHTML = `<li class="rounded-[2rem] bg-white p-6 text-slate-500 shadow-sm">carregando marcas...</li>`;
  try {
    const marcas = await marcaService.listar();
    if (!marcas || !marcas.length) {
      lista.innerHTML = `<li class="rounded-[2rem] bg-white p-6 text-slate-500 shadow-sm">nenhuma marca cadastrada.</li>`;
      return;
    }
    lista.innerHTML = marcas.map(renderizarCard).join("");
  } catch (erro) {
    lista.innerHTML = `<li class="rounded-[2rem] bg-white p-6 text-rose-500 shadow-sm">${esc(erro.message)}</li>`;
  }
}

// criar
btnNova.addEventListener("click", () => {
  document.getElementById("idField").value = "";
  nomeField.value = "";
  abrirOverlay();
});

// cancelar
btnCancelar.addEventListener("click", () => fecharOverlay());

// submit do form (criar/editar)
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("idField").value;
  const dados = { nome: nomeField.value.trim() };
  const erro = validarMarca(dados);
  if (erro) {
    feedback(erro, "warning");
    return;
  }
  try {
    if (id) await marcaService.atualizar(id, dados);
    else await marcaService.cadastrar(dados);
    fecharOverlay();
    render();
    feedback("marca salva.", "success");
  } catch (err) {
    feedback(err.message);
  }
});

// ações editar/excluir na lista
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
    const confirmado = await confirmar(`Excluir a marca "${nome}"?`);
    if (!confirmado) return;
    try {
      await marcaService.excluir(id);
      render();
      feedback("marca excluída.", "success");
    } catch (erro) {
      feedback(erro.message);
    }
  }
});

render();
