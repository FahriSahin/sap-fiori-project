sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
  "use strict";

  return Controller.extend("project2.controller.TablePage", {
    onInit: function() {
      const oODataModel = this.getOwnerComponent().getModel();

      // Summary_of_Sales_by_Years verisini çek
      oODataModel.read("/Summary_of_Sales_by_Years", {
        success: function(oData) {
          // month ve Sales değerlerini uygun formatta JSON modeline aktar
          const monthNames = ["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"];
          
          const aSales = oData.results.map(item => {
            const date = new Date(item.ShippedDate); // ShippedDate alanı
            return {
              month: monthNames[date.getMonth()] + " " + date.getFullYear(), // Örn: "Tem 1996"
              Sales: parseFloat(item.Subtotal) // sayısal değer
            };
          });

          const oJSONModel = new JSONModel({ SalesByMonth: aSales });
          this.getView().setModel(oJSONModel, "salesModel"); // model adı salesModel

          console.log("Sales by Month:", aSales);
        }.bind(this),
        error: function(oError) {
          console.error("Failed to load sales:", oError);
        }
      });
    }
  });
});
