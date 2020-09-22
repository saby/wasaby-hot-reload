/**
 * Точка входа в процесс клиентского hot reload
 */

import Controller from './Controller';

// Run only in browser environment
if (typeof window !== 'undefined') {
    // Turn off run the controller until we get host and port from contents
    const controller = new Controller();
    if (0) {
        controller.run();
    }
}
