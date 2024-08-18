// Função para ordenar usando Insertion Sort, com suporte para chaves aninhadas e ordenação decrescente
function insertionSort(arr, key, order = 'asc') {
    const getValue = (obj, keyPath) => keyPath.split('.').reduce((value, key) => value[key], obj);

    for (let i = 1; i < arr.length; i++) {
        let current = arr[i];
        let j = i - 1;
        while (j >= 0 && 
               (order === 'asc' ? getValue(arr[j], key) > getValue(current, key) 
                                : getValue(arr[j], key) < getValue(current, key))) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = current;
    }
    return arr;
}

// Variáveis de controle de paginação
let currentPage = 1;
const propertiesPerPage = 5;
let properties = [];
let sortedProperties = [];

function renderProperties() {
    const propertyList = document.getElementById('property-list');
    propertyList.innerHTML = '';

    // Determinar os imóveis a serem exibidos na página atual
    const start = (currentPage - 1) * propertiesPerPage;
    const end = start + propertiesPerPage;
    const currentProperties = sortedProperties.slice(start, end);

    currentProperties.forEach(property => {
        let listItem = document.createElement('li');
        listItem.className = 'list-group-item';
        listItem.innerHTML = `
        <div class="row">
                <div class="col-md-4">
                    <img src="${property.fachada}" alt="Imagem do imóvel" class="img-fluid mb-2" style="max-height: 200px;">
                </div>
                <div class="col-md-8">
                    <strong>${property.nome}</strong><br>
                    Preço: R$ ${property.planta.preco.toLocaleString('pt-BR')}<br>
                    Endereço: ${property.rua}, ${property.num} - ${property.bairro}, ${property.cidade}<br>
                    Dormitórios: ${property.planta.dorms}<br>
                    Metragem: ${property.planta.metragem} m²<br>
                    Vagas: ${property.planta.vagas}
                </div>
        </div>
        `;
        propertyList.appendChild(listItem);
    });

    // Atualizar navegação de página
    updatePagination();
}

function updatePagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const totalPages = Math.ceil(sortedProperties.length / propertiesPerPage);

    // Botão "Anterior"
    const prevButton = document.createElement('li');
    prevButton.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevButton.innerHTML = `<a class="page-link" href="#" id="prev-page">Anterior</a>`;
    pagination.appendChild(prevButton);

    // Páginas numeradas
    for (let i = 1; i <= totalPages; i++) {
        const pageItem = document.createElement('li');
        pageItem.className = `page-item ${i === currentPage ? 'active' : ''}`;
        pageItem.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i}</a>`;
        pagination.appendChild(pageItem);
    }

    // Botão "Próxima"
    const nextButton = document.createElement('li');
    nextButton.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextButton.innerHTML = `<a class="page-link" href="#" id="next-page">Próxima</a>`;
    pagination.appendChild(nextButton);
}

function fetchProperties() {
    fetch('https://api.estagio.amfernandes.com.br/imoveis')
        .then(response => response.json())
        .then(data => {
            properties = data;
            sortedProperties = [...properties];

            // Renderizando a primeira página
            renderProperties();

            // Ordenar por nome do condomínio (crescente)
            document.getElementById('sort-by-name-asc').addEventListener('click', () => {
                sortedProperties = insertionSort([...properties], 'nome', 'asc');
                currentPage = 1; // Reiniciar para a primeira página
                renderProperties();
            });

            // Ordenar por nome do condomínio (decrescente)
            document.getElementById('sort-by-name-desc').addEventListener('click', () => {
                sortedProperties = insertionSort([...properties], 'nome', 'desc');
                currentPage = 1;
                renderProperties();
            });

            // Ordenar por preço (crescente)
            document.getElementById('sort-by-price-asc').addEventListener('click', () => {
                sortedProperties = insertionSort([...properties], 'planta.preco', 'asc');
                currentPage = 1;
                renderProperties();
            });

            // Ordenar por preço (decrescente)
            document.getElementById('sort-by-price-desc').addEventListener('click', () => {
                sortedProperties = insertionSort([...properties], 'planta.preco', 'desc');
                currentPage = 1;
                renderProperties();
            });
        })
        .catch(error => console.error('Erro ao buscar imóveis:', error));
}

// Navegação entre páginas
document.addEventListener('click', function(e) {
    if (e.target && e.target.nodeName === "A") {
        e.preventDefault();
        if (e.target.id === 'prev-page') {
            if (currentPage > 1) {
                currentPage--;
                renderProperties();
            }
        } else if (e.target.id === 'next-page') {
            const totalPages = Math.ceil(sortedProperties.length / propertiesPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderProperties();
            }
        } else if (e.target.dataset.page) {
            currentPage = parseInt(e.target.dataset.page);
            renderProperties();
        }
    }
});

document.addEventListener('DOMContentLoaded', fetchProperties);

