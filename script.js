let currentPage = 1;
const itemsPerPage = 15; 
let allProperties = [];
let filteredProperties = [];
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
            renderProperties(paginateProperties(filteredProperties, currentPage));
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
            renderProperties(paginateProperties(filteredProperties, currentPage));
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
            renderProperties(paginateProperties(filteredProperties, currentPage));
            renderPaginationControls();
        }
    });
    paginationControls.appendChild(nextPageItem);
}

function renderProperties(properties) {
    const propertyList = document.getElementById('property-list');
    propertyList.innerHTML = '';
    properties.forEach((property, index) => {
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
                    Vagas: ${property.planta.vagas}<br>
                    <button class="btn btn-success mt-2 btn-details" data-property="${index}">Ver Detalhes</button>
                </div>
        </div>
        `;
        propertyList.appendChild(listItem);
    });
}

function filterProperties(term) {
    return allProperties.filter(property => {
        const name = property.nome.toLowerCase();
        const address = `${property.rua} ${property.num} ${property.bairro} ${property.cidade}`.toLowerCase();
        return name.includes(term.toLowerCase()) || address.includes(term.toLowerCase());
    });
}

function showPropertyDetails(property) {
    const modalBody = document.getElementById('modal-body-content');
    const whatsappLink = document.getElementById('whatsapp-link');
    modalBody.innerHTML = `
        <div class="row" style="color:black;">
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
    whatsappLink.href = `http://wa.me/5511946029784?text=Olá, tudo bem? Me interessei por ${encodeURIComponent(property.nome)} que estava no site! Vocês poderiam me auxiliar?`;
}

function fetchProperties() {
    fetch('https://api.estagio.amfernandes.com.br/imoveis')
        .then(response => response.json())
        .then(data => {
            allProperties = data;
            filteredProperties = allProperties;
            totalPages = Math.ceil(filteredProperties.length / itemsPerPage);

            renderProperties(paginateProperties(filteredProperties, currentPage));
            renderPaginationControls();

            // Ordenar por nome do condomínio (crescente)
            document.getElementById('sort-by-name-asc').addEventListener('click', () => {
                let sortedProperties = insertionSort(filteredProperties.slice(), 'nome', 'asc');
                currentPage = 1;
                filteredProperties = sortedProperties;
                renderProperties(paginateProperties(filteredProperties, currentPage));
                renderPaginationControls();
            });

            // Ordenar por nome do condomínio (decrescente)
            document.getElementById('sort-by-name-desc').addEventListener('click', () => {
                let sortedProperties = insertionSort(filteredProperties.slice(), 'nome', 'desc');
                currentPage = 1;
                filteredProperties = sortedProperties;
                renderProperties(paginateProperties(filteredProperties, currentPage));
                renderPaginationControls();
            });

            // Ordenar por preço (crescente)
            document.getElementById('sort-by-price-asc').addEventListener('click', () => {
                let sortedProperties = insertionSort(filteredProperties.slice(), 'planta.preco', 'asc');
                currentPage = 1;
                filteredProperties = sortedProperties;
                renderProperties(paginateProperties(filteredProperties, currentPage));
                renderPaginationControls();
            });

            // Ordenar por preço (decrescente)
            document.getElementById('sort-by-price-desc').addEventListener('click', () => {
                let sortedProperties = insertionSort(filteredProperties.slice(), 'planta.preco', 'desc');
                currentPage = 1;
                filteredProperties = sortedProperties;
                renderProperties(paginateProperties(filteredProperties, currentPage));
                renderPaginationControls();
            });
        })
        .catch(error => console.error('Erro ao buscar imóveis:', error));
}

document.getElementById('search-input').addEventListener('input', (event) => {
    const searchTerm = event.target.value;
    filteredProperties = filterProperties(searchTerm);
    currentPage = 1;
    totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
    renderProperties(paginateProperties(filteredProperties, currentPage));
    renderPaginationControls();
});

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('btn-details')) {
        const index = event.target.getAttribute('data-property');
        const property = filteredProperties[(currentPage - 1) * itemsPerPage + parseInt(index)];
        showPropertyDetails(property);

        const propertyModal = new bootstrap.Modal(document.getElementById('propertyModal'));
        propertyModal.show();
    }
});

document.addEventListener('DOMContentLoaded', fetchProperties);