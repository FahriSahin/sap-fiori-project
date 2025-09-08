sap.ui.define([
    "sap/ui/core/UIComponent",
    "project2/model/models",
    "sap/ui/model/json/JSONModel"
], (UIComponent, models, JSONModel) => {
    "use strict";

    return UIComponent.extend("project2.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            UIComponent.prototype.init.apply(this, arguments);

            // Device model
            this.setModel(models.createDeviceModel(), "device");

            // Login modeli
            if (!this.getModel("login")) {
                const oLoginModel = new JSONModel({
                    isLoggedIn: localStorage.getItem("isLoggedIn") === "true" ||
                                sessionStorage.getItem("isLoggedIn") === "true"
                });
                this.setModel(oLoginModel, "login");
            }

            const oRouter = this.getRouter();

            // Route guard
            oRouter.attachBeforeRouteMatched((oEvent) => {
                const bLoggedIn = this.getModel("login").getProperty("/isLoggedIn");
                const sRouteName = oEvent.getParameter("name");

                // Login veya Register değilse ve giriş yapılmamışsa yönlendir
                if (!bLoggedIn && sRouteName !== "Login" && sRouteName !== "Register") {
                    oEvent.preventDefault();
                    // setTimeout ile navTo yap, replace ile history temizle
                    setTimeout(() => {
                        oRouter.navTo("Login", {}, true);
                    }, 0);
                }
            });

            // Router'ı initialize et
            oRouter.initialize();
        }
    });
});
