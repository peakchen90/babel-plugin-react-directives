const a = <div rd-if={testRoot}>A</div>;

const b = <div rd-if={testRoot}>
  <p rd-if={testA}>A</p>
  <p rd-else>B</p>
</div>;
