document.addEventListener("DOMContentLoaded", function () {
  var calendarEl = document.getElementById("calendar");
  window.calendar = new FullCalendar.Calendar(calendarEl, {
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay"
    },
    navLinks: true, // can click day/week names to navigate views
    selectable: true,
    selectMirror: true,
    select: function (arg) {
      var title = prompt("Event Title:");
      if (title) {
        calendar.addEvent({
          title: title,
          start: arg.start,
          end: arg.end,
          allDay: arg.allDay
        });
      }
      calendar.unselect();
    },
    eventClick: function (arg) {
      var appointment = arg.event.extendedProps.appointment;
      var testString = "";
      for (var i = 0; i < appointment.treatment.treatmentItems.length; i++) {
        var name = appointment.treatment.treatmentItems[i].name;
        var description = appointment.treatment.treatmentItems[i].description;
        testString += `<div class="appointments-month-calendar-tab-text-plain">
              ${name.charAt(0).toUpperCase() + name.slice(1)} (${
          description.charAt(0).toUpperCase() + description.slice(1)
        })</div>`;
      }
      var html = `<div class="appointments-month-calendar-tab-3">
             <div class="appointments-month-calendar-tab-3-label-div">
               <div class="appointments-month-calendar-tab-label">${formatAMPM(
                 new Date(appointment.startTime)
               )} - ${formatAMPM(new Date(appointment.endTime))}</div>
             </div>
             <div class="appointments-month-calendar-tab-3-mid-elements">
               <div class="div-block-115">
                 <div class="appointments-month-calendar-tab-text-medium">${
                   appointment.patientName
                 }</div>
                 ${testString}
               </div>
               <div class="appointments-month-calendar-tab-text-plain-coloured">${
                 appointment.kindOfHealthcareProvider
               }</div>
             </div>
             <div class="div-block-116">
               <div class="div-block-66"></div>
             </div>
             <div class="appointments-month-calendar-tab-3-footer-elements">
               <div class="appointments-month-calendar-tab-label-colour-green">$${appointment.treatment.subTotal.toFixed(
                 2
               )}</div>
               <div class="appointments-month-calendar-tab-label-colour">${
                 appointment.treatment.paymentProvider
               }</div>
             </div>
           </div>`;
      $(".div-block-109").html(html);
    },
    editable: true,
    dayMaxEvents: true, // allow "more" link when too many events
    events: []
  });
  calendar.render();
});
