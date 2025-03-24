import type { BunFile } from "bun";

async function fileSystemOperation() {
  //Read file
  const file: BunFile = await Bun.file("read.txt");
  console.log(file.size);
  console.log(file.type);

  const text = await file.text();
  console.log(text);

  const buffer = await file.arrayBuffer();
  console.log(buffer);

  const content = "Hello Bun! I'm learning Bun!";
  await Bun.write("write.txt", content);

  const readFile = await Bun.file("read.txt");
  await Bun.write("read_copy.txt", readFile);

  const isFileExist = await Bun.file("read_copy.txt").exists();
  console.log(isFileExist);

  await Bun.file("read_copy.txt").delete();
}

fileSystemOperation();
