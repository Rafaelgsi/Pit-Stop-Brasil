let todosOsCarros = [];

async function loadData() {
  try {
    const res = await fetch('carros.json');
    todosOsCarros = await res.json();
    window.carrosData = todosOsCarros;

    todosOsCarros.sort((a, b) => a.marca.localeCompare(b.marca));

    criarMenuLateral();
    
    renderizarGaleria(todosOsCarros);
    
  } catch (erro) {
    console.error("Erro:", erro);
  }
}

function criarMenuLateral() {
  const marcas = ['Todas as Marcas', ...new Set(todosOsCarros.map(c => c.marca))].sort();
  const container = document.getElementById('menu-lateral');
  
  if (!container) return;
  container.innerHTML = '';

  marcas.forEach(marca => {
    const btn = document.createElement('button');
    btn.className = 'btn-filtro';
    btn.textContent = marca; // Nome da marca simples e limpo
    
    btn.onclick = (e) => {
      // Remove classe 'ativo' dos outros
      document.querySelectorAll('.btn-filtro').forEach(b => b.classList.remove('ativo'));
      // Adiciona no clicado
      e.target.classList.add('ativo');
      
      // Lógica de Filtro
      if(marca === 'Todas as Marcas') {
        renderizarGaleria(todosOsCarros);
      } else {
        const filtrados = todosOsCarros.filter(carro => carro.marca === marca);
        renderizarGaleria(filtrados);
      }
    };
    container.appendChild(btn);
  });
  
  // Ativa o primeiro botão
  if(container.firstChild) container.firstChild.classList.add('ativo');
}

function renderizarGaleria(lista) {
  const container = document.getElementById('galeria-carros');
  container.innerHTML = '';
  
  if(lista.length === 0) {
    container.innerHTML = '<p style="color:#aaa;">Nenhum carro encontrado.</p>';
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
            <p style="color: #d32f2f; font-weight: bold; font-size: 0.85rem;">${carro.marca}</p>
            <p style="color: #aaa; font-size: 0.8rem;">${carro.categoria}</p>
            <p class="ver-mais">DETALHES</p>
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
    
    <div style="display:flex; justify-content:space-between; margin: 15px 0; border-bottom:1px solid #333; padding-bottom:10px;">
        <div><small style="color:#888;">MARCA</small><br><strong>${carro.marca}</strong></div>
        <div><small style="color:#888;">CATEGORIA</small><br><strong>${carro.categoria}</strong></div>
    </div>

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

