window.calenderEvents = [];
window.calenderEventsTreatmentIds = [];
window.appointmentFilter = undefined;
window.calendarDateSet = ['', ''];
window.filterAppointmentBy = function(event) {
	window.appointmentFilter = event.target.getAttribute('data-patient-id');
	window.calenderEvents = [];
	window.calenderEventsTreatmentIds = [];
	loadAppointment(
		window.calendarDateSet[0],
		window.calendarDateSet[1],
		window.appointmentFilter
	);
};

window.formatAMPM = function(date) {
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var ampm = hours >= 12 ? 'PM' : 'AM';
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	minutes = minutes < 10 ? '0' + minutes : minutes;
	var strTime = hours + ':' + minutes + ' ' + ampm;
	return strTime;
};

$(document).ready(function () {
    // ID of the clear filter is to be passed
	$('[data-w-id="b7e2df3c-c9b3-0ea4-c348-cfc1ce227bf0"]').click(function() {
		window.appointmentFilter = '';
		window.calenderEvents = [];
		window.calenderEventsTreatmentIds = [];
		loadAppointment(
			window.calendarDateSet[0],
			window.calendarDateSet[1],
			window.appointmentFilter
		);
	});

	$('body').prepend('<div class="error-message"></div>');
	const token = localStorage.getItem('token');
	const userData = JSON.parse(localStorage.getItem('data'));
	if (!userData) {
		var loc = `${$(location).attr('origin')}/care-giver/login.html`;
		$(location).attr('href', loc);
	}
	const userfullname = userData.fullName;
	$('.userfullname').html(`${userfullname}`);

	function showErrorMessageOnScreen(errorMessage, message, clear = true) {
		errorMessage.css('display', 'block');
		errorMessage.css('background', '#c62828');
		errorMessage.html(message);
		errorMessage.animate(
			{
				top: '30px'
			},
			900,
			'linear'
		);
		errorMessage.animate(
			{
				top: '50px'
			},
			900,
			'linear'
		);
		setTimeout(function() {
			if (clear) {
				errorMessage.css('display', 'none');
			}
		}, 2000);
		return false;
	}

	function showSuccessMessageOnScreen(errorMessage, message, clear = true) {
		errorMessage.css('display', 'block');
		errorMessage.css('background', 'mediumseagreen');
		errorMessage.html(message);
		errorMessage.animate(
			{
				top: '30px'
			},
			900,
			'linear'
		);
		errorMessage.animate(
			{
				top: '50px'
			},
			900,
			'linear'
		);
		setTimeout(function() {
			if (clear) {
				errorMessage.css('display', 'none');
			}
		}, 2000);
		return false;
	}

	function fetchAppointments(startDate, endDate, patientId) {
		return $.ajax({
			url: CONSTANTS.baseUrl,
			contentType: 'application/json',
			type: 'POST',
			headers: {
				authorization: `Bearer ${JSON.parse(token)}`
			},
			data: JSON.stringify({
				query: `query{
            listAppointments(lastId: "", limit:0, startDate: "${startDate}", endDate: "${endDate}", patientId: "${patientId}"){
                data {
                  status
                  patientName
                  healthcareProviderId
                  healthcareProvider
                  kindOfHealthcareProvider
                  startTime
                  endTime
                  createdAt,
                  treatmentId
                  treatment
                }
              }
            }
        `
			}),
			success: function(result) {
				return Promise.resolve(result);
			},
			error: function(err) {
				return Promise.reject(err);
			}
		});
	}

	function hideAllScreenMessage() {
		$('.error-message').css('display', 'none');
		$('.error-message').html('');
	}

	function updateCalenderEvent() {
		window.calendar.batchRendering(function() {
			window.calendar.removeAllEvents();
			window.calendar.addEventSource(window.calenderEvents);
		});
	}

	function getFormattedDate(date) {
		var year = date.getFullYear();
		var month = (1 + date.getMonth()).toString();
		month = month.length > 1 ? month : '0' + month;
		var day = date.getDate().toString();
		day = day.length > 1 ? day : '0' + day;
		return month + '-' + day + '-' + year;
	}

	function loadAppointment(startDate, endDate, patientId = '') {
		showSuccessMessageOnScreen(
			$('.error-message'),
			'Retrieving appointments, please wait..',
			false
		);
		fetchAppointments(startDate, endDate, patientId)
			.then(function(response) {
				hideAllScreenMessage();
				var appointments = response.data.listAppointments.data;
				if (appointments[0] === null || appointments.length < 1) return;
				for (var i = 0; i < appointments.length; i++) {
					var appointment = appointments[i];
					var start = appointment.startTime;
					var end = appointment.endTime;
					var patientName = appointment.patientName;
					var treatmentId = appointment.treatmentId;
					console.log(
						window.calenderEventsTreatmentIds,
						window.calenderEventsTreatmentIds.indexOf(treatmentId)
					);
					if (
						window.calenderEventsTreatmentIds.indexOf(treatmentId) <
						0
					) {
						window.calenderEventsTreatmentIds.push(treatmentId);
						console.log('In');
						var event = {
							title: patientName + appointment.healthcareProvider,
							start,
							end,
							appointment
						};
						window.calenderEvents.push(event);
					}
				}
				console.log({
					appointments
				});
				updateCalenderEvent();
			})
			.catch(function(error) {
				showErrorMessageOnScreen(
					$('.error-message'),
					'Unable to fetch appointments'
				);
				console.error(error);
			});
	}

	function loadPatients() {
		$.ajax({
			url: CONSTANTS.baseUrl,
			contentType: 'application/json',
			type: 'POST',
			headers: { authorization: `Bearer ${JSON.parse(token)}` },
			data: JSON.stringify({
				query: `query {
                        listPatients(
                          lastId: ""
                          limit: 100
                        ) {
                          data {
                            id
                            fullName
                          }
                        }
                    }
`
			}),
			success: function(result) {
				let patientLists = result.data.listPatients.data;
				$('.dropdown-list-2.w-dropdown-list').html('');
				$.map(patientLists, function(patient) {
					$('.dropdown-list-2.w-dropdown-list').append(
						`<a data-patient-id="${patient.id}" class="dropdown-link-3 w-dropdown-link" onClick="filterAppointmentBy(event)">${patient.fullName}</a>`
					);
				});
			},
			error: function(err) {
				showErrorMessageOnScreen(
					$('.error-message'),
					'Unable to fetch patient lists'
				);
				return console.error(err);
			}
		});
	}

	(async function() {
		$('.div-block-109').html(' Please select an appointment');
		window.calendar.on('datesSet', function(dateChanged) {
			var start = getFormattedDate(dateChanged.start);
			var end = getFormattedDate(dateChanged.end);
			window.calendarDateSet = [start, end];
			loadAppointment(start, end);
		});
		var date = new Date();
		var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
		var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
		window.calendarDateSet = [
			getFormattedDate(firstDay),
			getFormattedDate(lastDay)
		];
		await Promise.allSettled([
			loadPatients(),
			loadAppointment(
				getFormattedDate(firstDay),
				getFormattedDate(lastDay)
			)
		]);
	})();
});
