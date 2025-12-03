let todosOsCarros = [];

// Função principal que carrega tudo
async function loadData() {
  try {
    // Busca o arquivo JSON
    const res = await fetch('carros.json');
    todosOsCarros = await res.json();
    window.carrosData = todosOsCarros;

    montarOpcoesMarca(); // Cria o menu de marcas
    configurarBusca();   // Ativa a pesquisa
    renderizarGaleria(todosOsCarros); // Mostra os carros
    
  } catch (erro) {
    console.error("Erro:", erro);
    document.getElementById('galeria-carros').innerHTML = "<p style='color:white; text-align:center;'>Erro ao carregar catálogo. Verifique o JSON.</p>";
  }
}

// Preenche o menu <select> com as Marcas (A-Z)
function montarOpcoesMarca() {
  const marcas = [...new Set(todosOsCarros.map(c => c.marca))].sort();
  const select = document.getElementById('filtro-marca');

  marcas.forEach(marca => {
    const option = document.createElement('option');
    option.value = marca;
    option.textContent = marca;
    select.appendChild(option);
  });
}

// Lógica de Filtro (Texto + Marca)
function configurarBusca() {
  const inputBusca = document.getElementById('campo-busca');
  const selectFiltro = document.getElementById('filtro-marca');

  function filtrar() {
    const termo = inputBusca.value.toLowerCase();
    const marcaSelecionada = selectFiltro.value;

    const filtrados = todosOsCarros.filter(carro => {
      // Filtra pelo que foi digitado (Modelo)
      const matchTexto = carro.modelo.toLowerCase().includes(termo);
      // Filtra pela Marca selecionada
      const matchMarca = marcaSelecionada === 'todos' || carro.marca === marcaSelecionada;

      return matchTexto && matchMarca;
    });

    renderizarGaleria(filtrados);
  }

  inputBusca.addEventListener('input', filtrar);
  selectFiltro.addEventListener('change', filtrar);
}

// Cria os Cards na tela
function renderizarGaleria(lista) {
  const container = document.getElementById('galeria-carros');
  container.innerHTML = '';
  
  if(lista.length === 0) {
    container.innerHTML = '<p style="color:white; text-align:center; width:100%;">Nenhum carro encontrado.</p>';
    return;
  }

  lista.forEach(carro => {
    const card = document.createElement('div');
    card.className = 'card';
    
    // Procura imagem PNG (1.png, 2.png...)
    const imagemArquivo = `${carro.id}.png`;

    card.innerHTML = `
        <img src="${imagemArquivo}" alt="${carro.modelo}" onerror="this.src='https://via.placeholder.com/300x200?text=Sem+Foto'">
        <div class="card-info">
            <h3>${carro.modelo}</h3>
            <p style="color: #aaa; font-size: 0.9rem;">${carro.marca} | ${carro.categoria}</p>
            <p class="ver-mais">Ver detalhes +</p>
        </div>`;
    card.onclick = () => abrirModal(carro.id);
    container.appendChild(card);
  });
}

// Janela de Detalhes
function abrirModal(id) {
  const carro = window.carrosData.find(c => c.id === id);
  if(!carro) return;

  const modalBody = document.getElementById('modal-body');
  const imagemArquivo = `${carro.id}.png`;

  modalBody.innerHTML = `
    <h2 style="color: #d32f2f; margin-bottom: 10px;">${carro.modelo}</h2>
    <span class="badge-raridade">${carro.unidades_brasil}</span>
    <img src="${imagemArquivo}" class="img-principal">
    <p><strong>Marca:</strong> ${carro.marca}</p>
    <p><strong>Categoria:</strong> ${carro.categoria}</p>
    <br>
    <p><strong>Sobre a máquina:</strong></p>
    <p>${carro.descricao}</p>
  `;
  
  document.getElementById('modal-detalhes').style.display = 'flex';
}

function fecharModal() {
  document.getElementById('modal-detalhes').style.display = 'none';
}

window.onclick = function(event) {
  const modal = document.getElementById('modal-detalhes');
  if (event.target == modal) fecharModal();
}

window.addEventListener('DOMContentLoaded', loadData);
