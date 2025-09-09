/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

// Styles
import "./stylesheets/index.js";

// Libs
import "arrive";
import "snackbarjs";
import "bootstrap-material-design/js/index";
import "bootstrap-colorpicker";
import moment from "moment-timezone";
import * as CanvasComponents from "../core/lib/CanvasComponents.mjs";

// CyberChef
import App from "./App.mjs";
import Categories from "../core/config/Categories.json" assert {type: "json"};
import OperationConfig from "../core/config/OperationConfig.json" assert {type: "json"};

// Internationalization
import I18n from "./i18n/I18n.mjs";
import LanguageSelector from "./components/LanguageSelector.mjs";


/**
 * Main function used to build the CyberChef web app.
 */
function main() {
    // Initialize internationalization
    window.i18n = new I18n();

    const defaultFavourites = [
        "To Base64",
        "From Base64",
        "To Hex",
        "From Hex",
        "To Hexdump",
        "From Hexdump",
        "URL Decode",
        "Regular expression",
        "Entropy",
        "Fork",
        "Magic"
    ];

    const defaultOptions = {
        updateUrl:           true,
        showHighlighter:     true,
        wordWrap:            true,
        showErrors:          true,
        errorTimeout:        4000,
        attemptHighlight:    true,
        theme:               "classic",
        useMetaKey:          false,
        logLevel:            "info",
        autoMagic:           true,
        imagePreview:        true,
        syncTabs:            true,
        showCatCount:        false,
        language:            window.i18n.getCurrentLanguage(), // 添加语言选项
    };

    document.removeEventListener("DOMContentLoaded", main, false);
    window.app = new App(Categories, OperationConfig, defaultFavourites, defaultOptions);

    // Initialize language selector
    window.languageSelector = new LanguageSelector(window.i18n);

    // Setup app
    window.app.setup();

    // Setup internationalization after app is loaded
    // Use setTimeout to ensure DOM is fully ready
    setTimeout(() => {
        setupI18n();
    }, 100);
}

/**
 * 设置国际化系统
 */
function setupI18n() {
    // 检查容器是否存在
    const container = document.getElementById("language-selector-container");
    if (!container) {
        // Container not found, language selector won't be available
        return;
    }
    
    // 渲染语言选择器
    try {
        window.languageSelector.render("language-selector-container");
        window.languageSelector.listenForLanguageChanges();
        
        // 设置一个全局标识符表示语言选择器已初始化
        window.languageSelectorReady = true;
    } catch (error) {
        // Language selector initialization failed
        window.languageSelectorReady = false;
    }

    // 更新加载消息为多语言
    updateLoadingMessages();

    // 初始化页面翻译
    setTimeout(() => {
        window.i18n.updatePage();
    }, 200);
}

/**
 * 更新加载消息为多语言
 */
function updateLoadingMessages() {
    // 如果加载消息还在显示，用翻译后的消息替换
    const loadingMessages = window.i18n.t("loading_messages");
    if (Array.isArray(loadingMessages) && loadingMessages.length > 0) {
        // 替换全局的loadingMsgs数组（如果存在）
        if (typeof window.loadingMsgs !== "undefined") {
            window.loadingMsgs = [...loadingMessages];
        }
    }
}

window.compileTime = moment.tz(COMPILE_TIME, "DD/MM/YYYY HH:mm:ss z", "UTC").valueOf();
window.compileMessage = COMPILE_MSG;

// Make libs available to operation outputs
window.CanvasComponents = CanvasComponents;

document.addEventListener("DOMContentLoaded", main, false);

