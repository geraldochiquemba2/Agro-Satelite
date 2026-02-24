
export interface WeatherData {
    temp: number;
    humidity: number;
    windSpeed: number;
    rain: number;
    uvIndex: number;
    description: string;
    isSimulated?: boolean;
}

export async function getPlotWeather(lat: string, lng: string): Promise<WeatherData> {
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
        // Fallback para Open-Meteo (Real-time sem chaves)
        console.log("OPENWEATHER_API_KEY não encontrada. Usando dados REAIS da Open-Meteo.");
        return fetchOpenMeteo(lat, lng);
    }

    try {
        const latNum = parseFloat(lat);
        const lngNum = parseFloat(lng);

        // Using OpenWeather One Call 3.0 (or fallback to 2.5 if needed)
        const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${latNum}&lon=${lngNum}&exclude=minutely,daily,alerts&units=metric&appid=${apiKey}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error("Falha ao buscar clima");

        const data = await response.json();
        const current = data.current;

        return {
            temp: current.temp,
            humidity: current.humidity,
            windSpeed: current.wind_speed,
            rain: current.rain ? current.rain['1h'] || 0 : 0,
            uvIndex: current.uvi,
            description: current.weather[0].description
        };
    } catch (error) {
        console.error("Erro na API OpenWeather:", error);
        return fetchOpenMeteo(lat, lng);
    }
}

async function fetchOpenMeteo(lat: string, lng: string): Promise<WeatherData> {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,uv_index,weather_code&timezone=auto`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Erro Open-Meteo");
        const data = await res.json();
        const current = data.current;
        const code = current.weather_code;

        // Mapeamento WMO Weather Codes para Português
        const weatherMap: Record<number, string> = {
            0: "Céu Limpo",
            1: "Principalmente Limpo", 2: "Parcialmente Nublado", 3: "Encoberto",
            45: "Nevoeiro", 48: "Nevoeiro com Gelo",
            51: "Chuvisco Leve", 53: "Chuvisco Moderado", 55: "Chuvisco Denso",
            61: "Chuva Leve", 63: "Chuva Moderada", 65: "Chuva Forte",
            71: "Neve Leve", 73: "Neve Moderada", 75: "Neve Forte",
            80: "Aguaceiros Leves", 81: "Aguaceiros Moderados", 82: "Aguaceiros Violentos",
            95: "Trovoada", 96: "Trovoada com Granizo Leve", 99: "Trovoada com Granizo Forte"
        };

        return {
            temp: current.temperature_2m,
            humidity: current.relative_humidity_2m,
            windSpeed: current.wind_speed_10m,
            rain: current.precipitation,
            uvIndex: current.uv_index,
            description: weatherMap[code] || (current.precipitation > 0 ? "Chuva" : "Limpo"),
            isSimulated: false
        };
    } catch (e) {
        console.error("Erro crítico de clima:", e);
        return {
            temp: 25,
            humidity: 60,
            windSpeed: 5,
            rain: 0,
            uvIndex: 5,
            description: "Clima Indisponível",
            isSimulated: true
        };
    }
}
