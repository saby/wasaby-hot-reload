const SEPARATOR = '?';

/**
 * Добавляет уникальный параметр в URL, чтобы предотвратить кэширование
 */
export default function _getUniqueUrl(url: string): string {
    const [base, pathname]: string[] = String(url).split(SEPARATOR);
    const uniqPathname = (pathname || '') + '&hotReloadId=' + Date.now();

    return base + SEPARATOR + uniqPathname;
}
