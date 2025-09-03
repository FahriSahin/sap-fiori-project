sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast",
  "sap/ui/model/json/JSONModel"
], function(Controller, MessageToast, JSONModel) {
  "use strict";

  return Controller.extend("project2.controller.Register", {

    onInit: function() {
      const oUsersModel = new JSONModel({
        Users: [
          { username: "admin", password: "1234" }
        ]
      });
      this.getView().setModel(oUsersModel, "Users");
    },

    onRegister: function() {
      const sUsername = this.byId("usernameInput2").getValue();
      const sPassword = this.byId("passwordInput2").getValue();

      if (!sUsername || !sPassword) {
        MessageToast.show("Username ve Password boş olamaz!");
        return;
      }

      const oUsersModel = this.getView().getModel("Users");
      const aUsers = oUsersModel.getProperty("/Users") || [];

      if (aUsers.find(u => u.username === sUsername)) {
        MessageToast.show("Bu kullanıcı adı zaten var!");
        return;
      }

      // Modeli güncelle
      aUsers.push({ username: sUsername, password: sPassword });
      oUsersModel.setProperty("/Users", aUsers);

      MessageToast.show("Kayıt başarılı! Şimdi login olabilirsiniz.");
      this.getOwnerComponent().getRouter().navTo("Login");
    },

    onGoToLogin: function() {
      this.getOwnerComponent().getRouter().navTo("Login");
    }

  });
});
