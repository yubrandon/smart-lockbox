//Prompt user to select a serial connection to pair with
async function connectSerial() {
    const port = await navigator.serial.requestPort();
    const ports = await navigator.serial.getPorts();
    console.log("Test");
    console.log(port);
    console.log(ports);
    if(port.readable || port.writable) {
        await port.close();
    }
    await port.open({baudRate: 115200});
    return port;
}

//Sends a value of 49 (ASCII '1') to paired serial connection
async function lockSerial(port) {
    const encoder = new TextEncoder();
    const writer = port.writable.getWriter();
    await writer.write(encoder.encode('1'));
    writer.releaseLock();
}

//Sends a value of 48 (ASCII '0')
async function unlockSerial(port) {
    const encoder = new TextEncoder();
    const writer = port.writable.getWriter();
    await writer.write(encoder.encode('0'));
    writer.releaseLock();
}

module.exports = { connectSerial, lockSerial, unlockSerial };