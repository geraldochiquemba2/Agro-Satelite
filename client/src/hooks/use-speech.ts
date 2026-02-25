import { useState, useEffect, useCallback, useRef } from "react";

export interface SpeechVoice {
    name: string;
    lang: string;
    voice: SpeechSynthesisVoice;
    isPortuguese: boolean;
}

interface UseSpeechReturn {
    speak: (text: string) => void;
    stop: () => void;
    isSpeaking: boolean;
    isSupported: boolean;
    voices: SpeechVoice[];
    selectedVoice: SpeechVoice | null;
    setSelectedVoice: (voice: SpeechVoice) => void;
    currentText: string | null;
}

export function useSpeech(): UseSpeechReturn {
    const [voices, setVoices] = useState<SpeechVoice[]>([]);
    const [selectedVoice, setSelectedVoice] = useState<SpeechVoice | null>(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [currentText, setCurrentText] = useState<string | null>(null);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    const isSupported = typeof window !== "undefined" && "speechSynthesis" in window;

    const loadVoices = useCallback(() => {
        if (!isSupported) return;
        const raw = window.speechSynthesis.getVoices();
        if (raw.length === 0) return;

        const mapped: SpeechVoice[] = raw.map((v) => ({
            name: v.name,
            lang: v.lang,
            voice: v,
            isPortuguese: v.lang.startsWith("pt"),
        }));

        // Sort: Portuguese voices first, then by name
        mapped.sort((a, b) => {
            if (a.isPortuguese && !b.isPortuguese) return -1;
            if (!a.isPortuguese && b.isPortuguese) return 1;
            return a.name.localeCompare(b.name);
        });

        setVoices(mapped);

        // Auto-select the best Portuguese voice
        const ptBest =
            mapped.find((v) => v.lang === "pt-PT") ||
            mapped.find((v) => v.lang === "pt-BR") ||
            mapped.find((v) => v.isPortuguese) ||
            mapped[0];

        setSelectedVoice((prev) => prev ?? ptBest ?? null);
    }, [isSupported]);

    useEffect(() => {
        if (!isSupported) return;
        loadVoices();
        window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
        return () => {
            window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
        };
    }, [isSupported, loadVoices]);

    const speak = useCallback(
        (text: string) => {
            if (!isSupported) return;

            // Stop any current speech
            window.speechSynthesis.cancel();

            // Sanitize text: Remove Markdown symbols like **, *, __, _, #, etc.
            const sanitizedText = text
                .replace(/\*+/g, "") // Remove asterisks
                .replace(/#+/g, "")  // Remove hashtags
                .replace(/_+/g, " ") // Replace underscores with space
                .replace(/`+/g, "")  // Remove backticks
                .replace(/\[/g, "")  // Remove brackets
                .replace(/\]/g, "")
                .replace(/\(/g, "")  // Remove parentheses (metadata)
                .replace(/\)/g, "")
                .replace(/\n+/g, " "); // Replace newlines with space for smoother flow

            const utterance = new SpeechSynthesisUtterance(sanitizedText);
            utterance.rate = 0.92;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;

            if (selectedVoice) {
                utterance.voice = selectedVoice.voice;
                utterance.lang = selectedVoice.lang;
            } else {
                utterance.lang = "pt-PT";
            }

            utterance.onstart = () => {
                setIsSpeaking(true);
                setCurrentText(text);
            };
            utterance.onend = () => {
                setIsSpeaking(false);
                setCurrentText(null);
            };
            utterance.onerror = () => {
                setIsSpeaking(false);
                setCurrentText(null);
            };

            utteranceRef.current = utterance;
            window.speechSynthesis.speak(utterance);
        },
        [isSupported, selectedVoice]
    );

    const stop = useCallback(() => {
        if (!isSupported) return;
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setCurrentText(null);
    }, [isSupported]);

    return { speak, stop, isSpeaking, isSupported, voices, selectedVoice, setSelectedVoice, currentText };
}
