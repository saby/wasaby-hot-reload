/**
 * Точка входа в процесс клиентского hot reload
 */

import Controller from './Controller';

// Run only in browser environment
if (typeof window !== 'undefined') {
    const controller = new Controller();
    // Turn off callign run() until  we get host and port from contents
    // controller.run();
}
