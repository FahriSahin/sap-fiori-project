sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function(Controller, MessageToast) {
    "use strict";

    return Controller.extend("project2.controller.Login", {

        onInit: function() {
            // Default admin kullanıcı ekle
            if (!localStorage.getItem("Users")) {
                const defaultUsers = [{ username: "admin", password: "1234" }];
                localStorage.setItem("Users", JSON.stringify(defaultUsers));
            }
        },

        onLogin: function() {
            const sUsername = this.byId("usernameInput").getValue();
            const sPassword = this.byId("passwordInput").getValue();
            const bRememberMe = this.byId("rememberMeCheckBox").getSelected();

            const aUsers = JSON.parse(localStorage.getItem("Users")) || [];
            const oUser = aUsers.find(u => u.username === sUsername && u.password === sPassword);

            if (oUser) {
                const oLoginModel = this.getOwnerComponent().getModel("login");

                if (bRememberMe) {
                    localStorage.setItem("isLoggedIn", "true");
                    localStorage.setItem("username", sUsername);
                } else {
                    sessionStorage.setItem("isLoggedIn", "true");
                    sessionStorage.setItem("username", sUsername);
                }

                if (oLoginModel) {
                    oLoginModel.setProperty("/isLoggedIn", true);
                }

                MessageToast.show(this.getOwnerComponent().getModel("i18n").getProperty("loginSuccess"));
                this.getOwnerComponent().getRouter().navTo("Main");
            } else {
                MessageToast.show(this.getOwnerComponent().getModel("i18n").getProperty("loginFailed"));
            }
        },

        onGoToRegister: function() {
            this.getOwnerComponent().getRouter().navTo("Register");
        },

        onLanguageChange: function(oEvent) {
            const sSelectedKey = oEvent.getParameter("selectedItem").getKey();

            if (sSelectedKey === "tr") {
                this.getOwnerComponent().setModel(this.getOwnerComponent().getModel("i18n_tr"), "i18n");
            } else {
                this.getOwnerComponent().setModel(this.getOwnerComponent().getModel("i18n"), "i18n");
            }
        },

        onLogout: function() {
            // Hem local hem session temizle
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("username");
            sessionStorage.removeItem("isLoggedIn");
            sessionStorage.removeItem("username");

            const oLoginModel = this.getOwnerComponent().getModel("login");
            if (oLoginModel) {
                oLoginModel.setProperty("/isLoggedIn", false);
            }

            this.getOwnerComponent().getRouter().navTo("Login");
            MessageToast.show(this.getOwnerComponent().getModel("i18n").getProperty("logoutSuccess") || "Logged out");
        }
    });
});
