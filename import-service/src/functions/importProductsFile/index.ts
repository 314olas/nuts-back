import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      httpApi: {
        method: 'get',
        path: '/import',
        request: {
          parameters: {
            querystrings: {
              name: true
            }
          }
        },
      },
    },
  ],
};
