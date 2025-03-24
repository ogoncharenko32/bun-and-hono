function binaryDataOperation() {
  const buf = new ArrayBuffer(8);
  console.log(buf.byteLength);

  const dv = new DataView(buf);
  console.log(dv);
  dv.setUint8(0, 3);
  dv.setUint16(1, 513);

  console.log(dv.getUint8(0));
  console.log(dv.getUint16(1));
  console.log(dv);
}

binaryDataOperation();
