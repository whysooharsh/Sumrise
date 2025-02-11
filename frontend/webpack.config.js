    module.exports = {
    // ...existing code...
    devServer: {
        // ...existing code...
        setupMiddlewares: (middlewares, devServer) => {
        // Replace onBeforeSetupMiddleware
        // devServer.app.use((req, res, next) => {
        //   // custom middleware logic
        //   next();
        // });

        // Replace onAfterSetupMiddleware
        // devServer.app.use((req, res, next) => {
        //   // custom middleware logic
        //   next();
        // });

        return middlewares;
        },
        // ...existing code...
    },
    // ...existing code...
    };
