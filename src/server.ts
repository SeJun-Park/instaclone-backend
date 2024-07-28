import 'dotenv/config';
import express from 'express';
import logger from 'morgan';
import { ApolloServer } from '@apollo/server';
// import { startStandaloneServer } from '@apollo/server/standalone';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'; // HTTP 서버 종료를 관리하기 위한 Apollo Server 플러그인을 가져옵니다.
import http from 'http'; // 기본 HTTP 서버 모듈을 가져옵니다.
import cors from 'cors'; // CORS(Cross-Origin Resource Sharing) 미들웨어를 가져옵니다.
import { useServer } from 'graphql-ws/lib/use/ws'; // WebSocket 서버와 GraphQL을 연결하기 위한 유틸리티를 가져옵니다.
import { WebSocketServer } from 'ws'; // WebSocket 서버를 가져옵니다.
import schema from './schema.js';
import { getUser } from './users/users.utils.js';
import { expressMiddleware } from '@apollo/server/express4';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';
import client from './client';
import pubsub from './pubsub';

const PORT = process.env.PORT;

async function startServer() {

  // express
  const app = express();
  // HTTP 서버를 생성하여 Express 앱과 연결합니다. (부가)
  const httpServer = http.createServer(app); 

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  const serverCleanup = useServer(
    {
      schema,
      context: async (ctx, msg, args) => {
        const { connectionParams } = ctx;
        const token = connectionParams?.token as string || ""
        const loggedInUser = await getUser(token);
        return { loggedInUser, client, pubsub };
      },
      onConnect: async (ctx) => {
        const { connectionParams } = ctx;

        if(!connectionParams || !connectionParams.token) {
          throw new Error("you can't listen")
        }

        const token = connectionParams.token as string; 
        const loggedInUser = await getUser(token);

        if (!loggedInUser) {
          throw new Error("Invalid token");
        }

        // return { loggedInUser };
        // OnConnect 할 때만 context에 전달하므로, client, pubsub은 전달하지 않음. 사실 return도 안해도 될 듯?
      }
    },
    wsServer
  );

  // context를 두 번 설정하는 이유는 HTTP 요청과 WebSocket 요청에서 각각의 컨텍스트를 다르게 처리해야 하기 때문입니다. 
  // HTTP 요청은 일반적인 쿼리와 뮤테이션을 처리하고, WebSocket 요청은 구독(subscription)을 처리합니다. 
  // 각각의 요청 타입에 대해 별도의 컨텍스트를 설정하여 필요한 정보를 적절히 주입할 수 있습니다.

  // apollo-server
  const apollo = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }), 
      // HTTP 서버 종료를 관리하기 위한 플러그인을 추가합니다. (부가)
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
              // 서버가 종료될 때 WebSocket 서버도 정리합니다.
            },
          };
        },
      },
    ], 
  });


  await apollo.start();

  app.use(cors()); 
  // CORS 미들웨어를 추가하여 모든 출처에서의 요청을 허용합니다. (부가)

  // JSON 본문 파서 미들웨어 추가
  app.use(express.json());

  // 파일 업로드 미들웨어 추가
  // 이 또한 로컬에 저장하기 위함. 나중에는 필요 없음. (Signed URL 활용할 시)
  app.use(graphqlUploadExpress());

  // 로컬에 저장하기 위함.
  // 로컬에 저장하기 위한 정적 파일 제공
  app.use(logger("tiny"));
  app.use("/static", express.static("uploads"));

  // apollo server를 미들웨어처럼 추가하고 있음. 그리고 설정도 여기서 같이 해주고 있음. 다른 미들웨어랑은 달리 '/graphql', expressMiddleware 같은 요소가 있음
  // /graphql 부분은 커스텀 설정 가능.
  // 아래 아래가 원래 코드
  app.use(
    '/graphql',
    expressMiddleware(apollo, {
      context: async (ctx) => {
        const { req } = ctx;
        const token = req.headers.token as string || "";
        const loggedInUser = await getUser(token);
        return { loggedInUser, client, pubsub };
      },
    })
  );

  // const { url } = await startStandaloneServer(server, {
  //   listen: { port: PORT },
  //   context: async ( {req} ) => {

  //     return {
  //       loggedInUser: await getUser(req.headers.token),
  //     }
  //   }
  // });

  httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });

  // app.listen -> httpServer.listen 으로 변경 (부가)

  // console.log(`🚀 Server ready at ${url}`);
}

startServer();


// 부가 처리된 부분 요약
// HTTP 서버 생성 및 플러그인 추가: http.createServer(app) 및 ApolloServerPluginDrainHttpServer({ httpServer })를 통해 HTTP 서버 종료 처리를 관리합니다.
// CORS 미들웨어: cors()를 추가하여 모든 출처에서의 요청을 허용합니다.
// 기타 미들웨어 추가: express.json() 및 graphqlUploadExpress() 등 다양한 미들웨어를 추가하여 서버 기능을 확장합니다.