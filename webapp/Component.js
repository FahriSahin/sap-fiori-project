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

            // Router
            const oRouter = this.getRouter();
            oRouter.initialize();

            // Route guard
            oRouter.attachBeforeRouteMatched((oEvent) => {
                const bLoggedIn = this.getModel("login").getProperty("/isLoggedIn");
                const sRouteName = oEvent.getParameter("name");

                // Eğer login değilse ve route Login/Register değilse yönlendir
                if (!bLoggedIn && sRouteName !== "Login" && sRouteName !== "Register") {
                    oEvent.preventDefault(); // route değişimini durdur
                    oRouter.navTo("Login");
                }
            });
        }
    });
});
