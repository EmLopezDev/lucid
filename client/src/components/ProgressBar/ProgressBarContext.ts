type Listener = () => void;

let listeners: Listener[] = [];

const notify = () => listeners.forEach((l) => l());

export const progressStore = {
    isRunning: false,

    start() {
        this.isRunning = true;
        notify();
    },

    complete() {
        this.isRunning = false;
        notify();
    },

    subscribe(listener: Listener) {
        listeners.push(listener);
        return () => {
            listeners = listeners.filter((l) => l !== listener);
        };
    },
};
