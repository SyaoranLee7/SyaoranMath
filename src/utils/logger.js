const isDebuggingInChrome = /Chrome/g.test(window.navigator.userAgent);
const logEnable = process.env.NODE_ENV === "development";
const isDebuggingTest = process.env.PACK_ENV === "testing" && false;

const colors = {
    log: "inherit",
    info: "inherit",
    warn: "#f0ad4e",
    error: "#d9534f"
};
/*eslint no-console: 0*/
/*eslint no-useless-call: 0*/
export default {
    log: (message, ...args) => {
        if (isDebuggingTest) {
            console.log(message, args);
            return;
        }
        if (!logEnable || !message) return false;
        if (!isDebuggingInChrome) {
            console.log.apply(console, [message, ...args]);
            return;
        }
        if (args && args.length > 0) {
            console.groupCollapsed(`%c ${message}`, `font-weight: bold; color: ${colors.log}`);
            args.forEach((arg) => {
                console.log(arg);
            });
            console.groupEnd();
        } else {
            console.log(`%c ${message}`, `font-weight: bold; color: ${colors.log}`);
        }
    },

    info: (message, ...args) => {
        if (isDebuggingTest) {
            console.log(message, args);
            return;
        }
        if (!logEnable || !message) return false;
        if (!isDebuggingInChrome) {
            console.log.apply(console, [message, ...args]);
            return;
        }
        if (args && args.length > 0) {
            console.groupCollapsed(`%c ${message}`, `font-weight: bold; color: ${colors.info}`);
            args.forEach((arg) => {
                console.log(arg);
            });
            console.groupEnd();
        } else {
            console.log(`%c ${message}`, `font-weight: bold; color: ${colors.info}`);
        }
    },

    warn: (message, ...args) => {
        if (isDebuggingTest) {
            console.log(message, args);
            return;
        }
        if (!logEnable || !message) return false;
        if (!isDebuggingInChrome) {
            console.log.apply(console, [message, ...args]);
            return;
        }
        if (args && args.length > 0) {
            console.groupCollapsed(`%c ${message}`, `font-weight: bold; color: ${colors.warn}`);
            args.forEach((arg) => {
                console.warn(arg);
            });
            console.groupEnd();
        } else {
            console.log(`%c ${message}`, `font-weight: bold; color: ${colors.warn}`);
        }
    },

    error: (message, ...args) => {
        if (isDebuggingTest) {
            console.log(message, args);
            return;
        }
        if (!logEnable || !message) return false;
        if (!isDebuggingInChrome) {
            console.log.apply(console, [message, ...args]);
            return;
        }
        if (args && args.length > 0) {
            console.groupCollapsed(`%c ${message}`, `font-weight: bold; color: ${colors.error}`);
            args.forEach((arg) => {
                console.error(arg);
            });
            console.groupEnd();
            if (logEnable) {
                if (typeof message === "object") {
                    throw message;
                }
                args.forEach((arg) => {
                    if (typeof arg === "object") {
                        throw arg;
                    }
                });
            }
        } else {
            console.error(`%c ${message}`, `font-weight: bold; color: ${colors.error}`);
            if (logEnable) {
                if (typeof message === "object") {
                    throw message;
                }
            }
        }
    }
};
