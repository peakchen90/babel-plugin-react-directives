const a = (
  <div
    {...spreadA}
    style={{
      ...styleA,
      ...(spreadA && spreadA.style),
      display: testA ? undefined : "none"
    }}>
    A
  </div>
);

const b = (
  <div
    {...spreadB}
    style={{
      ...(spreadB && spreadB.style),
      ...styleB,
      display: testB ? undefined : "none"
    }}>
    B
  </div>
);
