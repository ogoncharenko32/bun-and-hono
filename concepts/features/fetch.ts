async function fetchOperation() {
  const response = await fetch("https://dummyjson.com/posts/1");
  const text = await response.text();
  console.log(text);
}

fetchOperation();
