sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast"
], function(Controller, MessageToast) {
  "use strict";

  return Controller.extend("project2.controller.Register", {

    onInit: function() {
      // Eğer Users yoksa, varsayılan admin kullanıcısı ekle
      if (!localStorage.getItem("Users")) {
        const defaultUsers = [
          { username: "admin", password: "1234" }
        ];
        localStorage.setItem("Users", JSON.stringify(defaultUsers));
      }
    },

    onRegister: function() {
      const sUsername = this.byId("usernameInput2").getValue();
      const sPassword = this.byId("passwordInput2").getValue();

      if (!sUsername || !sPassword) {
        MessageToast.show("Username ve Password boş olamaz!");
        return;
      }

      // LocalStorage'dan kullanıcıları al
      const aUsers = JSON.parse(localStorage.getItem("Users")) || [];

      // Kullanıcı adı daha önce alınmış mı kontrol et
      if (aUsers.find(u => u.username === sUsername)) {
        MessageToast.show("Bu kullanıcı adı zaten var!");
        return;
      }

      // Yeni kullanıcı ekle
      aUsers.push({ username: sUsername, password: sPassword });
      localStorage.setItem("Users", JSON.stringify(aUsers));

      MessageToast.show("Kayıt başarılı! Şimdi login olabilirsiniz.");
      this.getOwnerComponent().getRouter().navTo("Login");
    },

    onGoToLogin: function() {
      this.getOwnerComponent().getRouter().navTo("Login");
    }

  });
});
