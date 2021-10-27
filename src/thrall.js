let statusstr
window.onload = (function () {
    statusstr = document.getElementById('statusstr');
})

let device;
async function connectOdin() {
    device = await navigator.usb.requestDevice({
        filters: [
            { vendorId: 0x04e8 },
        ],
    });
    console.log('dev', device);

    await device.open();
    await device.reset();
    await device.selectConfiguration(1);

    statusstr.innerHTML = "connected";
}

async function setupInterface() {
    await device.claimInterface(1);
    await device.selectAlternateInterface(1, 0);

    statusstr.innerHTML = "setup interface";
}

async function initalizeProtocol() {
    let probePacket = new TextEncoder('utf-8').encode("ODIN");
    await device.transferOut(2, probePacket);
    
    let returnStr = ''
    let response;
    let respPacket = await device.transferIn(1, 64);
    console.log('resppacket', respPacket)
    response = new TextDecoder().decode(respPacket.data);
    console.log('resppacket', respPacket, 'resp', response);
    
    if (response === "LOKE") {
        statusstr.innerHTML = "protocol initalized";
    }
}