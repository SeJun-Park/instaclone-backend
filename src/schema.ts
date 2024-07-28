import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { loadFiles } from '@graphql-tools/load-files';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function loadSchema() {
  const loadedTypes = await loadFiles(join(__dirname, '**/*.typeDefs.ts'));
  const typeDefs = mergeTypeDefs(loadedTypes);

  const loadedResolvers = await loadFiles(join(__dirname, '**/*.resolvers.ts'));
  const resolvers = mergeResolvers(loadedResolvers);

  return makeExecutableSchema({ typeDefs, resolvers });
}

const schema = await loadSchema();

export default schema;










// import { fileURLToPath } from 'url';
// import { dirname, join } from 'path';
// import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
// import { makeExecutableSchema } from "@graphql-tools/schema";
// import { loadFiles, loadFilesSync } from '@graphql-tools/load-files';

// // ES 모듈에서 __dirname을 설정하는 방법
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// // 강의 버전

// const loadedTypes = loadFilesSync(`${__dirname}/**/*.typeDefs.js`);
//     // 모든 폴더에 있는 파일을 찾아서 (**) 파일 이름이 뭐든 간(*) .typeDefs.js 로 끝나는 파일을 찾아옴.
// const typeDefs = mergeTypeDefs(loadedTypes);
//     // loadedTypes 로 모아온 파일을 하나로 섞어버림.

// const loadedResolvers = loadFilesSync(`${__dirname}/**/*.{queries,mutations}.js`);
// const resolvers = mergeResolvers(loadedResolvers);

// const schema = makeExecutableSchema({typeDefs, resolvers});

// export default schema; 