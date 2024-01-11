const API_PATH = process.env.REACT_APP_DWS_API_URL;

let sessionTimeout;
let expirationTimeout;
const sessionDuration = 25 * 60000; //25 * 1 min = 25 min
const expirationDuration = 30 * 60000; //30 * 1 min = 30 min

const renewSessionExpiration = async () => {
    let f = await fetch(`${API_PATH}/api/check_login`, {
        method: "POST",
        credentials: "include",
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (f.status == 200) {
        resetSessionTimeout();
    }
}

const resetSessionTimeout = () => {
    console.log("resetting SessionTimer...");
    clearTimeout(sessionTimeout);
    clearTimeout(expirationTimeout);
    sessionTimeout = setTimeout(() => {
        if (window.confirm("Your session will expire in 5 minutes. Do you want to renew your session?")) {
            renewSessionExpiration();
        }
    }, sessionDuration);
    
    expirationTimeout = setTimeout(() => {
        window.location.reload();
    }, expirationDuration);
}

const checkLogin = async (e) => {
    let f = await fetch(`${API_PATH}/api/check_login`, {
        method: "POST",
        credentials: "include",
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (f.status == 200) {
        resetSessionTimeout();
    } else {
        clearTimeout(sessionTimeout);
    }
}

const customFetch = async (url, options) => {
    const f = await fetch(url, options);
    checkLogin();
    return f;
}

module.exports = {renewSessionExpiration, resetSessionTimeout, customFetch, checkLogin};