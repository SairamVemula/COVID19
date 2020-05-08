const arr = [
  { timestamp: new Date(1588689202000) },
  { timestamp: new Date(1588343602000) },
  { timestamp: new Date(1588257202000) },
  { timestamp: new Date(1588170802000) },
  { timestamp: new Date(1587393202000) },
  { timestamp: new Date(1587393202000) },
  { timestamp: new Date(1587393202000) },
  { timestamp: new Date(1587393202000) },
  { timestamp: new Date(1587393202000) },
  { timestamp: new Date(1587393202000) },
  { timestamp: new Date(1587393202000) },
  { timestamp: new Date(1587393202000) },
  { timestamp: new Date(Date.now()) },
];
console.log(arr);

ar = arr.filter((a) => a.timestamp > new Date(Date.now() - 1209600000));

console.log(ar);

a=[]
console.log(a.length)

// new Date(Date.now() - 1209600000)
