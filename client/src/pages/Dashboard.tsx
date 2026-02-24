import { useState } from "react";
import { 
  Droplets, Map, Activity, CloudRain, 
  Settings, User, Bell, ChevronRight, Menu, MapPin, 
  ThermometerSun, Sprout, CheckCircle2, AlertTriangle, TrendingUp, Sun, Wind
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Assets generated
import satelliteFarm from "@/assets/images/satellite-farm.png";
import soilHeatmap from "@/assets/images/soil-heatmap.png";

const waterForecastData = [
  { name: 'Seg', need: 45, evaporated: 20 },
  { name: 'Ter', need: 52, evaporated: 25 },
  { name: 'Qua', need: 38, evaporated: 15 },
  { name: 'Qui', need: 65, evaporated: 35 },
  { name: 'Sex', need: 48, evaporated: 22 },
  { name: 'Sáb', need: 50, evaporated: 24 },
  { name: 'Dom', need: 42, evaporated: 18 },
];

export default function Dashboard() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      
      {/* Sidebar Navigation */}
      <aside 
        className={`${isSidebarOpen ? 'w-64' : 'w-20'} 
          transition-all duration-300 ease-in-out hidden md:flex flex-col 
          bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-20`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
          {isSidebarOpen && (
            <div className="flex items-center gap-2 text-primary font-heading font-bold text-xl">
              <Sprout className="w-6 h-6" />
              <span>AgriSat</span>
            </div>
          )}
          {!isSidebarOpen && <Sprout className="w-6 h-6 text-primary mx-auto" />}
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavItem icon={<Map className="w-5 h-5" />} label="Visão Geral" active isOpen={isSidebarOpen} />
          <NavItem icon={<Droplets className="w-5 h-5" />} label="Irrigação" isOpen={isSidebarOpen} />
          <NavItem icon={<Activity className="w-5 h-5" />} label="Saúde da Cultura" isOpen={isSidebarOpen} />
          <NavItem icon={<CloudRain className="w-5 h-5" />} label="Clima" isOpen={isSidebarOpen} />
          <NavItem icon={<MapPin className="w-5 h-5" />} label="Talhões" isOpen={isSidebarOpen} />
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <NavItem icon={<Settings className="w-5 h-5" />} label="Configurações" isOpen={isSidebarOpen} />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!isSidebarOpen)} className="hidden md:flex">
              <Menu className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </Button>
            <h1 className="font-heading font-semibold text-lg text-slate-800 dark:text-white hidden sm:block">Fazenda Vale Verde</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500 mr-4">
              <span className="flex items-center gap-1"><Sun className="w-4 h-4 text-amber-500"/> 28°C</span>
              <span className="flex items-center gap-1"><Wind className="w-4 h-4 text-blue-400"/> 12 km/h</span>
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            <Avatar className="h-8 w-8 border border-slate-200">
              <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Agricultor" />
              <AvatarFallback>AG</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-heading font-bold text-slate-900 dark:text-white">Análise em Tempo Real</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Dados atualizados via satélite Copernicus há 12 minutos.</p>
              </div>
              <div className="flex items-center gap-2 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-full text-sm font-medium border border-green-200 dark:border-green-800/50">
                <CheckCircle2 className="w-4 h-4" />
                <span>Satélite Conectado</span>
              </div>
            </div>

            {/* Top Grid: Core Recommendation & Score */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* CORE: Irrigation Recommendation */}
              <Card className="lg:col-span-2 bg-gradient-to-br from-blue-500 to-blue-700 text-white border-0 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <CardHeader className="pb-2 relative z-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-blue-50 font-medium text-lg flex items-center gap-2">
                        <Droplets className="w-5 h-5" /> Recomendação de Irrigação
                      </CardTitle>
                      <CardDescription className="text-blue-100 mt-1">Baseado na evaporação, solo e previsão de chuva</CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-md font-medium">
                      Talhão Principal (Soja)
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10 pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
                      <div className="text-blue-100 text-sm font-medium mb-1">Volume Ideal</div>
                      <div className="text-3xl font-heading font-bold">12 <span className="text-lg font-normal text-blue-200">mm</span></div>
                      <div className="text-xs text-blue-200 mt-2">Equivale a 120m³/ha</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
                      <div className="text-blue-100 text-sm font-medium mb-1">Melhor Horário</div>
                      <div className="text-3xl font-heading font-bold">22:00 <span className="text-lg font-normal text-blue-200">h</span></div>
                      <div className="text-xs text-blue-200 mt-2">Menor perda por evaporação</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
                      <div className="text-blue-100 text-sm font-medium mb-1">Próximos Dias</div>
                      <div className="text-xl font-heading font-bold mt-2">Hoje e Quinta</div>
                      <div className="text-xs text-blue-200 mt-2">Pular quarta (chuva prevista)</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="relative z-10 pt-4 border-t border-white/10 mt-4">
                  <Button className="w-full sm:w-auto bg-white text-blue-700 hover:bg-blue-50 font-semibold shadow-sm">
                    Aplicar Recomendação
                  </Button>
                  <span className="text-xs text-blue-200 ml-4 hidden sm:block">Economia estimada: 18% em relação à média histórica.</span>
                </CardFooter>
              </Card>

              {/* Health Score */}
              <Card className="glass-panel border-slate-200/60 dark:border-slate-800">
                <CardHeader className="pb-2 text-center">
                  <CardTitle className="text-slate-600 dark:text-slate-400 font-medium text-sm">Score Agrícola (ISP)</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center pt-2">
                  <div className="relative w-40 h-40 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90 absolute inset-0" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-slate-800" />
                      <circle 
                        cx="50" cy="50" r="45" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="8" 
                        strokeLinecap="round"
                        className="text-primary"
                        strokeDasharray={`${88 * 2.83} 283`} // 88%
                      />
                    </svg>
                    <div className="text-center flex flex-col items-center">
                      <span className="text-5xl font-heading font-bold text-slate-800 dark:text-white tracking-tighter">88</span>
                      <span className="text-sm text-slate-500 font-medium">/ 100</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-6 text-sm font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                    <TrendingUp className="w-4 h-4" />
                    <span>+3% desde a última semana</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 w-full mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-center">
                      <div className="text-xs text-slate-500 mb-1">Vegetação</div>
                      <div className="text-slate-800 dark:text-slate-200 font-semibold">Excelente</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-slate-500 mb-1">Estresse Hídrico</div>
                      <div className="text-slate-800 dark:text-slate-200 font-semibold">Baixo</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Maps and Analysis Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Satellite Vegetation Health */}
              <Card className="glass-panel overflow-hidden border-slate-200/60 dark:border-slate-800">
                <CardHeader className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-b border-slate-100 dark:border-slate-800 z-10">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-primary" /> Saúde da Plantação
                      </CardTitle>
                      <CardDescription>NDVI via Copernicus (Tempo quase real)</CardDescription>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400">
                      Livre de anomalias
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0 relative h-[300px]">
                  <img src={satelliteFarm} alt="Mapa da fazenda via satélite" className="w-full h-full object-cover object-center" />
                  {/* Overlay UI elements on the map */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-lg p-3 shadow-lg border border-white/20 text-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="font-medium text-slate-700 dark:text-slate-300">Alta Vitalidade</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        <span className="font-medium text-slate-700 dark:text-slate-300">Atenção Leve</span>
                      </div>
                    </div>
                    <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white dark:bg-slate-800/90 backdrop-blur-md shadow-lg">
                      Ampliar <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Soil Analysis */}
              <Card className="glass-panel overflow-hidden border-slate-200/60 dark:border-slate-800">
                <CardHeader className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-b border-slate-100 dark:border-slate-800 z-10">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <ThermometerSun className="w-5 h-5 text-orange-500" /> Análise de Solo
                      </CardTitle>
                      <CardDescription>Umidade e Temperatura (Sem sensores físicos)</CardDescription>
                    </div>
                    <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50 dark:border-orange-900/50 dark:text-orange-400 dark:bg-orange-950/30">
                      24.5°C Média
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0 relative h-[300px]">
                  <img src={soilHeatmap} alt="Heatmap de umidade do solo" className="w-full h-full object-cover object-center grayscale-[20%]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                  
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-xl p-4 text-white">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-medium text-slate-300">Nível de Umidade do Solo</span>
                        <span className="font-bold text-blue-400">42%</span>
                      </div>
                      <Progress value={42} className="h-2 bg-slate-700"  />
                      <div className="flex justify-between text-xs text-slate-400 mt-2">
                        <span>Crítico (0-20%)</span>
                        <span>Ideal (40-60%)</span>
                        <span>Saturado (&gt;80%)</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bottom Section: Forecast Chart */}
            <Card className="glass-panel border-slate-200/60 dark:border-slate-800">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CloudRain className="w-5 h-5 text-blue-500" /> Previsão de Necessidade Hídrica
                    </CardTitle>
                    <CardDescription>Evapotranspiração estimada vs Necessidade de reposição (7 dias)</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={waterForecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorNeed" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorEvap" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(150, 150, 150, 0.2)" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                        cursor={{ stroke: 'rgba(150, 150, 150, 0.2)', strokeWidth: 2 }}
                      />
                      <Area type="monotone" name="Necessidade (mm)" dataKey="need" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorNeed)" />
                      <Area type="monotone" name="Evaporação (mm)" dataKey="evaporated" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorEvap)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </main>
    </div>
  );
}

// Helper Component for Sidebar
function NavItem({ icon, label, active = false, isOpen }: { icon: React.ReactNode, label: string, active?: boolean, isOpen: boolean }) {
  return (
    <a 
      href="#" 
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group
        ${active 
          ? 'bg-primary/10 text-primary font-medium' 
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
        }`}
    >
      <div className={`${active ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`}>
        {icon}
      </div>
      {isOpen && <span>{label}</span>}
    </a>
  );
}