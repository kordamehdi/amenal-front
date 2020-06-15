import { FicheService } from "./../../fiche.service";
import { DocumentSerive } from "./document.service";
import { documentModel } from "./../../../models/fiche-document.model";
import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import * as App from "../../../../store/app.reducers";
import * as fromFicheAction from "../../redux/fiche.action";

@Component({
  selector: "app-document",
  templateUrl: "./document.component.html",
  styleUrls: ["./document.component.scss"]
})
export class DocumentComponent implements OnInit {
  position = 1;
  size = 1;

  documents: documentModel[];
  documents$: documentModel[];
  documents$$: documentModel[];

  docSelectedIndex = -1;

  documentToDeleteId = -1;

  isUpdate = -1;

  docToAssId = -1;

  assDocToPrjt = true;

  navPas = 5;

  errorMsg = "";
  showAlert = false;
  constructor(
    private store: Store<App.AppState>,
    private documentService: DocumentSerive,
    private ficheService: FicheService
  ) {}

  ngOnInit() {
    this.documentService.OnGetDocuments();
    this.store.select("ficheDocument").subscribe(state => {
      this.documents$$ = state.documents;

      this.documents$ = this.documents$$;
      this.documents = this.documents$$.slice(0, this.navPas);
      this.size = Math.trunc(this.documents$$.length / this.navPas);
      if (this.size < this.documents$$.length / this.navPas)
        this.size = this.size + 1;
    });

    this.store.select("fiche").subscribe(state => {
      if (state.type === "document") {
        this.errorMsg = state.errorMsg;
        this.showAlert = state.showAlert;
      }
    });
  }

  onAddClick() {
    this.isUpdate = 0;
  }

  onAddClickOutside(input) {
    if (this.isUpdate === 0) {
      let value = input.value.trim();
      if (value !== "") this.documentService.OnSaveDocument(value);
      input.value = "";
      this.isUpdate = -1;
    }
  }
  onUpdateClick(inputUpdate, i) {
    setTimeout(() => {
      this.assDocToPrjt = false;
      this.docSelectedIndex = i;
      inputUpdate.disabled = false;
      this.isUpdate = 1;
    }, 200);
  }
  onUpdateClickOutside(inputUpdate, id, i) {
    if (this.isUpdate === 1 && this.docSelectedIndex === i) {
      this.assDocToPrjt = true;
      let value = inputUpdate.value.trim();
      if (value !== "") {
        let int = this.documents.find(l => l.id === id).intitule;
        if (int !== value) this.documentService.OnUpdateDocument(value, id);
      }
      this.isUpdate = -1;
      this.docSelectedIndex = -1;
      inputUpdate.disabled = true;
    }
  }
  onAssoDocumentWithProjet(id) {
    this.docToAssId = id;
    if (this.assDocToPrjt)
      this.store.dispatch(
        new fromFicheAction.ShowFicheAlert({
          type: "document",
          showAlert: true,
          msg: "Vous voulais vraiment dessasosier ce document du projet?"
        })
      );
  }
  onDelete(id) {
    this.documentToDeleteId = id;
    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        type: "document",
        showAlert: true,
        msg: "Vous etes sure de vouloire supprimer ce document?"
      })
    );
  }
  onContinue() {
    if (this.documentToDeleteId !== -1) {
      this.documentService.OnDeleteDocument(this.documentToDeleteId);
      this.documentToDeleteId = -1;
    } else if (this.docToAssId !== -1) {
      this.documentService.OnAssoDocumentToProjet(this.docToAssId);
      this.docToAssId = -1;
    }

    this.onHideAlert();
  }
  onHideAlert() {
    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        type: "document",
        showAlert: false,
        msg: ""
      })
    );
  }
  onPrevious() {
    if (this.position - 1 > 0) {
      this.position = this.position - 1;
      let a = this.navPas * this.position;
      let b = a - this.navPas;
      this.documents = this.documents$.slice(b, a);
    }
  }
  onNext() {
    if (this.position + 1 <= this.size) {
      let b = this.navPas * this.position;
      this.position = this.position + 1;
      let a = b + this.navPas;
      this.documents = this.documents$.slice(b, a);
    }
  }

  onFilterFocus(input) {
    input.disabled = false;
    if (input.value === "INTITULE") input.value = "";
  }
  onFilterBur(input) {
    if (input.value.trim() === "") {
      input.value = "INTITULE";
      this.documents = this.documents$;
      this.documents = this.documents$.slice(0, this.navPas);
      this.size = Math.trunc(this.documents$.length / this.navPas);
      if (this.size < this.documents$.length / this.navPas)
        this.size = this.size + 1;
    }
  }

  onFilter(value, type) {
    if (value.trim() == "") {
      this.documents$ = this.documents$$;
    } else {
      this.documents$ = this.documents$$.filter(d => {
        return d[type].includes(value.toUpperCase());
      });
    }
    this.position = 1;
    this.documents = this.documents$.slice(0, this.navPas);
    this.size = Math.trunc(this.documents$.length / this.navPas);
    if (this.size < this.documents$.length / this.navPas)
      this.size = this.size + 1;
  }
  getFile(event) {
    this.documentService.onImportExcelFileDocument(event.target.files[0]);
  }
}
