$(document).ready(function() {
	$('.sign-out').click(function() {
		localStorage.clear();
		var loc = `${$(location).attr('origin')}/care-giver/login`;
		$(location).attr('href', loc);
	});
	var errorMessage = $('.error-message');
	const token = localStorage.getItem('token');
	const userData = JSON.parse(localStorage.getItem('data'));
	if (!userData) {
		var loc = `${$(location).attr('origin')}/care-giver/login.html`;
		$(location).attr('href', loc);
	}

	$(".treatment-payment-3-payment-method").css({ overflow: "scroll"})

	$(".paypal-block").replaceWith(`<div id="paypal-button-container"></div>`)

	var PAYPAL_REFERENCE_ID
	var PAYPAL_AMOUNT

	paypal.Buttons({
		createOrder: function(data, actions) {
		  // This function sets up the details of the transaction, including the amount and line item details.
		  return actions.order.create({
			purchase_units: [{
				reference_id: PAYPAL_REFERENCE_ID,
                description: "Aluuka Treatment Payment",
			  amount: {
				value: `${PAYPAL_AMOUNT}`
			  }
			}]
		  });
		},
		onApprove: function(data, actions) {
			return actions.order.capture().then(function(details) {
				showSuccessMessageOnScreen(
					$('.error-message'),
					'Finalizing your payment, hang on ... ',
					false
				);

				console.log(details)
				let paypalOrderId = details.id
				let paypalReferenceId = details.purchase_units[0].reference_id

			  	confirmPayPalPaymentFromCheckout(paypalOrderId, paypalReferenceId)
			});
		  }
	  }).render('#paypal-button-container');

	const userfullname = userData.fullName;
	$('.userfullname').html(`${userfullname}`);
	var paypalType = false;
	var stripeType = false;
	var paymentType = '';
	$('.visacard-block').click(function(event) {
		if (!stripeType) {
			$('.paypal-block').removeClass('pay-select');
			$('.visacard-block').addClass('pay-select');
			stripeType = true;
			paypalType = false;
			paymentType = 'Stripe';
		} else {
			//alert("ooo no")
			$('.paypal-block').removeClass('pay-select');
			stripeType = false;
			paymentType = '';
		}
	});
	$('.paypal-block').click(function(event) {
		if (!paypalType) {
			alert(paymentType);
			$('.paypal-block').addClass('pay-select');
			$('.visacard-block').removeClass('pay-select');
			stripeType = false;
			paypalType = true;
			paymentType = 'Paypal';
		} else {
			//alert("ooo no")
			$('.paypal-block').removeClass('pay-select');
			paypalType = false;
			paymentType = '';
		}
	});

	function getUrlVars() {
		var vars = [],
			hash;
		var hashes = window.location.href
			.slice(window.location.href.indexOf('?') + 1)
			.split('&');
		for (var i = 0; i < hashes.length; i++) {
			hash = hashes[i].split('=');
			vars.push(hash[0]);
			vars[hash[0]] = hash[1];
		}
		return vars;
	}

	var treatment_id = getUrlVars()['treatment_id'];
	var hcp_id = getUrlVars()['hcp_id'];

	$.ajax({
		url: CONSTANTS.baseUrl,
		contentType: 'application/json',
		type: 'POST',
		headers: {
			authorization: `Bearer ${JSON.parse(token)}`
		},
		data: JSON.stringify({
			query: `query {
                      getTreatmentById(
                          id: "${treatment_id}"
                      ) {
                            id
                            patientId
                            subTotal
                            grandTotal
                          }
                  }`
		}),
		success: function(result) {
			var treatment_data = result.data.getTreatmentById;
			var feenum = treatment_data.grandTotal - treatment_data.subTotal;
			var aluuka_fee = feenum.toFixed(2);
			$('.total_payment').html(
				`$${treatment_data.grandTotal.toFixed(2)}`
			);
			$('.treat_payment').html(`$${treatment_data.subTotal.toFixed(2)}`);
			$('.aluuka_payment').html(`$${aluuka_fee}`);
			PAYPAL_AMOUNT = treatment_data.grandTotal
			PAYPAL_REFERENCE_ID = treatment_data.id
		},
		error: function(err) {
			console.error(err);
		}
	});
	// Treatment List
	$.ajax({
		url: CONSTANTS.baseUrl,
		contentType: 'application/json',
		type: 'POST',
		headers: {
			authorization: `Bearer ${JSON.parse(token)}`
		},
		data: JSON.stringify({
			query: `query {
                                            getHealthcareProviderById(
                                                id: "${hcp_id}"
                                            ) {
																									id
                                                  fullName
                                                  phone
                                                  email
                                               }
                                        }
                                    `
		}),
		success: function(result) {
			const hcp_data = result.data.getHealthcareProviderById;
			$('.hcp_name').html(hcp_data.fullName);
			$('.hcp_phone').html(hcp_data.phone);
			$('.hcp_email').html(hcp_data.email);
		},
		error: function(err) {
			console.error(err);
		}
	});
	//$(".notification-popup-model-block")
	$('.payment-method-pay-button').click(function(event) {
		if (paymentType === '') {
			return showErrorMessageOnScreen(
				errorMessage,
				'Please select payment method...'
			);
		}

		$('.notification-popup-model-block').show();
		if (paymentType === 'Stripe') {
			var treatment_id = getUrlVars()['treatment_id'];
			var hcp_id = getUrlVars()['hcp_id'];
			$.ajax({
				url: CONSTANTS.baseUrl,
				contentType: 'application/json',
				type: 'POST',
				headers: {
					authorization: `Bearer ${JSON.parse(token)}`
				},
				data: JSON.stringify({
					query: `mutation {
							createStripePaymentSession(
							treatmentId: "${treatment_id}",
							healthcareProviderId: "${hcp_id}"
							) {
							sessionId
							}
							}
`
				}),
				success: function(result) {
					window.stripe = Stripe(CONSTANTS.stripePublicKey);
					if (result.data.createStripePaymentSession.sessionId) {
						stripe
							.redirectToCheckout({
								sessionId:
									result.data.createStripePaymentSession
										.sessionId
							})
							.then(function(result) {
								// If redirection fails, display an error to the customer.
								if (result.error) {
									showErrorMessageOnScreen(
										$('.error-message'),
										result.error.message
									);
								}
							});
					}
				},
				error: function(err) {
					console.error(err);
				}
			});
		}

		//alert(`Yeah, man ${paymentType}`);
	});

	function confirmPaymentFromCheckout(sessionId) {
		$.ajax({
			url: CONSTANTS.baseUrl,
			contentType: 'application/json',
			type: 'POST',
			headers: {
				authorization: `Bearer ${JSON.parse(token)}`
			},
			data: JSON.stringify({
				query: `mutation {
      confirmStripeCheckoutSession(
      sessionId: "${sessionId}"
      ) {
      paymentStatus
      }
      }
      `
			}),
			success: function(result) {
				var paymentStatus =
					result.data.confirmStripeCheckoutSession.paymentStatus;
				if (paymentStatus === 'paid') {
					showSuccessMessageOnScreen(
						$('.error-message'),
						"Your payment was successful.. you're being redirected",
						false
					);
					return setTimeout(function() {
						window.location.href =
							'/care-giver/treatments-main-dashboard.html';
					}, 2000);
				}

				showErrorMessageOnScreen(
					$('.error-message'),
					'Your payment was not successful'
				);
			},
			error: function(err) {
				console.error(err);
			}
		});
	}

	function confirmPayPalPaymentFromCheckout(paypalOrderId, paypalReferenceId) {
		$.ajax({
			url: CONSTANTS.baseUrl,
			contentType: 'application/json',
			type: 'POST',
			headers: {
				authorization: `Bearer ${JSON.parse(token)}`
			},
			data: JSON.stringify({
				query: `mutation {
					confirmPayPalCheckoutSession(
						orderID: "${paypalOrderId}",
						referenceId: "${paypalReferenceId}"
					) {
					status
					message
					}
					}
      				`
			}),
			success: function(result) {
				console.log(result)
				var paymentStatus =
					result.data.confirmPayPalCheckoutSession.status;
				if (paymentStatus) {
					showSuccessMessageOnScreen(
						$('.error-message'),
						"Your payment was successful.. you're being redirected",
						false
					);
					return setTimeout(function() {
						window.location.href =
							'/care-giver/treatments-main-dashboard.html';
					}, 2000);
				}

				showErrorMessageOnScreen(
					$('.error-message'),
					'Your payment was not successful'
				);
			},
			error: function(err) {
				console.error(err);
			}
		});
	}

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
	(function() {
		var paymentStatus =
			typeof getUrlVars()['payment_status'] !== 'undefined'
				? getUrlVars()['payment_status']
				: null;
		var sessionId =
			typeof getUrlVars()['session_id'] !== 'undefined'
				? getUrlVars()['session_id']
				: null;
		if (paymentStatus) {
			switch (paymentStatus) {
				case 'completed':
					showSuccessMessageOnScreen(
						$('.error-message'),
						'Finalizing your payment, hang on ... ',
						false
					);
					if (sessionId) confirmPaymentFromCheckout(sessionId);
					break;
				default:
					showErrorMessageOnScreen(
						$('.error-message'),
						'Your payment was not successful'
					);
			}
		}
	})();
});
