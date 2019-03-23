const customEvent = (element, eventName) => {
    const event = document.createEvent('Event');

    return event.initEvent(eventName, false, false);
};

export default customEvent;