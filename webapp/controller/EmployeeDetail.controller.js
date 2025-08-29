sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel"
], function(Controller , Fragment , JSONModel) {
    "use strict";

    return Controller.extend("project2.controller.EmployeeDetail", {
        onInit: function() {
            const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("EmployeeDetail").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function(oEvent) {
            const sEmployeeID = oEvent.getParameter("arguments").EmployeeID;
            const oView = this.getView();

            // OData modelden employee detayını bind et
            oView.bindElement({
                path: "/Employees(" + sEmployeeID + ")"
            });
        },

        onNavBack: function() {
            const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteView3"); // Employees listesine dön
        },
           onOpenPictureFragment: function () {
    const oEmployee = this.getView().getBindingContext().getObject();

    if (!this._oPictureFragment) {
        this._oPictureFragment = Fragment.load({
            name: "project2.fragment.PictureFragment2",
            controller: this
        }).then(function (oFrag) {
            this.getView().addDependent(oFrag);
            return oFrag;
        }.bind(this));
    }

    this._oPictureFragment.then(function (oFrag) {
        const oModel = new JSONModel(oEmployee); // direkt employee nesnesi
        oFrag.setModel(oModel, "Employee");
        oFrag.open();
    }.bind(this));
}

,
       formatPicture: function(vBinary) {
  if (!vBinary) return null;

  // vBinary bazen string (base64), bazen ArrayBuffer/Uint8Array olabilir
  var base64;

  if (typeof vBinary === "string") {
    base64 = vBinary;
  } else if (vBinary instanceof ArrayBuffer) {
    var bytes = new Uint8Array(vBinary);
    var bin = "";
    for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    base64 = btoa(bin);
  } else if (vBinary instanceof Uint8Array) {
    var bin2 = "";
    for (var j = 0; j < vBinary.length; j++) bin2 += String.fromCharCode(vBinary[j]);
    base64 = btoa(bin2);
  } else {
    return null;
  }

  // OLE header'ı ayıkla: gerçek BMP verisinin 'BM' imzasını bul
  try {
    var raw = atob(base64);

    // 'BM' (0x42 0x4D) nerede başlıyorsa oradan itibaren kırp
    var bmIndex = raw.indexOf("BM");
    if (bmIndex > 0) {
      raw = raw.substring(bmIndex);
      base64 = btoa(raw);
      return "data:image/bmp;base64," + base64;
    }

    // OLE yoksa olası türleri dene
    if (raw.indexOf("\x89PNG") === 0)  return "data:image/png;base64," + base64;
    if (raw.indexOf("\xFF\xD8\xFF") === 0) return "data:image/jpeg;base64," + base64;
    if (raw.indexOf("GIF8") === 0) return "data:image/gif;base64," + base64;

    // Varsayılan: BMP
    return "data:image/bmp;base64," + base64;
  } catch (e) {
    // Hata olursa en azından bir MIME ile dön
    return "data:image/bmp;base64," + base64;
  }
},
    onClosePictureFragment: function(oEvent) { oEvent.getSource().getParent().close(); }
    });
});
