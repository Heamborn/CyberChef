/**
 * 国际化管理器
 * @author CyberChef Translator
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */

/**
 * 国际化管理类
 */
class I18n {

    /**
     * I18n构造函数
     */
    constructor() {
        this.translations = {
            "en": {
                "common": {
                    "loading": "Loading...",
                    "search": "Search..."
                },
                "header": {
                    "title": "CyberChef",
                    "subtitle": "The Cyber Swiss Army Knife",
                    "download": "Download CyberChef",
                    "options": "Options",
                    "about": "About / Support"
                },
                "operations": {
                    "title": "Operations",
                    "search_placeholder": "Search...",
                    "edit_favourites": "Edit Favourites"
                },
                "recipe": {
                    "title": "Recipe"
                },
                "loading_messages": [
                    "Proving P = NP...",
                    "Computing 6 x 9...",
                    "Mining bitcoin...",
                    "Dividing by 0...",
                    "Initialising Skynet...",
                    "[REDACTED]",
                    "Downloading more RAM...",
                    "Ordering 1s and 0s...",
                    "Navigating neural network...",
                    "Importing machine learning...",
                    "正在添加大语言模型幻觉..."
                ]
            },
            "zh": {
                "common": {
                    "loading": "加载中...",
                    "search": "搜索..."
                },
                "header": {
                    "title": "CyberChef",
                    "subtitle": "网络瑞士军刀",
                    "download": "下载 CyberChef",
                    "options": "选项",
                    "about": "关于 / 支持"
                },
                "operations": {
                    "title": "操作",
                    "search_placeholder": "搜索...",
                    "edit_favourites": "编辑收藏夹"
                },
                "recipe": {
                    "title": "配方"
                },
                "loading_messages": [
                    "正在证明 P = NP...",
                    "正在计算 6 x 9...",
                    "正在挖掘比特币...",
                    "正在除以 0...",
                    "正在初始化天网...",
                    "[已编辑]",
                    "正在下载更多内存...",
                    "正在排列 1 和 0...",
                    "正在导航神经网络...",
                    "正在导入机器学习...",
                    "正在添加大语言模型幻觉..."
                ]
            }
        };

        this.supportedLanguages = {
            "en": {
                "name": "English",
                "nativeName": "English",
                "code": "en"
            },
            "zh": {
                "name": "Chinese",
                "nativeName": "中文",
                "code": "zh"
            }
        };

        this.currentLanguage = this.getStoredLanguage() || this.detectBrowserLanguage() || "en";
        this.fallbackLanguage = "en";
    }

    /**
     * 获取存储的语言设置
     */
    getStoredLanguage() {
        try {
            const options = JSON.parse(localStorage.getItem("options"));
            return options && options.language;
        } catch (err) {
            return null;
        }
    }

    /**
     * 检测浏览器语言
     */
    detectBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split("-")[0];

        // 检查是否支持检测到的语言
        if (this.supportedLanguages[langCode]) {
            return langCode;
        }

        return null;
    }

    /**
     * 设置当前语言
     */
    setLanguage(langCode) {
        if (!this.supportedLanguages[langCode]) {
            return;
        }

        this.currentLanguage = langCode;

        // 保存到localStorage
        try {
            const options = JSON.parse(localStorage.getItem("options")) || {};
            options.language = langCode;
            localStorage.setItem("options", JSON.stringify(options));
        } catch (err) {
            // Language preference could not be saved
        }

        // 触发语言变更事件
        this.onLanguageChange();
    }

    /**
     * 获取翻译文本
     */
    t(key, params = {}) {
        let translation = this.getTranslation(this.currentLanguage, key) ||
                         this.getTranslation(this.fallbackLanguage, key) ||
                         key;

        // 参数替换
        Object.keys(params).forEach(param => {
            translation = translation.replace(new RegExp(`{{${param}}}`, "g"), params[param]);
        });

        return translation;
    }

    /**
     * 获取指定语言的翻译
     */
    getTranslation(langCode, key) {
        const translations = this.translations[langCode];
        if (!translations) return null;

        // 支持点分隔的嵌套键，如 "menu.file.save"
        const keys = key.split(".");
        let result = translations;

        for (const k of keys) {
            if (result && typeof result === "object" && Object.prototype.hasOwnProperty.call(result, k)) {
                result = result[k];
            } else {
                return null;
            }
        }

        return typeof result === "string" ? result : null;
    }

    /**
     * 获取当前语言代码
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    /**
     * 获取支持的语言列表
     */
    getSupportedLanguages() {
        return this.supportedLanguages;
    }

    /**
     * 语言变更回调
     */
    onLanguageChange() {
        // 更新HTML lang属性
        document.documentElement.lang = this.currentLanguage;

        // 触发自定义事件
        const event = new CustomEvent("languageChanged", {
            detail: {
                language: this.currentLanguage,
                translations: this.translations[this.currentLanguage]
            }
        });

        document.dispatchEvent(event);
    }

    /**
     * 更新页面中所有带有data-i18n属性的元素
     */
    updatePage() {
        // 更新所有带有data-i18n属性的元素
        const elements = document.querySelectorAll("[data-i18n]");
        elements.forEach(element => {
            const key = element.getAttribute("data-i18n");
            const translation = this.t(key);

            if (element.tagName === "INPUT" && (element.type === "text" || element.type === "search")) {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });

        // 更新带有data-i18n-title的元素（tooltip等）
        const titleElements = document.querySelectorAll("[data-i18n-title]");
        titleElements.forEach(element => {
            const key = element.getAttribute("data-i18n-title");
            const translation = this.t(key);
            element.title = translation;
            element.setAttribute("data-original-title", translation);
        });

        // 更新带有data-i18n-aria-label的元素
        const ariaElements = document.querySelectorAll("[data-i18n-aria-label]");
        ariaElements.forEach(element => {
            const key = element.getAttribute("data-i18n-aria-label");
            const translation = this.t(key);
            element.setAttribute("aria-label", translation);
        });

        // 更新带有data-i18n-placeholder的元素
        const placeholderElements = document.querySelectorAll("[data-i18n-placeholder]");
        placeholderElements.forEach(element => {
            const key = element.getAttribute("data-i18n-placeholder");
            const translation = this.t(key);
            element.placeholder = translation;
        });
    }
}

export default I18n;
