async function buscarTempo() {
    const cidade = document.getElementById('cidadeInput').value.trim();
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.style.display = "none";
    resultadoDiv.innerHTML = "Buscando...";

    const tempo = await getPrevisao(cidade);

    if (tempo) {
        resultadoDiv.innerHTML = `
            <h2>${cidade}</h2>
            <p><strong>Clima:</strong> ${tempo.main} (${tempo.description})</p>
            <p><strong>Temperatura:</strong> ${tempo.temp_min}°C - ${tempo.temp_max}°C</p>
            <p><strong>Vento:</strong> ${tempo.speed} m/s</p>
            <p><strong>Visibilidade:</strong> ${tempo.visibility} metros</p>
            <p><strong>Nascer do Sol:</strong> ${tempo.sunrise}</p>
            <p><strong>Pôr do Sol:</strong> ${tempo.sunset}</p>
            <p><strong>Latitude:</strong> ${tempo.lat} <strong>Longitude:</strong> ${tempo.lon}</p>
        `;
        resultadoDiv.style.display = "block";
    } else {
        resultadoDiv.innerHTML = "<p>Erro ao buscar dados. Verifique o nome da cidade.</p>";
        resultadoDiv.style.display = "block";
    }
}

async function getPrevisao(cidade) {
    const chave = "6135072afe7f6cec1537d5cb08a5a1a2";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cidade)}&units=metric&lang=pt_br&appid=${chave}`;

    try {
        const resp = await fetch(url);
        if (!resp.ok) throw new Error("Erro ao obter dados da API");

        const dados = await resp.json();

        const sunrise = new Date(dados.sys.sunrise * 1000).toLocaleTimeString();
        const sunset = new Date(dados.sys.sunset * 1000).toLocaleTimeString();

        const tempo = {
            lat: dados.coord.lat,
            lon: dados.coord.lon,
            description: dados.weather[0].description,
            main: dados.weather[0].main,
            temp_min: dados.main.temp_min,
            temp_max: dados.main.temp_max,
            speed: dados.wind.speed,
            visibility: dados.visibility,
            sunrise: sunrise,
            sunset: sunset
        };

        return tempo;
    } catch (error) {
        console.error("Erro ao buscar previsão do tempo:", error);
        return null;
    }
}
