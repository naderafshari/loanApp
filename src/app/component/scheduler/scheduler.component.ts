import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { jqxSchedulerComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxscheduler';
import { jqxButtonComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxbuttons';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AuthService } from '../../provider/auth.service';
import { UserInfo } from '../../model/user-info';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Calendar, DataClass } from '../../model/calendar';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.css']
})
export class SchedulerComponent implements OnInit, AfterViewInit {
  uid: string;
  cal:  Observable<any>;
  dataAdapter: any;
  schedulerSettings: any;
  dataFieldsClass = new DataClass;
  source :any;
  sub: any;
  printButton: any = null;

  @ViewChild("schedulerReference") scheduler: jqxSchedulerComponent;

  constructor(private afs: AngularFirestore, public authService: AuthService,
    private router: Router, private route: ActivatedRoute) {
    }

  ngAfterViewInit(): void 
  {
    this.uid = this.authService.currentUserId;
    if (this.uid) {
        this.cal = this.afs.doc(`calendar/${this.uid}`).valueChanges();
        this.sub = this.cal.subscribe( (cal) => {
            this.dataFieldsClass = new DataClass;
            this.source =
            {
                dataType: this.dataFieldsClass.dataType,
                dataFields: this.dataFieldsClass.dataFields,
                id: this.dataFieldsClass.id,
                localData: cal.slots//this.generateCannedSlots()
            }
            this.dataAdapter = new jqx.dataAdapter(this.source);
            
            this.schedulerSettings =
            {
                date: new jqx.date(2016, 11, 23),
                width: 800,
                height: 600,
                source: this.dataAdapter,
                view: "weekView",
                showLegend: true,
                appointmentDataFields: this.appointmentDataFields,
                editDialogCreate: this.editDialogCreate,
                editDialogOpen: this.editDialogOpen,
                editDialogClose: this.editDialogClose,
                resources:
                {
                    colorScheme: "scheme05",
                    dataField: "calendar",
                    source: new jqx.dataAdapter(this.source)
                },
                views:
                [
                    "dayView",
                    "weekView",
                    "monthView"
                ]
            };
            this.scheduler.createComponent(this.schedulerSettings);
            this.scheduler.ensureAppointmentVisible("id1");                
       });
    }
  }
  
  generateCannedSlots(): any
  {
      let slot1 = {
          id: "id1", description: "George brings projector for presentations.", location: "TBD", subject: "Quarterly Project Review Meeting", calendar: "Therapist 1",
          start: new Date(2016, 10, 23, 9, 0, 0), end: new Date(2016, 10, 23, 16, 0, 0)
      };
      let slot2 = {
          id: "id2", description: "", location: "SP Room1", subject: "IT Group Mtg.", calendar: "Therapist 2",
          start: new Date(2016, 10, 24, 10, 0, 0), end: new Date(2016, 10, 24, 15, 0, 0)
      };
      let slot3 = {
          id: "id3", description: "", location: "OR Room2", subject: "Course Social Media", calendar: "Therapist 3",
          start: new Date(2016, 10, 27, 11, 0, 0), end: new Date(2016, 10, 27, 13, 0, 0)
      };
      let slot4 = {
          id: "id4", description: "", location: "SP Room3", subject: "New Projects Planning", calendar: "Therapist 2",
          start: new Date(2016, 10, 23, 16, 0, 0), end: new Date(2016, 10, 23, 18, 0, 0)
      };
      let slot5 = {
          id: "id5", description: "", location: "SP Room2", subject: "Interview with James", calendar: "Therapist 1",
          start: new Date(2016, 10, 25, 15, 0, 0), end: new Date(2016, 10, 25, 17, 0, 0)
      };
      let slot6 = {
          id: "id6", description: "", location: "OR Room1", subject: "Interview with Nancy", calendar: "Therapist 4",
          start: new Date(2016, 10, 26, 14, 0, 0), end: new Date(2016, 10, 26, 16, 0, 0)
      };

      const slots = {
          slot1: slot1,
          slot2: slot2,
          slot3: slot3,
          slot4: slot4,
          slot5: slot5,
          slot6: slot6
        }
      const calRef: AngularFirestoreDocument<any> = this.afs.doc(`calendar/${this.uid}`);
      calRef.set({
          calId: `${this.uid}`,
          slots: slots
        });
  
      return slots;
  }

