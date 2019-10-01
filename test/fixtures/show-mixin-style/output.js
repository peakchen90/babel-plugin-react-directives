const a = <div style={{
  ...{ color: "red" },
  display: testA ? undefined : "none"
}}>A</div>;

const b = <div style={{
  ...styleA,
  display: testB ? undefined : "none"
}}>B</div>;
