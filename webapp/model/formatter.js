sap.ui.define(["sap/ui/core/ValueState"], function(ValueState) {
    "use strict";

    return {
        formatPicture: function(bValue) {
            console.log("selam")
        if (bValue) {
            // OData Binary (base64) stringini data URI formatına çevir
            return "data:image/png;base64," + bValue;
        }
        return null; // yoksa boş dön
        }
    };
});
