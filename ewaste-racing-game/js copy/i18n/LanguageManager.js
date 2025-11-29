// Language Manager - Handles internationalization
class LanguageManager {
    constructor() {
        this.currentLanguage = 'en';
        this.translations = Translations;
        this.loadSavedLanguage();
    }

    loadSavedLanguage() {
        const saved = localStorage.getItem(GameConfig.storage.language);
        if (saved && this.translations[saved]) {
            this.setLanguage(saved);
        }
    }

    setLanguage(lang) {
        if (!this.translations[lang]) {
            console.warn(`Language ${lang} not found, defaulting to English`);
            lang = 'en';
        }

        this.currentLanguage = lang;
        localStorage.setItem(GameConfig.storage.language, lang);

        // Set direction for RTL languages
        if (lang === 'ar') {
            document.documentElement.setAttribute('dir', 'rtl');
            document.documentElement.setAttribute('lang', 'ar');
        } else {
            document.documentElement.setAttribute('dir', 'ltr');
            document.documentElement.setAttribute('lang', lang);
        }

        // Update all translated elements
        this.updateUI();
    }

    get(key) {
        const keys = key.split('.');
        let value = this.translations[this.currentLanguage];

        for (const k of keys) {
            if (value && typeof value === 'object') {
                value = value[k];
            } else {
                // Fallback to English if translation not found
                value = this.translations.en;
                for (const fallbackKey of keys) {
                    if (value && typeof value === 'object') {
                        value = value[fallbackKey];
                    }
                }
                break;
            }
        }

        return value || key;
    }

    updateUI() {
        // Update all elements with data-i18n attribute
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.get(key);

            if (typeof translation === 'string') {
                element.textContent = translation;
            }
        });
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    isRTL() {
        return this.currentLanguage === 'ar';
    }
}

// Initialize global language manager
// Initialize global language manager
const languageManager = new LanguageManager();
window.languageManager = languageManager;
