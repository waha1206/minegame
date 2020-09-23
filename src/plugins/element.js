import Vue from "vue";
import { Button, RadioButton, RadioGroup } from "element-ui";
import lang from "element-ui/lib/locale/lang/zh-TW";
import locale from "element-ui/lib/locale";

locale.use(lang);

Vue.use(Button);
Vue.use(RadioButton);
Vue.use(RadioGroup);
