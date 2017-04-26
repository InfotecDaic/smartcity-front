import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterLink, Router} from '@angular/router';
import { Alert } from '../../../../../../core/models/alert';
import { NotificationType } from '../../../../../../core/models/notification-type';
import { AlertService } from '../../../../../../core/services/alert/alert.service';
import { LoginService } from '../../../../../../core/services/login/login.service';
import { Severity } from '../../../../../../core/models/severity';
import { EnumEx } from '../../../../../../core/models/EnumEx';
import { NotificationTypeService } from '../../../../../../core/services/notification-type/notification-type.service';


@Component({
  selector: 'user-vehicle-tray',
  templateUrl: './notification-tray.component.html',
  styleUrls: ['./notification-tray.component.sass'],

})
export class NotificationTrayComponent implements OnInit {

  //Variables utilizadas para mostrar la ventana modal, isConfirm=true (Muestra 2 botones Aceptar, Cancelar),
  //isConfirm=false (Muestra solo un botón Aceptar), messageModal (Mensaje que muestra la ventana Modal),
  //includeText (Se utiliza para mostrar un textArea o no)
  private showDialog: boolean;
  private isConfirm: boolean;
  private messageModal: string;
  private includeText: boolean;
  private alerts: Alert[] = [];
  private severities: any[] = [];
  private Objalert = new Alert();
  private notifications: NotificationType[] = [];
  
  private isUser: boolean = false;
  private page: string;
  private total: number;

  constructor(private _service: AlertService, private _loginService: LoginService, 
              private _router: Router, private _notificationService: NotificationTypeService) { 
  }

  ngOnInit() {  
    try
    { 
      this.total = 20;
      this.getNotification();
      this.bindTable('0', '10');
      this.isUser = this._loginService.isUser();
      this.isConfirm = true;
      this.messageModal = "";
      this.includeText = false;
    }
    catch(e)
    {
      this.setValuesModal(this.messageModal, true, false);
    }
  }
  
  //Metodo que se utiliza para el llenado de la tabla con los datos de las notificaciones
  //registradas.
  bindTable(page: string, size: string) { 
    try
    {
      this._service.getAllByPage(page, size).subscribe(
        (res) => { 
          this.alerts = res;
        },
        (error) => {
            this.messageModal = error;
        });
    }
    catch(e)
    {
      throw e;
    }
  }

  pageChanged(page: number)
  {
    let pagina: string;
    pagina = (page-1).toString();
    this.page = page.toString();
    console.log(this.page);
    console.log(pagina);
    console.log(page);
    this.bindTable(pagina, '10');
  }

  getSubTypeAlert() {
    try
    {
        
    }
    catch(e){throw e;}
}

  getNotification() {
     try
      {
        this._notificationService.getAll().subscribe(
        (res) => {
            this.notifications = res;
        },
        (error) => {
            this.messageModal = error;
        });
      }
      catch(e){ throw e;}
}

  //Metodo que se llama cuando se confirma la eliminación del registro
  confirmDelete() {
    try
    {
        if(this.isConfirm)
        {
        }
        else
          this.showDialog = false;
      }
      catch(e){ throw e;}
    }

    OnClear(){
      var selectNotification, selectSeverity, inputDate;
      try
      {
        selectNotification = document.getElementById("notificationType");
        selectSeverity = document.getElementById("severity");
        inputDate = document.getElementById("alertDate");

        if(selectNotification != null && selectSeverity != null && inputDate != null)
        {
          (<HTMLSelectElement>selectNotification).options.selectedIndex = 0;
          (<HTMLSelectElement>selectSeverity).options.selectedIndex = 0;
          (<HTMLInputElement>inputDate).value = "";
          (<HTMLInputElement>inputDate).placeholder = "yyyy-mm-dd";
        }
      }
      catch(e){
          this.setValuesModal("An error occurred while clearing the search controls", true, false);
      }
    }

    setValuesModal(message: string, show: boolean, confirm: boolean)
    {
      this.isConfirm = confirm;
      this.messageModal = message;
      this.showDialog = show;
    }

}
