import 'isomorphic-fetch';
import '~/app/app';

if (process.env.NODE_ENV === 'production') {
  (async () => {
    await import('offline-plugin/runtime').then(({ default: plugin }) => {
      plugin.install();
    });
  })();
}
