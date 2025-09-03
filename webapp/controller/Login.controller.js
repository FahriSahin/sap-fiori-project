sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast"
], function(Controller, MessageToast) {
  "use strict";

  return Controller.extend("project2.controller.Login", {

    onInit: function() {
      // Manifest.json'daki Users modelini alıyoruz
      const oUsersModel = this.getView().getModel("Users");
    },

    onLogin: function() {
      const oUsersModel = this.getView().getModel("Users");
      if (!oUsersModel) {
        MessageToast.show("Users model henüz yüklenmedi!");
        return;
      }

      const aUsers = oUsersModel.getProperty("/Users") || [];
      const sUsername = this.byId("usernameInput").getValue();
      const sPassword = this.byId("passwordInput").getValue();

      const oUser = aUsers.find(u => u.username === sUsername && u.password === sPassword);

      if (oUser) {
        MessageToast.show("Login successful!");
        this.getOwnerComponent().getRouter().navTo("Main");
      } else {
        MessageToast.show("Invalid username or password!");
      }
    },

    onGoToRegister: function() {
      this.getOwnerComponent().getRouter().navTo("Register");
    }

  });
});
