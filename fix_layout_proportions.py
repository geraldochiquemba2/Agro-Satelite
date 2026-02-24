
import sys

file_path = r'c:\Users\ALBERTINA A. & FILHO\Desktop\satelite\Agro-Satelite\client\src\pages\Dashboard.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Localização exata baseada no view_file:
# Linha 720: <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
# Linha 814: </div> (fim do grid de métricas)
# Linha 816: <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6"> (início do grid que já alteramos)

start_idx = 719 # 0-indexed para linha 720
end_idx = 814   # Onde termina o </div> da linha 814, antes do novo grid-cols-12 que começa na 815 (agora 816)

# Vamos verificar se a linha 720 é o que esperamos
if 'grid-cols-1 md:grid-cols-3' not in lines[start_idx]:
    # Busca dinâmica simples caso as linhas tenham mudado levemente
    found = False
    for i in range(710, 730):
        if i < len(lines) and 'grid-cols-1 md:grid-cols-3' in lines[i]:
            start_idx = i
            found = True
            break
    if not found:
        print(f"Mismatch at 719: {lines[start_idx] if start_idx < len(lines) else 'EOF'}")
        sys.exit(1)

# Localizar o fim do bloco original antes do grid-cols-12
for i in range(start_idx, start_idx + 150):
    if 'lg:grid-cols-12' in lines[i]:
        end_idx = i
        break

# Nova estrutura do topo
new_top = [
    '                      <div className="flex flex-col lg:flex-row gap-6">\n',
    '                        <div className="lg:w-1/4 bg-white/10 p-6 rounded-2xl flex flex-col justify-center items-center text-center">\n',
    '                          <div className="text-sm opacity-60 mb-2 uppercase font-bold tracking-widest">Condição Atual</div>\n',
    '                          <div className="flex flex-col items-center">\n',
    '                            <div className="relative mb-2">\n',
    '                              {(() => {\n',
    '                                const desc = selectedProvince.weather.description.toLowerCase();\n',
    '                                const isDay = selectedProvince.weather.isDay;\n',
    '\n',
    '                                if (desc.includes("chuva") || desc.includes("aguaceiros")) return <CloudRain className="w-16 h-16 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" />;\n',
    '                                if (desc.includes("trovoada")) return <CloudLightning className="w-16 h-16 text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.5)]" />;\n',
    '                                if (desc.includes("nublado") || desc.includes("encoberto")) return <CloudSun className="w-16 h-16 text-slate-300" />;\n',
    '\n',
    '                                return isDay ?\n',
    '                                  <Sun className="w-16 h-16 text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.6)]" /> :\n',
    '                                  <Moon className="w-16 h-16 text-blue-200 drop-shadow-[0_0_12px_rgba(191,219,254,0.6)]" />;\n',
    '                              })()}\n',
    '                            </div>\n',
    '                            <div className="text-5xl font-black flex items-start">\n',
    '                              {selectedProvince.weather.temp.toFixed(1)}\n',
    '                              <span className="text-xl mt-1 ml-0.5 text-blue-100">°</span>\n',
    '                            </div>\n',
    '                            <p className="mt-1 text-sm text-blue-100 uppercase font-bold tracking-wide">{selectedProvince.weather.description}</p>\n',
    '                            <div className="mt-4 flex items-center gap-1.5 opacity-40 text-[9px] uppercase font-bold">\n',
    '                              <RefreshCw className="w-2.5 h-2.5 animate-spin-slow" />\n',
    '                              Satélite: {selectedProvince.weather.time || "Sincronizado"}\n',
    '                            </div>\n',
    '                          </div>\n',
    '                        </div>\n',
    '\n',
    '                        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">\n',
    '                          {[\n',
    '                            { icon: <Sunrise className="w-3 h-3 text-amber-400" />, label: "Nascer do Sol", value: selectedProvince.weather.sunrise || "--:--" },\n',
    '                            { icon: <Sun className="w-3 h-3 text-yellow-400" />, label: "Índice UV", value: selectedProvince.weather.uvIndex },\n',
    '                            { icon: <Wind className="w-3 h-3 text-slate-400" />, label: "Vento", value: `${selectedProvince.weather.windSpeed} km/h` },\n',
    '                            { icon: <ThermometerSun className="w-3 h-3 text-orange-400" />, label: "Sensação", value: `${selectedProvince.weather.apparentTemp?.toFixed(1) || selectedProvince.weather.temp}°` },\n',
    '                            { icon: <CloudRain className="w-3 h-3 text-blue-400" />, label: "Precipitação", value: `${selectedProvince.weather.rain} mm` },\n',
    '                            { icon: <Droplets className="w-3 h-3 text-cyan-400" />, label: "Humidade", value: `${selectedProvince.weather.humidity}%` },\n',
    '                            { icon: <Eye className="w-3 h-3 text-indigo-400" />, label: "Visibilidade", value: `${selectedProvince.weather.visibility?.toFixed(1) || "10.0"} km` },\n',
    '                            { icon: <Gauge className="w-3 h-3 text-emerald-400" />, label: "Pressão", value: `${selectedProvince.weather.pressure?.toFixed(0) || "1013"} hPa` },\n',
    '                          ].map((item, idx) => (\n',
    '                            <div key={idx} className="p-4 bg-white/5 rounded-xl border border-white/10 group hover:bg-white/10 transition-all flex flex-col justify-between">\n',
    '                              <div className="flex items-center gap-2 mb-2">\n',
    '                                {item.icon}\n',
    '                                <div className="text-[10px] opacity-60 uppercase font-bold tracking-tight">{item.label}</div>\n',
    '                              </div>\n',
    '                              <div className="text-xl font-bold whitespace-nowrap">{item.value}</div>\n',
    '                            </div>\n',
    '                          ))}\n',
    '                        </div>\n',
    '                      </div>\n',
    '\n'
]

final_lines = lines[:start_idx] + new_top + lines[end_idx:]

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(final_lines)

print("Successfully updated top weather grid proportions with robust mapping")
