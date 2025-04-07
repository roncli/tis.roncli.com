/**
 * @callback QueuedFunction
 * @returns {void | PromiseLike<void>}
 */

// MARK: class Queue
/**
 * A class that creates a queue of functions.
 */
class Queue {
    // MARK: constructor
    /**
     * Creates a new queue.
     */
    constructor() {
        this.promise = Promise.resolve();
    }

    // MARK: push
    /**
     * Adds a function to the queue.
     * @param {QueuedFunction} fx The function to add to the queue.
     * @returns {void}
     */
    push(fx) {
        this.promise = this.promise.then(() => {}).catch(() => {}).then(fx);
    }
}

module.exports = Queue;
