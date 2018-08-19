# Athom-Homey-Pushsafer
![Pushsafer](https://www.pushsafer.com/de/assets/logos/logo.png)

# Pushsafer notifications for Athom Homey

This app lets you send [pushsafer.com](https://www.pushsafer.com/) notifications to use in flows on a Homey device (by Athom).

1. Go to [pushsafer.com](https://www.pushsafer.com/) and login
2. Grab your private key (send to all registered devices) or alias key (with predefined device, sound, icon & vibration) from the dashboard
3. Go to settings on your Homey, and under Pushsafer Notifications fill in your private or alias key and save.

### Flow cards
#### Pushsafer Notification
1. Message
2. Title
3. Device or Device Group ID
4. Icon ID (1-176)
5. Color
6. Sound ID (0-50)
7. Vibration (0-3)
8. URL
9. Title of URL
10. Time To Live (0-43200)
11. Priority (-2, -1, 0, 1, 2)
12. Retry (in Seconds (60-10800 in 60 steps)
13. Expire (in Seconds (60-10800 in 60 steps)
14. Answer (1 or leave blank)

#### Pushsafer Image
1. URL of Image
2. Message
3. Title
4. Device or Device Group ID
5. Icon ID (1-176)
6. Color
7. Sound ID (0-50)
8. Vibration (0-3)
9. URL
10. Title of URL
11. Time To Live (0-43200)
11. Priority (-2, -1, 0, 1, 2)
12. Retry (in Seconds (60-10800 in 60 steps)
13. Expire (in Seconds (60-10800 in 60 steps)
14. Answer (1 or leave blank)

### Open Homey iOS or Android APP out of Pushsafer.com Client APP
enter **athomhomey://** in **URL** and **Open Homey** in **URL Title**

### Changelog
0.0.6
- add new parameters (priority, retry, expire, answer)

0.0.5
- fix SVG icon

0.0.4
- Homey SDK v2 ready
- image support
- all Pushafer parameters available (icon, icon color, sound, vibration, url, url title, device, time2live)

0.0.3
- fixed some issues

0.0.2
- fixed some issues

0.0.1
- initial release
