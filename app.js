'use strict';

const Homey = require('homey');
const { showError, showSuccess } = require('./src/LEDRingAnimations');
let push = require('pushsafer-notifications');
let http = require('http.min');
let request = require('request').defaults({ "strictSSL": false, "encoding": null });
let account = [];
let validation;
let devices = null;
let pushsaferUser = null;
let ledringPreference = false;
let InsightLog = null;

class MyApp extends Homey.App {
	
	onInit() {

        // Start building Pushsafer accounts array
		buildPushsaferArray();

		createInsightlog();

		Homey.ManagerSettings.on('set', function (settingname) {

			if (settingname == 'pushsaferaccount') {
				console.log('Pushsafer - Account has been changed/updated...');
				buildPushsaferArray();
			}
		});

        let sendMessage = new Homey.FlowCardAction('pushsaferSend');
		sendMessage
		.register()
		.registerRunListener(( args, state ) => {
			if (typeof validation == 'undefined' || validation == '0') return new Error("Pushsafer private or alias key not configured or valid under settings!");
				let tempUser = pushsaferUser;
				let pMessage = args.message;
				let title = args.title;
				let device = args.device;
				let icon = args.icon;
				let iconcolor = args.iconcolor;
				let sound = args.sound;
				let vibration = args.vibration;
				let url = args.url;
				let urltitle = args.urltitle;
				let time2live = args.time2live;
				let priority = args.priority;
				let retry = args.retry;
				let expire = args.expire;
				let answer = args.answer;
				if (typeof pMessage == 'undefined' || pMessage == null || pMessage == '') return new Error("Message can not be empty");
				return pushsaferSend(tempUser, pMessage, title, device, icon, iconcolor, sound, vibration, url, urltitle, time2live, priority, retry, expire, answer, '');
		})

		let sendImage = new Homey.FlowCardAction('pushsaferSendImage');
		sendImage
		.register()
		.registerRunListener(( args, state) => {
			if (typeof validation == 'undefined' || validation == '0') return callback(new Error("Pushsafer private or alias key not configured or valid under settings!"));
				let tempUser = pushsaferUser;
				let pMessage = args.message;
				let title = args.title;
				let device = args.device;
				let icon = args.icon;
				let iconcolor = args.iconcolor;
				let sound = args.sound;
				let vibration = args.vibration;
				let url = args.url;
				let urltitle = args.urltitle;
				let time2live = args.time2live;
				let priority = args.priority;
				let retry = args.retry;
				let expire = args.expire;
				let answer = args.answer;
				if (typeof pMessage == 'undefined' || pMessage == null || pMessage == '') return new Error("Message can not be empty");
				
				let imageurl = args.imageurl;

				request.get(imageurl, function (error, response, body) {
					if (!error && response.statusCode == 200) {
						let base64ImageData = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64');
						console.log('ImageData:'+base64ImageData);
						return pushsaferSend(tempUser, pMessage, title, device, icon, iconcolor, sound, vibration, url, urltitle, time2live, priority, retry, expire, answer, base64ImageData);
					} else {
						console.log(error)
					}
				})
		})
	}
}

// Send notification with parameters
function pushsaferSend(pUser, pMessage, title, device, icon, iconcolor, sound, vibration, url, urltitle, time2live, priority, retry, expire, answer, image) {
	if (pUser != "") {

		let p = new push({
			k: pUser,
		});
		
		if (title == "") {
			title = "Homey";
		}

		let msg = {
			// These values correspond to the parameters detailed on https://www.pushsafer.com/en/pushapi
			// 'message' is required. All other values are optional.
			m: pMessage,   // required
			t: title,
			d: device,
			i: icon,
			c: iconcolor,
			s: sound,
			v: vibration,
			u: url,
			ut: urltitle,
			l: time2live,
			pr: priority,
			re: retry,
			ex: expire,
			a: answer,
			p: image
		};

		p.send(msg, function (err, result) {
			if (err) {
				if (ledringPreference == true) {
					LedAnimate("red", 3000);
				}
				throw err;
			} else {
				if (ledringPreference == true) {
					LedAnimate("green", 3000);
				}
			}
			console.log(result);
			//Add send notification to Insights
			InsightEntry(1, new Date());
		});
	} else {
		if (ledringPreference == true) {
			LedAnimate("red", 3000);
		}
	}
}

function InsightEntry(message, date)
{

	Homey.ManagerInsights.getLog('pushsafer_sendNotifications').then(logs => {
		logs.createEntry(message,date).catch( err => {
			console.error(err);
		});
	}).catch(err => {
	console.log("Cannot Make insight entry")
	});
}

// Create Insight log
function createInsightlog() {
	Homey.ManagerInsights.createLog('pushsafer_sendNotifications', {
		label: {
			en: 'Send Notifications'
		},
		type: 'number',
		units: {
			en: 'notifications'
		},
		decimals: 0
	}).then(function (err){
	console.log("Log Created")
	}).catch(function (err)
{
	console.log("Log Not created. " + err)
});
}

function buildPushsaferArray() {
	account = null;
	account = Homey.ManagerSettings.get('pushsaferaccount');

	if (account != null) {
		pushsaferUser = account['user'];
		ledringPreference = account['ledring'];
		validation = 1;
		console.log("Pushsafer - Account configured successful");
	} else {
		validation = 0;
		console.log("Pushsafer - No account configured yet");
	}
}

function logValidation() {
	let validatedSuccess = "Validation successful"
	let validatedFailed = "Validation failed, bad private or alias key!"
	if (validation == "1") {
		Homey.ManagerSettings.set('pushsafervalidation', validatedSuccess);
	} else if (validation == "0") {
		Homey.ManagerSettings.set('pushsafervalidation', validatedFailed);
	}
}

module.exports = MyApp;
