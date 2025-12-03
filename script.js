async function loadData() {
  try {
    const res = await fetch('carros.json');
    const carros = await res.json();
    window.carrosData = carros;

    // Ordena os carros por MARCA (A-Z) para ficar organizado visualmente
    carros.sort((a, b) => a.marca.localeCompare(b.marca));

    renderizarGaleria(carros);
    
  } catch (erro) {
    console.error("Erro:", erro);
    document.getElementById('galeria-carros').innerHTML = "<p style='color:white; text-align:center;'>Erro ao carregar. Verifique o JSON.</p>";
  }
}

// MOSTRA OS CARROS (Agora mostra a Marca e Categoria bem visíveis)
function renderizarGaleria(lista) {
  const container = document.getElementById('galeria-carros');
  container.innerHTML = '';
  
  lista.forEach(carro => {
    const card = document.createElement('div');
    card.className = 'card';
    
    // Pega a imagem direto do JSON (ex: "1.png")
    const imagemArquivo = carro.imagem_capa;

    card.innerHTML = `
        <img src="${imagemArquivo}" alt="${carro.modelo}" onerror="this.src='https://via.placeholder.com/300x200?text=Sem+Foto'">
        <div class="card-info">
            <h3>${carro.modelo}</h3>
            <p style="color: #d32f2f; font-weight: bold; font-size: 0.9rem;">${carro.marca}</p>
            <p style="color: #aaa; font-size: 0.85rem;">${carro.categoria}</p>
            
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
    
    <div style="display: flex; gap: 20px; margin-bottom: 15px;">
        <div>
            <p style="color:#888; font-size: 0.9rem;">MARCA</p>
            <p style="color:white; font-weight:bold;">${carro.marca}</p>
        </div>
        <div>
            <p style="color:#888; font-size: 0.9rem;">CATEGORIA</p>
            <p style="color:white; font-weight:bold;">${carro.categoria}</p>
        </div>
    </div>

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
