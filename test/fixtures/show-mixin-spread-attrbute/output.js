const a = <div {...spreadA} style={{
  ...(spreadA && spreadA.style),
  display: testA ? undefined : "none"
}}>A</div>;

const b = <div {...spreadBa} {...spreadBb} style={{
  ...(spreadBa && spreadBa.style),
  ...(spreadBb && spreadBb.style),
  display: testB ? undefined : "none"
}}>B</div>;
