let currentPage = 1;
const itemsPerPage = 15; // Número de itens por página
let allProperties = []; // Armazena todas as propriedades
let totalPages = 1;

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

function paginateProperties(properties, page = 1) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return properties.slice(start, end);
}

function renderPaginationControls() {
    const paginationControls = document.getElementById('pagination-controls');
    paginationControls.innerHTML = '';

    const prevPageItem = document.createElement('li');
    prevPageItem.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevPageItem.innerHTML = `<a class="page-link" href="#" tabindex="-1">Anterior</a>`;
    prevPageItem.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderProperties(paginateProperties(allProperties, currentPage));
            renderPaginationControls();
        }
    });
    paginationControls.appendChild(prevPageItem);

    for (let i = 1; i <= totalPages; i++) {
        let pageButton = document.createElement('li');
        pageButton.className = `page-item ${i === currentPage ? 'active' : ''}`;
        pageButton.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            renderProperties(paginateProperties(allProperties, currentPage));
            renderPaginationControls();
        });
        paginationControls.appendChild(pageButton);
    }

    const nextPageItem = document.createElement('li');
    nextPageItem.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextPageItem.innerHTML = `<a class="page-link" href="#">Próximo</a>`;
    nextPageItem.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderProperties(paginateProperties(allProperties, currentPage));
            renderPaginationControls();
        }
    });
    paginationControls.appendChild(nextPageItem);
}

function renderProperties(properties) {
    const propertyList = document.getElementById('property-list');
    propertyList.innerHTML = '';
    properties.forEach(property => {
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
}

function fetchProperties() {
    fetch('https://api.estagio.amfernandes.com.br/imoveis')
        .then(response => response.json())
        .then(data => {
            allProperties = data;
            totalPages = Math.ceil(allProperties.length / itemsPerPage);

            renderProperties(paginateProperties(allProperties, currentPage));
            renderPaginationControls();

            // Ordenar por nome do condomínio (crescente)
            document.getElementById('sort-by-name-asc').addEventListener('click', () => {
                let sortedProperties = insertionSort(allProperties.slice(), 'nome', 'asc');
                currentPage = 1;
                allProperties = sortedProperties;
                renderProperties(paginateProperties(allProperties, currentPage));
                renderPaginationControls();
            });

            // Ordenar por nome do condomínio (decrescente)
            document.getElementById('sort-by-name-desc').addEventListener('click', () => {
                let sortedProperties = insertionSort(allProperties.slice(), 'nome', 'desc');
                currentPage = 1;
                allProperties = sortedProperties;
                renderProperties(paginateProperties(allProperties, currentPage));
                renderPaginationControls();
            });

            // Ordenar por preço (crescente)
            document.getElementById('sort-by-price-asc').addEventListener('click', () => {
                let sortedProperties = insertionSort(allProperties.slice(), 'planta.preco', 'asc');
                currentPage = 1;
                allProperties = sortedProperties;
                renderProperties(paginateProperties(allProperties, currentPage));
                renderPaginationControls();
            });

            // Ordenar por preço (decrescente)
            document.getElementById('sort-by-price-desc').addEventListener('click', () => {
                let sortedProperties = insertionSort(allProperties.slice(), 'planta.preco', 'desc');
                currentPage = 1;
                allProperties = sortedProperties;
                renderProperties(paginateProperties(allProperties, currentPage));
                renderPaginationControls();
            });
        })
        .catch(error => console.error('Erro ao buscar imóveis:', error));
}

document.addEventListener('DOMContentLoaded', fetchProperties);





