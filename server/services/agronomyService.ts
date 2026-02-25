import { differenceInDays, parseISO } from "date-fns";

export interface AgronomicContext {
    calendar: string;
    technicalTips: string;
    growthStage: string;
}

const AGRICULTURAL_CALENDAR: Record<string, any> = {
    "Soja": {
        "Huambo": { planting: "Outubro - Dezembro", harvest: "Abril - Junho" },
        "Bié": { planting: "Outubro - Novembro", harvest: "Março - Maio" },
        "Malanje": { planting: "Setembro - Novembro", harvest: "Fevereiro - Abril" },
        "default": { planting: "Setembro - Dezembro", harvest: "Março - Julho" }
    },
    "Milho": {
        "Huambo": { planting: "Setembro - Dezembro", harvest: "Março - Junho" },
        "Huíla": { planting: "Outubro - Janeiro", harvest: "Maio - Agosto" },
        "default": { planting: "Setembro - Janeiro", harvest: "Março - Agosto" }
    },
    "Algodão": {
        "Malanje": { planting: "Novembro - Janeiro", harvest: "Junho - Setembro" },
        "default": { planting: "Novembro - Janeiro", harvest: "Junho - Outubro" }
    }
};

const CROP_KNOWLEDGE: Record<string, any> = {
    "Soja": {
        "Emergência": "Foco em controle de ervas daninhas e monitoramento de lagartas elasmopalpus.",
        "Vegetativo": "Necessidade moderada de água. Verificar nódulos de nitrogênio nas raízes.",
        "Floração": "Fase crítica para água. Manter solo húmido. Evitar stress térmico.",
        "Maturação": "Reduzir irrigação. Monitorar humidade do grão para colheita."
    },
    "Milho": {
        "Emergência": "Proteção contra pássaros e insetos de solo (rosca).",
        "Desenvolvimento": "Aplicação de cobertura de Nitrogénio (Ureia). Controlar lagarta do cartucho.",
        "Pendoamento": "Consumo máximo de água. Stress hídrico aqui reduz a produtividade drasticamente.",
        "Enchimento": "Monitorar quebra de colmo e sanidade foliar."
    }
};

export function getAgronomicContext(crop: string, province: string, plantingDate?: string): AgronomicContext {
    const provinceCalendar = AGRICULTURAL_CALENDAR[crop]?.[province] || AGRICULTURAL_CALENDAR[crop]?.["default"] || { planting: "Variável", harvest: "Variável" };
    const calendarInfo = `Época recomendada em ${province}: Plantio (${provinceCalendar.planting}), Colheita (${provinceCalendar.harvest}).`;

    let growthStage = "Desconhecido";
    let technicalTips = "Manter monitoramento geral do talhão.";

    if (plantingDate) {
        const daysSincePlanting = differenceInDays(new Date(), parseISO(plantingDate));

        // Simplfied growth stage calculation
        if (daysSincePlanting < 15) growthStage = "Emergência";
        else if (daysSincePlanting < 60) growthStage = "Vegetativo / Desenvolvimento";
        else if (daysSincePlanting < 90) growthStage = "Floração / Pendoamento";
        else growthStage = "Maturação / Enchimento";

        const tips = CROP_KNOWLEDGE[crop];
        if (tips) {
            if (growthStage.includes("Emergência")) technicalTips = tips["Emergência"];
            else if (growthStage.includes("Vegetativo")) technicalTips = tips["Vegetativo"] || tips["Desenvolvimento"];
            else if (growthStage.includes("Floração")) technicalTips = tips["Floração"] || tips["Pendoamento"];
            else technicalTips = tips["Maturação"] || tips["Enchimento"];
        }
    }

    return {
        calendar: calendarInfo,
        technicalTips,
        growthStage
    };
}
