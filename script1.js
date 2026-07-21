function processarLogistica() {
    const cep = document.getElementById("cepInput").value;
    if (cep.length !== 8) {
        alert("Por favor, digite um CEP válido com 8 dígitos.");
        return;
    }

    const url = `https://viacep.com.br/ws/${cep}/json/`;

    fetch(url)
    .then(resposta => resposta.json())
    .then(dados => {
        if(dados.erro){
            alert("CEP não encontrado!");
        } else {
            // Torna o dashboard visível alterando o CSS via JS
            document.getElementById("dashboard").style.display = "grid";

            // Atualiza os campos específicos sem destruir a estrutura dos cards
            document.getElementById("logradouro").innerHTML = `<strong>Rua:</strong> ${dados.logradouro || 'N/A'}`;
            document.getElementById("bairro").innerHTML = `<strong>Bairro:</strong> ${dados.bairro || 'N/A'}`;
            document.getElementById("cidadeEstado").innerHTML = `<strong>Cidade/UF:</strong> ${dados.localidade} - ${dados.uf}`;

            // Passa o nome da cidade correto para a API de clima
            tempoCidade(dados.localidade);
        }
    })
    .catch(erro => {
        console.error("Erro na busca do CEP:", erro);
        alert("Erro ao consultar o servidor de CEP.");
    });
}

function tempoCidade(nomeCidade){
    const apiKey = "12a89a081b0f48368ae121024260505";
    // Usando encodeURIComponent para tratar nomes de cidades com espaços ou acentos
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(nomeCidade)}&lang=pt`;
   
    fetch(url)
    .then(resposta => resposta.json())
    .then(dados => {
        if(dados.error){
            document.getElementById("temp").innerText = "Indisponível";
            document.getElementById("condicao").innerText = "Indisponível";
        } else {
            const tempo = dados.current.temp_c;
            const condicao = dados.current.condition.text;

            // Insere os dados nos IDs corretos criados no HTML
            document.getElementById("temp").innerText = `${tempo}°C`;
            document.getElementById("condicao").innerText = condicao;
        }
    })
    .catch(erro => {
        console.error("Erro ao buscar clima:", erro);
        document.getElementById("temp").innerText = "Erro";
    });
}
