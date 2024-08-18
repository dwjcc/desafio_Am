function insertionSort(arr, key) {
    for (let i = 1; i < arr.length; i++) {
        let current = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j][key] > current[key]) {
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

        
            document.getElementById('sort-by-name').addEventListener('click', () => {
                let sortedProperties = insertionSort(properties.slice(), 'nome');
                renderProperties(sortedProperties);
            });

            
            document.getElementById('sort-by-price').addEventListener('click', () => {
                let sortedProperties = insertionSort(properties.slice(), 'planta.preco');
                renderProperties(sortedProperties);
            });
        })
        .catch(error => console.error('Erro ao buscar imóveis:', error));
}

document.addEventListener('DOMContentLoaded', fetchProperties);