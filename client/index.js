import 'isomorphic-fetch';
import '_client/app';

if (process.env.NODE_ENV !== 'development') {
  (async () => {
    await import('offline-plugin/runtime').then(plugin =>
      plugin.install(),
    );
  })();
}
