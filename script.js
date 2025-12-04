let todosOsCarros = [];

async function loadData() {
  try {
    const res = await fetch('carros.json');
    todosOsCarros = await res.json();
    window.carrosData = todosOsCarros;

    // 1. Cria o menu de marcas
    criarBotoesMarca();
    
    // 2. Mostra todos os carros no começo
    renderizarGaleria(todosOsCarros);
    
  } catch (erro) {
    console.error("Erro:", erro);
  }
}

function criarBotoesMarca() {
  const container = document.getElementById('menu-marcas');
  
  // Pega todas as marcas únicas do JSON e ordena alfabeticamente
  // Adiciona "TODAS" no começo da lista
  const marcas = ['Todas', ...new Set(todosOsCarros.map(c => c.marca))].sort();

  marcas.forEach(marca => {
    const btn = document.createElement('button');
    btn.className = 'btn-filtro';
    btn.textContent = marca.toUpperCase(); // Deixa o texto em maiúsculo (FERRARI, PORSCHE...)
    
    btn.onclick = (e) => {
      // Tira a cor vermelha dos outros botões
      document.querySelectorAll('.btn-filtro').forEach(b => b.classList.remove('ativo'));
      // Coloca a cor vermelha no botão clicado
      e.target.classList.add('ativo');
      
      // FILTRA OS CARROS
      if(marca === 'Todas') {
        renderizarGaleria(todosOsCarros);
      } else {
        const filtrados = todosOsCarros.filter(carro => carro.marca === marca);
        renderizarGaleria(filtrados);
      }
    };
    container.appendChild(btn);
  });
  
  // Deixa o botão "TODAS" marcado no início
  if(container.firstChild) container.firstChild.classList.add('ativo');
}

function renderizarGaleria(lista) {
  const container = document.getElementById('galeria-carros');
  container.innerHTML = '';
  
  if(lista.length === 0) {
    container.innerHTML = '<p style="color:white; text-align:center; width:100%;">Nenhum carro dessa marca encontrado.</p>';
    return;
  }

  lista.forEach(carro => {
    const card = document.createElement('div');
    card.className = 'card';
    const imagemArquivo = carro.imagem_capa;

    card.innerHTML = `
        <img src="${imagemArquivo}" alt="${carro.modelo}" onerror="this.src='https://via.placeholder.com/300x200?text=Sem+Foto'">
        <div class="card-info">
            <h3>${carro.modelo}</h3>
            <p style="color: #d32f2f; font-weight: bold;">${carro.marca}</p>
            <p style="color: #aaa; font-size: 0.8rem;">${carro.categoria}</p>
            <p class="ver-mais">Ver detalhes +</p>
        </div>`;
    card.onclick = () => abrirModal(carro.id);
    container.appendChild(card);
  });
}

function abrirModal(id) {
  const carro = window.carrosData.find(c => c.id === id);
  if(!carro) return;

  const modalBody = document.getElementById('modal-body');
  const imagemArquivo = carro.imagem_capa;

  modalBody.innerHTML = `
    <h2 style="color: #d32f2f; margin-bottom: 10px;">${carro.modelo}</h2>
    <span class="badge-raridade">${carro.unidades_brasil}</span>
    <img src="${imagemArquivo}" class="img-principal">
    <p><strong>Marca:</strong> ${carro.marca}</p>
    <br>
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
