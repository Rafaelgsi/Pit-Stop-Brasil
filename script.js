var todosOsCarros = [];

function loadData() {
  fetch("carros.json")
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      todosOsCarros = data;

      todosOsCarros.sort(function(a, b) {
        if (a.marca < b.marca) return -1;
        if (a.marca > b.marca) return 1;
        return 0;
      });

      criarMenuLateral();
      renderizarGaleria(todosOsCarros);
    })
    .catch(function(erro) {
      console.log("Erro: " + erro);
    });
}

function criarMenuLateral() {
  var marcas = ['Todas as Marcas'];
  
  for (var i = 0; i < todosOsCarros.length; i++) {
    var marcaAtual = todosOsCarros[i].marca;
    if (marcas.indexOf(marcaAtual) === -1) {
      marcas.push(marcaAtual);
    }
  }
  
  marcas.sort();

  var container = document.getElementById('menu-lateral');
  container.innerHTML = "";

  marcas.forEach(function(marca) {
    var btn = document.createElement('button');
    btn.className = 'btn-filtro';
    btn.textContent = marca;

    btn.onclick = function(e) {
      var botoes = document.querySelectorAll('.btn-filtro');
      for (var j = 0; j < botoes.length; j++) {
        botoes[j].classList.remove('ativo');
      }
      e.target.classList.add('ativo');

      if (marca === 'Todas as Marcas') {
        renderizarGaleria(todosOsCarros);
      } else {
        var filtrados = todosOsCarros.filter(function(carro) {
          return carro.marca === marca;
        });
        renderizarGaleria(filtrados);
      }
    };
    container.appendChild(btn);
  });
  
  if(container.firstChild) container.firstChild.classList.add('ativo');
}

function renderizarGaleria(lista) {
  var container = document.getElementById('galeria-carros');
  container.innerHTML = "";

  if (lista.length === 0) {
    container.innerHTML = "<p style='color:#aaa;'>Nenhum carro encontrado.</p>";
    return;
  }

  lista.forEach(function(carro) {
    var card = document.createElement('div');
    card.className = 'card';
    
    var html = "";
    html += "<img src='" + carro.imagem_capa + "' alt='" + carro.modelo + "' onerror=\"this.src='https://via.placeholder.com/300x200?text=Sem+Foto'\">";
    html += "<div class='card-info'>";
    html += "<h3>" + carro.modelo + "</h3>";
    html += "<p style='color: #d32f2f; font-weight: bold; font-size: 0.85rem;'>" + carro.marca + "</p>";
    html += "<p style='color: #aaa; font-size: 0.8rem;'>" + carro.categoria + "</p>";
    html += "<p class='ver-mais'>DETALHES</p>";
    html += "</div>";

    card.innerHTML = html;
    
    card.onclick = function() {
      abrirModal(carro.id);
    };
    
    container.appendChild(card);
  });
}

function abrirModal(id) {
  var carro = todosOsCarros.find(function(c) {
    return c.id === id;
  });

  if (!carro) return;

  var modalBody = document.getElementById('modal-body');
  
  var html = "";
  html += "<h2 style='color: #d32f2f; margin-bottom: 10px;'>" + carro.modelo + "</h2>";
  html += "<span class='badge-raridade'>" + carro.unidades_brasil + "</span>";
  html += "<img src='" + carro.imagem_capa + "' class='img-principal'>";
  html += "<div style='display:flex; justify-content:space-between; margin: 15px 0; border-bottom:1px solid #333; padding-bottom:10px;'>";
  html += "<div><small style='color:#888;'>MARCA</small><br><strong>" + carro.marca + "</strong></div>";
  html += "<div><small style='color:#888;'>CATEGORIA</small><br><strong>" + carro.categoria + "</strong></div>";
  html += "</div>";
  html += "<p>" + carro.descricao + "</p>";

  modalBody.innerHTML = html;
  document.getElementById('modal-detalhes').style.display = 'flex';
}

function fecharModal() {
  document.getElementById('modal-detalhes').style.display = 'none';
}

window.onclick = function(event) {
  var modal = document.getElementById('modal-detalhes');
  if (event.target == modal) {
    fecharModal();
  }
};

window.onload = loadData;
