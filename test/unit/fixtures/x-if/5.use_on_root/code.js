const a = <div x-if={testRoot}>A</div>;

const b = <div x-if={testRoot}>
  <p x-if={testA}>A</p>
  <p x-else>B</p>
</div>;
