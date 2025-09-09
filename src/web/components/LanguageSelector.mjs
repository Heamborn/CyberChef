/**
 * 语言选择器组件
 * @author CyberChef Translator
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */

/**
 * 语言选择器组件类
 */
class LanguageSelector {

    /**
     * 构造函数
     */
    constructor(i18n) {
        this.i18n = i18n;
        this.element = null;
    }

    /**
     * 创建语言选择器HTML
     */
    create() {
        const supportedLanguages = this.i18n.getSupportedLanguages();
        const currentLanguage = this.i18n.getCurrentLanguage();

        const selectorHtml = `
            <div class="language-selector dropdown">
                <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" id="languageDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i class="material-icons" style="font-size: 16px; margin-right: 4px;">language</i>
                    <span class="current-language">${supportedLanguages[currentLanguage].nativeName}</span>
                </button>
                <div class="dropdown-menu" aria-labelledby="languageDropdown">
                    ${Object.keys(supportedLanguages).map(langCode => `
                        <a class="dropdown-item language-option ${langCode === currentLanguage ? "active" : ""}"
                           href="#"
                           data-lang="${langCode}">
                            ${supportedLanguages[langCode].nativeName}
                        </a>
                    `).join("")}
                </div>
            </div>
        `;

        return selectorHtml;
    }

    /**
     * 渲染到指定容器
     */
    render(container) {
        if (typeof container === "string") {
            container = document.getElementById(container);
        }

        if (!container) {
            return;
        }

        container.innerHTML = this.create();
        this.element = container.querySelector(".language-selector");

        // 绑定事件
        this.bindEvents();
    }

    /**
     * 绑定事件处理器
     */
    bindEvents() {
        if (!this.element) return;

        const languageOptions = this.element.querySelectorAll(".language-option");

        languageOptions.forEach(option => {
            option.addEventListener("click", (e) => {
                e.preventDefault();
                const selectedLang = e.target.getAttribute("data-lang");
                this.changeLanguage(selectedLang);
            });
        });
    }

    /**
     * 切换语言
     */
    changeLanguage(langCode) {
        if (langCode === this.i18n.getCurrentLanguage()) {
            return; // 相同语言，无需切换
        }

        // 更新i18n语言
        this.i18n.setLanguage(langCode);

        // 更新UI
        this.updateUI();

        // 更新页面文本
        this.i18n.updatePage();
    }

    /**
     * 更新选择器UI
     */
    updateUI() {
        if (!this.element) return;

        const supportedLanguages = this.i18n.getSupportedLanguages();
        const currentLanguage = this.i18n.getCurrentLanguage();

        // 更新当前显示的语言
        const currentLangElement = this.element.querySelector(".current-language");
        if (currentLangElement) {
            currentLangElement.textContent = supportedLanguages[currentLanguage].nativeName;
        }

        // 更新active状态
        const languageOptions = this.element.querySelectorAll(".language-option");
        languageOptions.forEach(option => {
            const langCode = option.getAttribute("data-lang");
            if (langCode === currentLanguage) {
                option.classList.add("active");
            } else {
                option.classList.remove("active");
            }
        });
    }

    /**
     * 监听语言变化事件
     */
    listenForLanguageChanges() {
        document.addEventListener("languageChanged", () => {
            this.updateUI();
        });
    }
}

export default LanguageSelector;
