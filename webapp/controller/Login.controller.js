sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast"
], function(Controller, MessageToast) {
  "use strict";

  return Controller.extend("project2.controller.Login", {

    onInit: function() {
      // Eğer daha önce kayıtlı kullanıcı yoksa, default admin ekle
      if (!localStorage.getItem("Users")) {
        const defaultUsers = [
          { username: "admin", password: "1234" }
        ];
        localStorage.setItem("Users", JSON.stringify(defaultUsers));
      }
    },

    onLogin: function() {
      const sUsername = this.byId("usernameInput").getValue();
      const sPassword = this.byId("passwordInput").getValue();

      // LocalStorage'dan kullanıcıları al
      const aUsers = JSON.parse(localStorage.getItem("Users")) || [];

      const oUser = aUsers.find(u => u.username === sUsername && u.password === sPassword);

      if (oUser) {
        MessageToast.show(this.getView().getModel("i18n").getProperty("loginSuccess"));
        this.getOwnerComponent().getRouter().navTo("Main");
      } else {
        MessageToast.show(this.getView().getModel("i18n").getProperty("loginFailed"));
      }
    },

    onGoToRegister: function() {
      this.getOwnerComponent().getRouter().navTo("Register");
    },

    onLanguageChange: function(oEvent) {
    var sSelectedKey = oEvent.getParameter("selectedItem").getKey(); // "en" veya "tr"
    var oView = this.getView();

    if (sSelectedKey === "tr") {
        var oModelTR = this.getOwnerComponent().getModel("i18n_tr");
        oView.setModel(oModelTR, "i18n");
    } else {
        var oModelEN = this.getOwnerComponent().getModel("i18n");
        oView.setModel(oModelEN, "i18n");
    }
}


  });
});
