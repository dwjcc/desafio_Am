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
            let properties = data;

            renderProperties(properties);

            // Ordenar por nome do condomínio (crescente)
            document.getElementById('sort-by-name-asc').addEventListener('click', () => {
                let sortedProperties = insertionSort(properties.slice(), 'nome', 'asc');
                renderProperties(sortedProperties);
            });

            // Ordenar por nome do condomínio (decrescente)
            document.getElementById('sort-by-name-desc').addEventListener('click', () => {
                let sortedProperties = insertionSort(properties.slice(), 'nome', 'desc');
                renderProperties(sortedProperties);
            });

            // Ordenar por preço (crescente)
            document.getElementById('sort-by-price-asc').addEventListener('click', () => {
                let sortedProperties = insertionSort(properties.slice(), 'planta.preco', 'asc');
                renderProperties(sortedProperties);
            });

            // Ordenar por preço (decrescente)
            document.getElementById('sort-by-price-desc').addEventListener('click', () => {
                let sortedProperties = insertionSort(properties.slice(), 'planta.preco', 'desc');
                renderProperties(sortedProperties);
            });
        })
        .catch(error => console.error('Erro ao buscar imóveis:', error));
}

document.addEventListener('DOMContentLoaded', fetchProperties);


