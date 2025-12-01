async function loadData() {
  try {
    // 1. Busca os dados do arquivo JSON
    const res = await fetch('carros.json');
    const carros = await res.json();
    
    // Salva globalmente para usar no modal
    window.carrosData = carros;

    // Inicializa as funções
    montarFiltros(carros);
    renderizarGaleria(carros);
    
  } catch (erro) {
    console.error("Erro ao carregar dados:", erro);
    document.getElementById('galeria-carros').innerHTML = "<p>Erro ao carregar o catálogo. Verifique se está usando o Live Server.</p>";
  }
}

// === MUDANÇA AQUI: Filtra por CATEGORIA em vez de MARCA ===
function montarFiltros(carros) {
  // Pega todas as categorias únicas do JSON
  const categorias = ['todos', ...new Set(carros.map(c => c.categoria))];
  const container = document.getElementById('filtros');
  container.innerHTML = ''; // Limpa filtros antigos

  categorias.forEach(categoria => {
    const btn = document.createElement('button');
    btn.className = 'btn-filtro';
    
    // Deixa o texto bonitinho (Maiúsculo)
    btn.textContent = categoria.toUpperCase();
    
    btn.onclick = (e) => {
      // Remove classe 'ativo' de todos e adiciona no clicado
      document.querySelectorAll('.btn-filtro').forEach(b => b.classList.remove('ativo'));
      e.target.classList.add('ativo');
      
      // Filtra pela Categoria
      if(categoria === 'todos') {
        renderizarGaleria(carros);
      } else {
        const filtrados = carros.filter(c => c.categoria === categoria);
        renderizarGaleria(filtrados);
      }
    };
    container.appendChild(btn);
  });
  
  // Deixa o botão "TODOS" ativo inicialmente
  container.firstChild.classList.add('ativo');
}

// Desenha os cards na tela
function renderizarGaleria(lista) {
  const container = document.getElementById('galeria-carros');
  container.innerHTML = '';
  
  if(lista.length === 0) {
    container.innerHTML = '<p style="color:white; text-align:center; width:100%;">Nenhum carro encontrado nesta categoria.</p>';
    return;
  }

  lista.forEach(carro => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <img src="${carro.imagem_capa}" alt="${carro.modelo}" onerror="this.src='https://via.placeholder.com/300x200?text=Sem+Foto'">
        <div class="card-info">
            <h3>${carro.modelo}</h3>
            <p style="color: #aaa; font-size: 0.9rem;">${carro.marca} | ${carro.categoria}</p>
            <p class="ver-mais">Ver detalhes +</p>
        </div>`;
    card.onclick = () => abrirModal(carro.id);
    container.appendChild(card);
  });
}

// Abre a janela de detalhes
function abrirModal(id) {
  const carro = window.carrosData.find(c => c.id === id);
  if(!carro) return;

  const modalBody = document.getElementById('modal-body');
  modalBody.innerHTML = `
    <h2 style="color: #d32f2f; margin-bottom: 10px;">${carro.modelo}</h2>
    <span class="badge-raridade" style="font-size: 0.8rem; margin-bottom:10px; display:inline-block;">${carro.unidades_brasil}</span>
    <img src="${carro.imagem_capa}" class="img-principal">
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

// Fecha modal se clicar fora dele
window.onclick = function(event) {
  const modal = document.getElementById('modal-detalhes');
  if (event.target == modal) {
    fecharModal();
  }
}

// Inicia tudo quando carrega a página
window.addEventListener('DOMContentLoaded', loadData);