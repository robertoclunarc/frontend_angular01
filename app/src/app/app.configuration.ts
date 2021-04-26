import { environment } from '../environments/environment';

//const API_URL = environment.apiUrlGlobal;
const API_URL = environment.apiUrl;

export class Configuration {
    public static isProduction = environment.production;
    public static urlCompanyAdm = API_URL + 'admConfig';
    public static urlCompanyNomi = API_URL + 'nomiConfig';
    public static urlCompanyConta = API_URL + 'contaConfig';
    public static urlLogin = API_URL + 'login';
    public static urlFacturacion = API_URL + 'adm/ventas/facturas';
    public static urlNomina = API_URL + 'nomina';
    //public static urlContaBalance = API_URL+'conta/balance/check';
    public static urlContaBalance = API_URL + 'conta/balance/check1';

    public static isEmpty(obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop))
                return false;
        }

        return JSON.stringify(obj) === JSON.stringify({});
    }

    public static numberFormat(x, whitDecimal: boolean = false, simdolar: boolean = false) {
        if (whitDecimal) {
            x = parseFloat(x);
            x = x.toFixed(2);
        }
        x = x.toString();
        x = x.replace(".", ",");
        var pattern = /(-?\d+)(\d{3})/;
        while (pattern.test(x))
            x = x.replace(pattern, "$1.$2");
        return simdolar ? '$ ' + x : x;
    }

    public static stringToNumber(x) {
        x = x.toString();
        x = x.split(".").join("");
        x = x.replace(",", ".");
        x = parseFloat(x);
        return x;
    }

    public static getdatetime(dt) {
        var res = "";
        res += this.formatdigits(dt.getDate());
        res += "/";
        res += this.formatdigits(dt.getMonth() + 1);
        res += "/";
        res += this.formatdigits(dt.getFullYear());
        res += " ";
        res += this.formatdigits(dt.getHours() > 12 ? dt.getHours() - 12 : dt.getHours());
        res += ":";
        res += this.formatdigits(dt.getMinutes());
        res += ":";
        res += this.formatdigits(dt.getSeconds());
        res += " " + (dt.getHours() > 11 ? "PM" : "AM");
        return res;
    }

    private static formatdigits(val) {
        val = val.toString();
        return val.length == 1 ? "0" + val : val;
    }

    public static getMenuConfig(menuOf: string) {
        var items: MenuItem[];
        if (menuOf == "nomiRol") {
            items = [
                {
                    label: 'CestaTicket',
                    icon: '',
                    routerLink: '/cestaticket'
                },
                {
                    label: 'Otras transacciones',
                    icon: '',
                    routerLink: '/othertrans'
                },

            ];
        }
        if (menuOf == "admRol") {
            items = [
                {
                    label: 'Facturacion de Ventas',
                    icon: '',
                    routerLink: '/invoice'
                },
                {
                    label: 'Balance de Comprobación',
                    icon: '',
                    routerLink: '/balance'
                },

            ];
        }
        if (menuOf == "standard") {
            items = [
                {
                    label: 'Cerrar sesión',
                    icon: '',
                    routerLink: '/logout'
                },
            ];
        }
        return items;
    }
}

export class MenuItem {
    public label: string;
    public icon: string;
    public routerLink: string;
}
