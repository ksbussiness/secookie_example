
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
// import path from "path";
// import { fileURLToPath } from "url";


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
export default function setupSwagger(app) {
    const swaggerDefinition = {
        openapi: "3.0.0",
        info: {
            title: "SAMPLE API FOR USER",
            description:
                "API Documentation for User Authentication.",
            version: "1.0.0",
        },
        servers: [
            {
                url: "http://localhost:3077/",
                description: "Local Server",
            },
        ],
        tags: [
            {
                name: "FOR REGISTRATION/LOGIN/LOGOUT",
                description:
                    "Endpoints for the user/admin registration, login, logout, and forgot password",
            }
        ],

        // components: {
        //     securitySchemes: {
        //         // BearerAuth: {
        //         //     type: "apiKey",
        //         //     name: "Authorization",
        //         //     in: "header",
        //         //     description: 'Enter JWT token as "Bearer <token>"',
        //         // },

        //         // ddd jj
        //     },
        // },

        components: {
            securitySchemes: {
                cookieAuth: {
                    type: "apiKey",
                    in: "cookie",
                    //  name: "sachinSession", //
                    name: "sessionId", // This must match your actual cookie name
                },
            },
        },
        security: [
            {
                cookieAuth: [],
            },
        ]
    };

    const swaggerOptions = {
        swaggerDefinition,
        // apis: [
        //   path.resolve(__dirname, "../routes/v1/authroutes.js"),
        //   path.resolve(__dirname, "../routes/v1/eventroutes.js"),
        //   path.resolve(__dirname, "../routes/v1/BookingsRoutes.js"),
        //   path.resolve(__dirname, "../routes/v1/generalroutes.js"),
        // ],
        apis: ['./routes/**/*.js'],
        //apis:['../routes/v1/authroutes.js','../routes/v1/eventroutes.js','../routes/v1/BookingsRoutes.js','../routes/v1/generalroutes.js'],
    };
    console.log(swaggerOptions.apis);

    const swaggerDocs = swaggerJsdoc(swaggerOptions);
    //console.log(JSON.stringify(swaggerDocs, null, 2));
    app.use(
        "/docs",
        swaggerUi.serve,
        swaggerUi.setup(swaggerDocs, {
            explorer: true,
            swaggerOptions: {
                docExpansion: "list",
                deepLinking: true,
                displayRequestDuration: true,
                examples: true,
            },
        })
    );

    console.log("Swagger docs available at http://localhost:3077/docs");
}




/* 

Set-Cookie: sachinSession=s%3AcOECBuClGP0tbfwzPp1CHMvKf4c2OlYb.jWQc98%2FCcSbQOMrSB2ByCGCbttgmcQNrbt2910SMKgE; Path=/;
That means:

**Cookie Name**: sachinSession

**Cookie Value**: s%3AcOECBuClGP0tbfwzPp1CHMvKf4c2OlYb.jWQc98%2FCcSbQOMrSB2ByCGCbttgmcQNrbt2910SMKgE




*/