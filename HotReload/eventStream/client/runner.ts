/**
 * Точка входа в процесс клиентского hot reload
 */

import Controller from './Controller';

// Run only in browser environment
if (typeof window !== 'undefined') {
    const controller = new Controller();
    controller.run();
}