  // called when the dialog is craeted.
  editDialogCreate = (dialog, fields, editAppointment) => {
    // hide repeat option
    fields.repeatContainer.hide();
    // hide status option
    fields.statusContainer.hide();
    // hide timeZone option
    fields.timeZoneContainer.hide();
    // hide color option
    fields.colorContainer.hide();
    fields.subjectLabel.html("Title");
    fields.locationLabel.html("Where");
    fields.fromLabel.html("Start");
    fields.toLabel.html("End");
    fields.resourceLabel.html("Therapist");

    let buttonElement = document.createElement("BUTTON");
    buttonElement.innerText = 'Print';
    buttonElement.style.cssFloat = 'right';
    buttonElement.style.marginLeft = '5px';
    buttonElement.id = 'PrintButton';

    fields.buttons[0].appendChild(buttonElement);

    let printButton: jqwidgets.jqxButton = jqwidgets.createInstance('#PrintButton', 'jqxButton', {
        width: 50,
        height: 25
    });

    this.printButton = printButton;

    printButton.addEventHandler('click', function () {
        let appointment = editAppointment;
        if (!appointment && printButton.disabled) {
            return;
        }

        let appointmentContent =
            "<table class='printTable'>" +
            "<tr>" +
            "<td class='label'>Title</td>" +
            "<td>" + fields.subject.val() + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td class='label'>Start</td>" +
            "<td>" + fields.from.val() + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td class='label'>End</td>" +
            "<td>" + fields.to.val() + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td class='label'>Where</td>" +
            "<td>" + fields.location.val() + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td class='label'>Calendar</td>" +
            "<td>" + fields.resource.val() + "</td>" +
            "</tr>"
            + "</table>";
        let newWindow = window.open('', '', 'width=800, height=500'),
            document = newWindow.document.open(),
            pageContent =
                '<!DOCTYPE html>\n' +
                '<html>\n' +
                '<head>\n' +
                '<meta charset="utf-8" />\n' +
                '<title>jQWidgets Scheduler</title>\n' +
                '<style>\n' +
                '.printTable {\n' +
                'border-color: #aaa;\n' +
                '}\n' +
                '.printTable .label {\n' +
                'font-weight: bold;\n' +
                '}\n' +
                '.printTable td{\n' +
                'padding: 4px 3px;\n' +
                'border: 1px solid #DDD;\n' +
                'vertical-align: top;\n' +
                '}\n' +
                '</style>' +
                '</head>\n' +
                '<body>\n' + appointmentContent + '\n</body>\n</html>';
        try {
            document.write(pageContent);
            document.close();
        }
        catch (error) {
        }
        newWindow.print();
    });
    
  };

  /**
  * called when the dialog is opened. Returning true as a result disables the built-in handler.
  * @param {Object} dialog - jqxWindow's jQuery object.
  * @param {Object} fields - Object with all widgets inside the dialog.
  * @param {Object} the selected appointment instance or NULL when the dialog is opened from cells selection.
  */
  editDialogOpen = (dialog, fields, editAppointment) => {
    if (!editAppointment && this.printButton) {
        this.printButton.setOptions({ disabled: true });
    }
    else if (editAppointment && this.printButton) {
        this.printButton.setOptions({ disabled: false });
    }
  };

  /**
  * called when the dialog is closed.
  * @param {Object} dialog - jqxWindow's jQuery object.
  * @param {Object} fields - Object with all widgets inside the dialog.
  * @param {Object} the selected appointment instance or NULL when the dialog is opened from cells selection.
  */
  editDialogClose = (dialog, fields, editAppointment) => {
  };

  /**
  * called when a key is pressed while the dialog is on focus. Returning true or false as a result disables the built-in keyDown handler.
  * @param {Object} dialog - jqxWindow's jQuery object.
  * @param {Object} fields - Object with all widgets inside the dialog.
  * @param {Object} the selected appointment instance or NULL when the dialog is opened from cells selection.
  * @param {jQuery.Event Object} the keyDown event.
  */
  editDialogKeyDown = (dialog, fields, editAppointment, event) => {
  };

  appointmentDataFields: any =
  {
    from: "start",
      to: "end",
      id: "id",
      description: "description",
      location: "location",
      subject: "subject",
      resourceId: "calendar",
      style: 'style',
      status: 'status'
    };


   onAppointmentDelete(event: any): void {
      let appointment = event.args.appointment;
      console.log('appointmentDelete is raised');
      console.log(appointment.originalData);
  };

  onAppointmentAdd(event: any): void {
      let appointment = event.args.appointment;
      console.log('appointmentAdd is raised');
      console.log(appointment.originalData);
  };

  onAppointmentDoubleClick(event: any): void {
      let appointment = event.args.appointment;
      console.log('appointmentDoubleClick is raised');
      console.log(appointment.originalData);
  };

  onAppointmentChange(event: any): void {
      let appointment = event.args.appointment;
      console.log('appointmentChange is raised');
      console.log(appointment.originalData);
  };

  onCellClick(event: any): void {
      let cell = event.args.cell;
      console.log('cellClick is raised');
      console.log(cell);
  };

  ngOnInit() {
  }

}
