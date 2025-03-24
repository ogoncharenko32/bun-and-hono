function importMetaEnv() {
  console.log(import.meta.url);
  console.log(import.meta.main);
  // console.log(import.meta.env);
  console.log(Bun.env.NODE_ENV);
}

importMetaEnv();
