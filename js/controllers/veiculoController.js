import { veiculoService } from "../services/veiculoService.js";
import { marcaService } from "../services/marcaService.js";
import { modeloService } from "../services/modeloService.js";
import { esc, mostrarFeedback, confirmar } from "../utils/dom.js";
import { validarVeiculo } from "../utils/validation.js";

const lista = document.querySelector("#listaVeiculos");
const overlay = document.querySelector("#overlayVeiculo");
const form = document.querySelector("#formVeiculo");
const selMarca = document.querySelector("#selMarca");
const selModelo = document.querySelector("#selModelo");
const idField = document.querySelector("#idV");
const descField = document.querySelector("#descV");
const anoField = document.querySelector("#anoV");
const horiField = document.querySelector("#horiV");
const btnNovo = document.querySelector("#btnNovoVeiculo");
const btnCancelar = document.querySelector("#btnCancelarVeiculo");
const feedbackEl = document.querySelector("#feedbackVeiculo");

const feedback = (msg, tipo = "danger") =>
  mostrarFeedback(feedbackEl, msg, tipo);

function abrirOverlay() {
  overlay.classList.remove("hidden");
}
function fecharOverlay() {
  overlay.classList.add("hidden");
  form.reset();
}

async function carregarDropdowns() {
  selMarca.innerHTML = '<option value="">carregando marcas...</option>';
  selModelo.innerHTML = '<option value="">carregando modelos...</option>';
  selMarca.disabled = true;
  selModelo.disabled = true;
  try {
    const [marcas, modelos] = await Promise.all([
      marcaService.listar(),
      modeloService.listar(),
    ]);
    const toArray = (x) =>
      Array.isArray(x)
        ? x
        : x && Array.isArray(x.data)
          ? x.data
          : x && Array.isArray(x.result)
            ? x.result
            : [];
    const marcasA = toArray(marcas);
    const modelosA = toArray(modelos);
    if (marcasA.length) {
      selMarca.innerHTML =
        '<option value="" disabled selected>selecione uma marca</option>' +
        marcasA
          .map(
            (m) =>
              `<option value="${esc(m.id)}">${esc(m.nome ?? m.name ?? m.descricao ?? m.id)}</option>`,
          )
          .join("");
      selMarca.disabled = false;
    } else
      selMarca.innerHTML =
        '<option value="" disabled selected>nenhuma marca disponível</option>';
    if (modelosA.length) {
      selModelo.innerHTML =
        '<option value="" disabled selected>selecione um modelo</option>' +
        modelosA
          .map(
            (m) =>
              `<option value="${esc(m.id)}">${esc(m.nome ?? m.name ?? m.descricao ?? m.id)}</option>`,
          )
          .join("");
      selModelo.disabled = false;
    } else
      selModelo.innerHTML =
        '<option value="" disabled selected>nenhum modelo disponível</option>';
  } catch (err) {
    feedback("erro ao carregar marcas e modelos. recarregue a página.");
    selMarca.innerHTML =
      '<option value="" disabled selected>erro ao carregar</option>';
    selModelo.innerHTML =
      '<option value="" disabled selected>erro ao carregar</option>';
  }
}

function renderizarCard(veiculo) {
  return `
    <li class="flex flex-col gap-4 rounded-[2rem] bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-4">
        <div class="flex h-14 w-14 items-center justify-center rounded-[1.75rem] bg-pink-100 text-2xl">🚚</div>
        <div>
          <p class="text-lg font-semibold text-slate-950">${esc(veiculo.descricao)}</p>
          <p class="mt-2 text-sm text-slate-500">ano ${esc(veiculo.ano)} · horímetro ${esc(veiculo.horimetro)} · marca ${esc(veiculo.marca_id ?? "—")}</p>
        </div>
      </div>
      <div class="flex items-center gap-3 text-slate-400">
        <button data-action="editar" data-id="${esc(veiculo.id)}" data-descricao="${esc(veiculo.descricao)}" class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition hover:bg-pink-50 hover:text-pink-500" aria-label="editar ${esc(veiculo.descricao)}">✏️</button>
        <button data-action="excluir" data-id="${esc(veiculo.id)}" data-descricao="${esc(veiculo.descricao)}" class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition hover:bg-rose-50 hover:text-rose-500" aria-label="excluir ${esc(veiculo.descricao)}">🗑️</button>
      </div>
    </li>`;
}

async function render() {
  lista.innerHTML = `<li class="rounded-[2rem] bg-white p-6 text-slate-500 shadow-sm">carregando veículos...</li>`;
  try {
    const veiculos = await veiculoService.listar();
    if (!veiculos || !veiculos.length) {
      lista.innerHTML = `<li class="rounded-[2rem] bg-white p-6 text-slate-500 shadow-sm">nenhum veículo cadastrado.</li>`;
      return;
    }
    lista.innerHTML = veiculos.map(renderizarCard).join("");
  } catch (erro) {
    lista.innerHTML = `<li class="rounded-[2rem] bg-white p-6 text-rose-500 shadow-sm">${esc(erro.message)}</li>`;
  }
}

// novo veículo
btnNovo.addEventListener("click", async () => {
  document.getElementById("idV").value = "";
  form.reset();
  await carregarDropdowns();
  abrirOverlay();
});

btnCancelar.addEventListener("click", () => fecharOverlay());

// ações editar/excluir
lista.addEventListener("click", async (evento) => {
  const botao = evento.target.closest("[data-action]");
  if (!botao) return;
  const { action, id, descricao } = botao.dataset;

  if (action === "editar") {
    await carregarDropdowns();
    idField.value = id;
    descField.value = botao.dataset.descricao || "";
    anoField.value = botao.dataset.ano || "";
    horiField.value = botao.dataset.horimetro || "";
    abrirOverlay();
    return;
  }

  if (action === "excluir") {
    const confirmado = await confirmar(`Excluir o veículo "${descricao}"?`);
    if (!confirmado) return;
    try {
      await veiculoService.excluir(id);
      render();
      feedback("veículo excluído.", "success");
    } catch (erro) {
      feedback(erro.message);
    }
  }
});

// submit form veiculo
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = idField.value;
  const dados = {
    descricao: descField.value.trim(),
    ano: parseInt(anoField.value, 10) || 0,
    horimetro: parseInt(horiField.value, 10) || 0,
    marca_id: selMarca.value ? parseInt(selMarca.value, 10) : null,
    modelo_id: selModelo.value ? parseInt(selModelo.value, 10) : null,
  };
  const erro = validarVeiculo(dados);
  if (erro) {
    feedback(erro, "warning");
    return;
  }
  const btnSalvar = form.querySelector("[type=submit]");
  btnSalvar.disabled = true;
  btnSalvar.textContent = "salvando...";
  try {
    if (id) await veiculoService.atualizar(id, dados);
    else await veiculoService.cadastrar(dados);
    fecharOverlay();
    render();
    feedback("veículo salvo.", "success");
  } catch (err) {
    feedback(err.message);
  } finally {
    btnSalvar.disabled = false;
    btnSalvar.textContent = "salvar";
  }
});

// inicialização
async function init() {
  await render();
}

init();
