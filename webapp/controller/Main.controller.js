sap.ui.define([
  "sap/ui/core/mvc/Controller"
], function (Controller) {
  "use strict";

  return Controller.extend("project2.controller.Main", {
    onInit: function () {
      // Product Card tıklama
      this.byId("cardProduct").attachBrowserEvent("click", function() {
        this.getOwnerComponent().getRouter().navTo("RouteView1");
      }.bind(this));

      // Employee Card tıklama
      this.byId("cardEmployee").attachBrowserEvent("click", function() {
        this.getOwnerComponent().getRouter().navTo("RouteView3");
      }.bind(this));

      // Table Card tıklama
      this.byId("cardTable").attachBrowserEvent("click", function() {
        this.getOwnerComponent().getRouter().navTo("TablePage");
      }.bind(this));
    }
  });
});
