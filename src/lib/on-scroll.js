// Borrowed from and then modified: https://stackoverflow.com/a/74276652

export function onScroll(node, callback) {
    
    const observer = new IntersectionObserver(intersectionObserverCallback, {
        threshold: 1,
    });

    observer.observe(node);

    function intersectionObserverCallback(entries) {
        const entry = entries.find(entry => entry.isIntersecting);

        if (entry) {
            const id = entry.target.dataset.id;
            callback(id);
        }
    };

    return { destroy: () => observer.disconnect() };
}

