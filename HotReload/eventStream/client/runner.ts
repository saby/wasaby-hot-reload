/**
 * Точка входа в процесс клиентского hot reload
 */

import Controller from './_Controller';

interface IWindowWithContents {
    contents?: {
        modules?: {
            HotReload?: {
                staticServer?: string;
            };
        };
    };
}

// Run only in browser environment
if (typeof window !== 'undefined') {
    // Turn off run the controller until we get module config from contents
    const config = (window as IWindowWithContents).contents?.modules?.HotReload;
    if (config) {
        const controller = new Controller({config});
        controller.run(true);
    }
}
