import { createApp } from "vue";
import App from "./App.vue";

import "../src/assets/product.css";
import "./style.css";

import "primevue/resources/themes/saga-blue/theme.css"; // theme
import "primevue/resources/primevue.min.css"; // core css
import "primeicons/primeicons.css"; // icons

import PrimeVue from "primevue/config";
import BadgeDirective from "primevue/badgedirective";

import InputText from "primevue/inputtext";
import PanelMenu from "primevue/panelmenu";
import ToastService from "primevue/toastservice";
import ConfirmationService from 'primevue/confirmationservice';
import Tooltip from 'primevue/tooltip';

import { OhVueIcon } from "oh-vue-icons";

import { createPinia } from 'pinia';
import router from "./router/index";
import axios from "axios";

import {importIcons} from "./utils/icon-imports.js";

import {config} from "../application.config.js";

importIcons();

axios.defaults.baseURL = config.apiUrl;

const app = createApp(App);
const pinia = createPinia();

app.use(PrimeVue).use(pinia).use(router, axios).use(ToastService).use(ConfirmationService);
app.directive("badge", BadgeDirective);

app.component("InputText", InputText);
app.component("PanelMenu", PanelMenu);
app.component('VIcon', OhVueIcon);
app.directive("tooltip", Tooltip);
app.config.devtools = true;
app.config.globalProperties.test = 'asd';

app.mount("#app");
