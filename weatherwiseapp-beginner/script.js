/**
 * GALACTIC WEATHER STATION - FINAL STABLE
 * API Key: 859b2fe677ef4cbb00276c015d5c4535
 */

const container = document.querySelector('.container');
const searchButton = document.querySelector('.search-box button');
const cityInput = document.querySelector('.search-box input');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');

const performScan = () => {
    // API Key Pribadi kamu
    const APIKey = '859b2fe677ef4cbb00276c015d5c4535';
    const city = cityInput.value.trim();

    if (city === '') return;

    // Reset tampilan ke mode "Scanning"
    console.log(`Scanning sector: ${city}...`);

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
        .then(response => {
            if (!response.ok) {
                // Menangani jika API key belum aktif (401) atau kota salah (404)
                throw new Error(response.status);
            }
            return response.json();
        })
        .then(json => {
            // Jika berhasil, sembunyikan pesan error dan tampilkan box
            weatherBox.style.display = 'block';
            weatherDetails.style.display = 'flex';
            container.style.height = '580px';

            const image = document.querySelector('.weather-box img');
            const temperature = document.querySelector('.temperature');
            const description = document.querySelector('.description');
            const humidity = document.querySelector('.humidity-val');
            const wind = document.querySelector('.wind-val');

            // Update Ikon (Menggunakan URL agar tidak pecah/hilang)
            const weatherMain = json.weather[0].main;
            const iconBase = "https://cdn-icons-png.flaticon.com/512/";

            switch (weatherMain) {
                case 'Clear': image.src = iconBase + '3222/3222807.png'; break;
                case 'Clouds': image.src = iconBase + '4834/4834523.png'; break;
                case 'Rain': image.src = iconBase + '3351/3351979.png'; break;
                case 'Snow': image.src = iconBase + '2315/2315309.png'; break;
                case 'Haze':
                case 'Mist': image.src = iconBase + '1779/1779862.png'; break;
                default: image.src = iconBase + '4834/4834523.png';
            }

            // Injeksi data suhu dan teks
            temperature.innerHTML = `${Math.round(json.main.temp)}<span>°C</span>`;
            description.innerHTML = json.weather[0].description.toUpperCase();
            humidity.innerHTML = `${json.main.humidity}%`;
            wind.innerHTML = `${Math.round(json.wind.speed * 3.6)}Km/h`;

            console.log("Transmission Successful!");
        })
        .catch(err => {
            console.error("Error detected:", err.message);
            
            // Logika peringatan cerdas
            if (err.message === "401") {
                alert("Sinyal Tertunda: API Key baru kamu sedang diaktivasi oleh server (biasanya 1 jam). Coba lagi nanti ya!");
            } else if (err.message === "404") {
                alert("Koordinat tidak ditemukan! Pastikan ejaan nama kota benar.");
            } else {
                alert("Gangguan transmisi: Periksa koneksi internet kamu.");
            }
            
            // Kembalikan tampilan ke standby
            container.style.height = '400px';
            weatherBox.style.display = 'none';
            weatherDetails.style.display = 'none';
        });
};

// Event Listeners
searchButton.addEventListener('click', performScan);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performScan();
});