"use strict";

var push = require('pushsafer-notifications');
var http = require('http.min');
var account = [];
var request = [];
var devices = null;
var pushsaferUser = null;
var ledringPreference = false;

// Get accounts from homey settings page.
function buildPushsaferArray() {
	account = null;
	account = Homey.manager('settings').get('pushsaferaccount');

	if (account != null) {
		pushsaferUser = account['user'];
		ledringPreference = account['ledring'];
		Homey.log("Pushsafer - Account configured successful");
	} else {
		Homey.log("Pushsafer - No account configured yet");
	}
}

Homey.manager('flow').on('action.pushsaferSend', function( callback, args ){
	  var tempUser = pushsaferUser;
		var pMessage = args.message;
		if( typeof pMessage == 'undefined' ||pMessage == null || pMessage == '') return callback( new Error("Message can not be empty") );
		pushsaferSend ( tempUser, pMessage);
    callback( null, true ); // we've fired successfully
});

Homey.manager('flow').on('action.pushsaferSend_device', function( callback, args ){
	  var tempUser = pushsaferUser;
		var pMessage = args.message;
		if( typeof pMessage == 'undefined' ||pMessage == null || pMessage == '') return callback( new Error("Message can not be empty") );
		var pDevice = args.device.name;
		if( pDevice == null || pDevice == '') return callback( new Error("No devices registered on this Pushsafer account!") );
		pushsaferSend_device ( tempUser, pMessage, pDevice);
    callback( null, true ); // we've fired successfully
});

Homey.manager('flow').on('action.pushsaferSend_device.device.autocomplete', function( callback, value ) {
	var deviceSearchString = value.query;
	var items = searchForDevicesByValue( deviceSearchString );
	callback( null, items );
});


// Send notification with parameters
function pushsaferSend ( pUser, pMessage) {
	if (pUser != ""){
	var p = new push( {
		k: pUser,
	});

	var msg = {
		// These values correspond to the parameters detailed on https://pushsafer.net/api
		// 'message' is required. All other values are optional.
		m: pMessage,   // required
		t: "Homey"
	};

	p.send( msg, function( err, result ) {
		if ( err ) {
			throw err;
		} else {
			if (ledringPreference == true){
				LedAnimate("green", 3000);
			}
		}
		Homey.log( result );
		//Add send notification to Insights
		Homey.manager('insights').createEntry( 'pushsafer_sendNotifications', 1, new Date(), function(err, success){
        if( err ) return Homey.error(err);
    });
	});
	} else {
		if (ledringPreference == true){
			LedAnimate("red", 3000);
		}
	}
}

// Send notification with parameters
function pushsaferSend_device ( pUser, pMessage, pDevice) {

	if (pUser != ""){
	var p = new push( {
		k: pUser
	});

	var msg = {
		// These values correspond to the parameters detailed on https://pushsafer.net/api
		// 'message' is required. All other values are optional.
		message: pMessage,   // required
		title: "Homey",
		device: pDevice
	};

	p.send( msg, function( err, result ) {
		if ( err ) {
			throw err;
		} else {
			if (ledringPreference == true){
				LedAnimate("green", 3000);
			}
		}
		Homey.log( result );
	});
	} else {
		if (ledringPreference == true){
			LedAnimate("red", 3000);
		}
	}
}

function searchForDevicesByValue ( value ) {
	var possibleDevices = devices;
	var tempItems = [];
	for (var i = 0; i < devices.length; i++) {
		var tempDevice = possibleDevices[i];
		if ( tempDevice.indexOf(value) >= 0 ) {
			tempItems.push({ icon: "", name: tempDevice });
		}
	}
	return tempItems;
}


function LedAnimate(colorInput, duration) {
Homey.manager('ledring').animate(
    // animation name (choose from loading, pulse, progress, solid)
    'pulse',

    // optional animation-specific options
    {

	   color: colorInput,
        rpm: 300 // change rotations per minute
    },

    // priority
    'INFORMATIVE',

    // duration
    duration,

    // callback
    function( err, success ) {
        if( err ) return Homey.error(err);

    }
);
}

// Create Insight log
function createInsightlog() {
	Homey.manager('insights').createLog( 'pushsafer_sendNotifications', {
    label: {
        en: 'Send Notifications'
    },
    type: 'number',
    units: {
        en: 'notifications'
    },
    decimals: 0
});
}

var self = module.exports = {
	init: function () {

		// Start building Pushsafer accounts array
		buildPushsaferArray();

		createInsightlog();

		Homey.manager('settings').on( 'set', function(settingname){

			if(settingname == 'pushsaferaccount') {
			Homey.log('Pushsafer - Account has been changed/updated...');
			buildPushsaferArray();
		}
		});

	}
}
