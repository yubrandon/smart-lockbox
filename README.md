# CMPE 195 Lockbox Project


## Testing
### Web
```
npm start
```
Run chrome using the following line and open localhost in its window:
```
google-chrome --disable-web-security --user-data-dir="/tmp/chrome_dev"
```
### Electron
```
npm install
npm run start
```

### Canvas Setup
Set up Canvas and obtain your own API key and URL for testing
```
https://github.com/instructure/canvas-lms/wiki/Quick-Start
```

## Serial Connection
Detect serial connections using the following command:
```
sudo dmesg | grep tty
```
### Documentation
```
https://developer.chrome.com/docs/capabilities/serial
```